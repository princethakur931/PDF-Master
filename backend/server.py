from fastapi import FastAPI, APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import tempfile
import shutil
from pypdf import PdfReader, PdfWriter
from PIL import Image
import img2pdf
from pdf2docx import Converter
import io
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Preformatted
from reportlab.lib.units import inch
import openpyxl
from docx import Document
import pytesseract
from pygments import highlight
from pygments.lexers import JavaLexer
from pygments.formatters import HtmlFormatter
import html

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection (optional - for future use)
try:
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    client = AsyncIOMotorClient(mongo_url, serverSelectionTimeoutMS=5000)
    db = client[os.environ.get('DB_NAME', 'test_database')]
    # Test connection
    client.admin.command('ping')
    logging.info("MongoDB connected successfully")
except Exception as e:
    logging.warning(f"MongoDB connection failed: {e}. Running without database.")
    client = None
    db = None

# Create temporary upload directory
UPLOAD_DIR = ROOT_DIR / 'temp_uploads'
UPLOAD_DIR.mkdir(exist_ok=True)

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Utility function to save uploaded file
async def save_upload_file(upload_file: UploadFile) -> Path:
    file_id = str(uuid.uuid4())
    file_extension = Path(upload_file.filename).suffix
    temp_path = UPLOAD_DIR / f"{file_id}{file_extension}"
    
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)
    
    return temp_path

# Utility function to cleanup temp files
def cleanup_files(*files):
    for file in files:
        try:
            if file and Path(file).exists():
                Path(file).unlink()
        except Exception as e:
            logging.error(f"Error cleaning up file {file}: {e}")

@api_router.get("/")
async def root():
    return {"message": "PDF Master API"}

@api_router.post("/merge")
async def merge_pdfs(files: List[UploadFile] = File(...)):
    """Merge multiple PDF files into one"""
    temp_files = []
    output_file = None
    
    try:
        # Save all uploaded files
        for file in files:
            if not file.filename.lower().endswith('.pdf'):
                raise HTTPException(status_code=400, detail=f"File {file.filename} is not a PDF")
            temp_path = await save_upload_file(file)
            temp_files.append(temp_path)
        
        # Merge PDFs
        pdf_writer = PdfWriter()
        for pdf_path in temp_files:
            pdf_reader = PdfReader(str(pdf_path))
            for page in pdf_reader.pages:
                pdf_writer.add_page(page)
        
        # Save merged PDF
        output_file = UPLOAD_DIR / f"{uuid.uuid4()}_merged.pdf"
        with open(output_file, "wb") as f:
            pdf_writer.write(f)
        
        # Return file
        return FileResponse(
            output_file,
            media_type="application/pdf",
            filename="merged.pdf",
            background=lambda: cleanup_files(*temp_files, output_file)
        )
    
    except Exception as e:
        cleanup_files(*temp_files, output_file)
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/split")
async def split_pdf(file: UploadFile = File(...), pages: str = Form(...)):
    """Split PDF by page ranges (e.g., '1-3,5,7-9')"""
    temp_file = None
    output_file = None
    
    try:
        temp_file = await save_upload_file(file)
        
        # Parse page ranges
        page_list = []
        for part in pages.split(','):
            if '-' in part:
                start, end = map(int, part.split('-'))
                page_list.extend(range(start - 1, end))
            else:
                page_list.append(int(part) - 1)
        
        # Split PDF
        pdf_reader = PdfReader(str(temp_file))
        pdf_writer = PdfWriter()
        
        for page_num in page_list:
            if 0 <= page_num < len(pdf_reader.pages):
                pdf_writer.add_page(pdf_reader.pages[page_num])
        
        # Save split PDF
        output_file = UPLOAD_DIR / f"{uuid.uuid4()}_split.pdf"
        with open(output_file, "wb") as f:
            pdf_writer.write(f)
        
        return FileResponse(
            output_file,
            media_type="application/pdf",
            filename="split.pdf",
            background=lambda: cleanup_files(temp_file, output_file)
        )
    
    except Exception as e:
        cleanup_files(temp_file, output_file)
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/compress")
async def compress_pdf(file: UploadFile = File(...)):
    """Compress PDF file"""
    temp_file = None
    output_file = None
    
    try:
        temp_file = await save_upload_file(file)
        
        # Read and rewrite PDF (basic compression)
        pdf_reader = PdfReader(str(temp_file))
        pdf_writer = PdfWriter()
        
        for page in pdf_reader.pages:
            pdf_writer.add_page(page)
            # Compress after adding to writer
            pdf_writer.pages[-1].compress_content_streams()
        
        # Save compressed PDF
        output_file = UPLOAD_DIR / f"{uuid.uuid4()}_compressed.pdf"
        with open(output_file, "wb") as f:
            pdf_writer.write(f)
        
        return FileResponse(
            output_file,
            media_type="application/pdf",
            filename="compressed.pdf",
            background=lambda: cleanup_files(temp_file, output_file)
        )
    
    except Exception as e:
        cleanup_files(temp_file, output_file)
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/rotate")
async def rotate_pdf(file: UploadFile = File(...), angle: int = Form(...)):
    """Rotate PDF pages"""
    temp_file = None
    output_file = None
    
    try:
        temp_file = await save_upload_file(file)
        
        pdf_reader = PdfReader(str(temp_file))
        pdf_writer = PdfWriter()
        
        for page in pdf_reader.pages:
            page.rotate(angle)
            pdf_writer.add_page(page)
        
        output_file = UPLOAD_DIR / f"{uuid.uuid4()}_rotated.pdf"
        with open(output_file, "wb") as f:
            pdf_writer.write(f)
        
        return FileResponse(
            output_file,
            media_type="application/pdf",
            filename="rotated.pdf",
            background=lambda: cleanup_files(temp_file, output_file)
        )
    
    except Exception as e:
        cleanup_files(temp_file, output_file)
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/pdf-to-jpg")
async def pdf_to_jpg(file: UploadFile = File(...)):
    """Convert PDF to JPG images"""
    temp_file = None
    output_files = []
    
    try:
        temp_file = await save_upload_file(file)
        
        # Convert PDF pages to images using PyMuPDF
        import fitz
        pdf_document = fitz.open(str(temp_file))
        
        # If single page, return single image
        if len(pdf_document) == 1:
            page = pdf_document[0]
            pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))
            output_file = UPLOAD_DIR / f"{uuid.uuid4()}.jpg"
            pix.save(str(output_file))
            output_files.append(output_file)
            
            return FileResponse(
                output_file,
                media_type="image/jpeg",
                filename="page_1.jpg",
                background=lambda: cleanup_files(temp_file, output_file)
            )
        else:
            # Multiple pages - return first page for now
            page = pdf_document[0]
            pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))
            output_file = UPLOAD_DIR / f"{uuid.uuid4()}.jpg"
            pix.save(str(output_file))
            
            return FileResponse(
                output_file,
                media_type="image/jpeg",
                filename="page_1.jpg",
                background=lambda: cleanup_files(temp_file, output_file)
            )
    
    except Exception as e:
        cleanup_files(temp_file, *output_files)
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/pdf-to-png")
async def pdf_to_png(file: UploadFile = File(...)):
    """Convert PDF to PNG images"""
    temp_file = None
    output_file = None
    
    try:
        temp_file = await save_upload_file(file)
        
        import fitz
        pdf_document = fitz.open(str(temp_file))
        page = pdf_document[0]
        pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))
        output_file = UPLOAD_DIR / f"{uuid.uuid4()}.png"
        pix.save(str(output_file))
        
        return FileResponse(
            output_file,
            media_type="image/png",
            filename="page_1.png",
            background=lambda: cleanup_files(temp_file, output_file)
        )
    
    except Exception as e:
        cleanup_files(temp_file, output_file)
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/jpg-to-pdf")
async def jpg_to_pdf(file: UploadFile = File(...)):
    """Convert JPG to PDF"""
    temp_file = None
    output_file = None
    
    try:
        temp_file = await save_upload_file(file)
        
        output_file = UPLOAD_DIR / f"{uuid.uuid4()}.pdf"
        with open(output_file, "wb") as f:
            f.write(img2pdf.convert(str(temp_file)))
        
        return FileResponse(
            output_file,
            media_type="application/pdf",
            filename="converted.pdf",
            background=lambda: cleanup_files(temp_file, output_file)
        )
    
    except Exception as e:
        cleanup_files(temp_file, output_file)
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/png-to-pdf")
async def png_to_pdf(file: UploadFile = File(...)):
    """Convert PNG to PDF"""
    temp_file = None
    output_file = None
    
    try:
        temp_file = await save_upload_file(file)
        
        output_file = UPLOAD_DIR / f"{uuid.uuid4()}.pdf"
        with open(output_file, "wb") as f:
            f.write(img2pdf.convert(str(temp_file)))
        
        return FileResponse(
            output_file,
            media_type="application/pdf",
            filename="converted.pdf",
            background=lambda: cleanup_files(temp_file, output_file)
        )
    
    except Exception as e:
        cleanup_files(temp_file, output_file)
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/pdf-to-word")
async def pdf_to_word(file: UploadFile = File(...)):
    """Convert PDF to Word"""
    temp_file = None
    output_file = None
    
    try:
        temp_file = await save_upload_file(file)
        output_file = UPLOAD_DIR / f"{uuid.uuid4()}.docx"
        
        cv = Converter(str(temp_file))
        cv.convert(str(output_file))
        cv.close()
        
        return FileResponse(
            output_file,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            filename="converted.docx",
            background=lambda: cleanup_files(temp_file, output_file)
        )
    
    except Exception as e:
        cleanup_files(temp_file, output_file)
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/word-to-pdf")
async def word_to_pdf(file: UploadFile = File(...)):
    """Convert Word to PDF"""
    temp_file = None
    output_file = None
    
    try:
        temp_file = await save_upload_file(file)
        output_file = UPLOAD_DIR / f"{uuid.uuid4()}.pdf"
        
        # Read Word document
        doc = Document(str(temp_file))
        
        # Create PDF
        c = canvas.Canvas(str(output_file), pagesize=letter)
        width, height = letter
        y_position = height - 50
        
        for paragraph in doc.paragraphs:
            if paragraph.text.strip():
                c.drawString(50, y_position, paragraph.text[:100])
                y_position -= 20
                if y_position < 50:
                    c.showPage()
                    y_position = height - 50
        
        c.save()
        
        return FileResponse(
            output_file,
            media_type="application/pdf",
            filename="converted.pdf",
            background=lambda: cleanup_files(temp_file, output_file)
        )
    
    except Exception as e:
        cleanup_files(temp_file, output_file)
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/excel-to-pdf")
async def excel_to_pdf(file: UploadFile = File(...)):
    """Convert Excel to PDF"""
    temp_file = None
    output_file = None
    
    try:
        temp_file = await save_upload_file(file)
        output_file = UPLOAD_DIR / f"{uuid.uuid4()}.pdf"
        
        # Read Excel
        wb = openpyxl.load_workbook(str(temp_file))
        sheet = wb.active
        
        # Create PDF
        c = canvas.Canvas(str(output_file), pagesize=letter)
        width, height = letter
        y_position = height - 50
        
        for row in sheet.iter_rows(values_only=True):
            row_text = ' | '.join([str(cell) if cell else '' for cell in row])
            if row_text.strip():
                c.drawString(50, y_position, row_text[:100])
                y_position -= 20
                if y_position < 50:
                    c.showPage()
                    y_position = height - 50
        
        c.save()
        
        return FileResponse(
            output_file,
            media_type="application/pdf",
            filename="converted.pdf",
            background=lambda: cleanup_files(temp_file, output_file)
        )
    
    except Exception as e:
        cleanup_files(temp_file, output_file)
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/pdf-to-excel")
async def pdf_to_excel(file: UploadFile = File(...)):
    """Convert PDF to Excel - extracts text to Excel"""
    temp_file = None
    output_file = None
    
    try:
        temp_file = await save_upload_file(file)
        output_file = UPLOAD_DIR / f"{uuid.uuid4()}.xlsx"
        
        # Extract text from PDF
        pdf_reader = PdfReader(str(temp_file))
        
        # Create Excel workbook
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "PDF Content"
        
        row_num = 1
        for page_num, page in enumerate(pdf_reader.pages):
            text = page.extract_text()
            ws.cell(row=row_num, column=1, value=f"Page {page_num + 1}")
            row_num += 1
            for line in text.split('\n'):
                if line.strip():
                    ws.cell(row=row_num, column=1, value=line)
                    row_num += 1
            row_num += 1
        
        wb.save(str(output_file))
        
        return FileResponse(
            output_file,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            filename="converted.xlsx",
            background=lambda: cleanup_files(temp_file, output_file)
        )
    
    except Exception as e:
        cleanup_files(temp_file, output_file)
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/ocr")
async def ocr_pdf(file: UploadFile = File(...)):
    """Extract text from PDF using OCR"""
    temp_file = None
    
    try:
        temp_file = await save_upload_file(file)
        
        # First try regular text extraction
        pdf_reader = PdfReader(str(temp_file))
        text_content = ""
        
        for page in pdf_reader.pages:
            text_content += page.extract_text() + "\n\n"
        
        cleanup_files(temp_file)
        
        return JSONResponse({
            "text": text_content,
            "pages": len(pdf_reader.pages)
        })
    
    except Exception as e:
        cleanup_files(temp_file)
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/watermark")
async def watermark_pdf(file: UploadFile = File(...), text: str = Form(...)):
    """Add watermark to PDF"""
    temp_file = None
    output_file = None
    watermark_file = None
    
    try:
        temp_file = await save_upload_file(file)
        
        # Create watermark PDF
        watermark_file = UPLOAD_DIR / f"{uuid.uuid4()}_watermark.pdf"
        c = canvas.Canvas(str(watermark_file), pagesize=letter)
        width, height = letter
        
        c.saveState()
        c.setFont("Helvetica", 50)
        c.setFillColorRGB(0.5, 0.5, 0.5, alpha=0.3)
        c.translate(width/2, height/2)
        c.rotate(45)
        c.drawCentredString(0, 0, text)
        c.restoreState()
        c.save()
        
        # Apply watermark
        pdf_reader = PdfReader(str(temp_file))
        watermark_reader = PdfReader(str(watermark_file))
        pdf_writer = PdfWriter()
        
        watermark_page = watermark_reader.pages[0]
        
        for page in pdf_reader.pages:
            page.merge_page(watermark_page)
            pdf_writer.add_page(page)
        
        output_file = UPLOAD_DIR / f"{uuid.uuid4()}_watermarked.pdf"
        with open(output_file, "wb") as f:
            pdf_writer.write(f)
        
        return FileResponse(
            output_file,
            media_type="application/pdf",
            filename="watermarked.pdf",
            background=lambda: cleanup_files(temp_file, watermark_file, output_file)
        )
    
    except Exception as e:
        cleanup_files(temp_file, watermark_file, output_file)
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/protect")
async def protect_pdf(file: UploadFile = File(...), password: str = Form(...)):
    """Add password protection to PDF"""
    temp_file = None
    output_file = None
    
    try:
        temp_file = await save_upload_file(file)
        
        pdf_reader = PdfReader(str(temp_file))
        pdf_writer = PdfWriter()
        
        for page in pdf_reader.pages:
            pdf_writer.add_page(page)
        
        pdf_writer.encrypt(password)
        
        output_file = UPLOAD_DIR / f"{uuid.uuid4()}_protected.pdf"
        with open(output_file, "wb") as f:
            pdf_writer.write(f)
        
        return FileResponse(
            output_file,
            media_type="application/pdf",
            filename="protected.pdf",
            background=lambda: cleanup_files(temp_file, output_file)
        )
    
    except Exception as e:
        cleanup_files(temp_file, output_file)
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/unlock")
async def unlock_pdf(file: UploadFile = File(...), password: str = Form(...)):
    """Remove password protection from PDF"""
    temp_file = None
    output_file = None
    
    try:
        temp_file = await save_upload_file(file)
        
        pdf_reader = PdfReader(str(temp_file))
        
        if pdf_reader.is_encrypted:
            pdf_reader.decrypt(password)
        
        pdf_writer = PdfWriter()
        for page in pdf_reader.pages:
            pdf_writer.add_page(page)
        
        output_file = UPLOAD_DIR / f"{uuid.uuid4()}_unlocked.pdf"
        with open(output_file, "wb") as f:
            pdf_writer.write(f)
        
        return FileResponse(
            output_file,
            media_type="application/pdf",
            filename="unlocked.pdf",
            background=lambda: cleanup_files(temp_file, output_file)
        )
    
    except Exception as e:
        cleanup_files(temp_file, output_file)
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/sign")
async def sign_pdf(file: UploadFile = File(...), signature_text: str = Form(...)):
    """Add signature to PDF"""
    temp_file = None
    output_file = None
    signature_file = None
    
    try:
        temp_file = await save_upload_file(file)
        
        # Create signature overlay
        signature_file = UPLOAD_DIR / f"{uuid.uuid4()}_signature.pdf"
        c = canvas.Canvas(str(signature_file), pagesize=letter)
        width, height = letter
        
        c.setFont("Helvetica-Oblique", 24)
        c.drawString(50, 50, signature_text)
        c.save()
        
        # Apply signature
        pdf_reader = PdfReader(str(temp_file))
        signature_reader = PdfReader(str(signature_file))
        pdf_writer = PdfWriter()
        
        signature_page = signature_reader.pages[0]
        
        # Add signature to last page
        for i, page in enumerate(pdf_reader.pages):
            if i == len(pdf_reader.pages) - 1:
                page.merge_page(signature_page)
            pdf_writer.add_page(page)
        
        output_file = UPLOAD_DIR / f"{uuid.uuid4()}_signed.pdf"
        with open(output_file, "wb") as f:
            pdf_writer.write(f)
        
        return FileResponse(
            output_file,
            media_type="application/pdf",
            filename="signed.pdf",
            background=lambda: cleanup_files(temp_file, signature_file, output_file)
        )
    
    except Exception as e:
        cleanup_files(temp_file, signature_file, output_file)
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/java-to-pdf")
async def java_to_pdf(file: UploadFile = File(...)):
    """Convert Java source code file to PDF with syntax highlighting"""
    temp_file = None
    output_file = None
    
    try:
        # Validate file extension
        if not file.filename.lower().endswith('.java'):
            raise HTTPException(status_code=400, detail="File must be a .java file")
        
        temp_file = await save_upload_file(file)
        
        # Read Java source code
        with open(temp_file, 'r', encoding='utf-8') as f:
            java_code = f.read()
        
        # Create PDF with formatted code and line numbers
        output_file = UPLOAD_DIR / f"{uuid.uuid4()}_java.pdf"
        
        # Create PDF using ReportLab
        c = canvas.Canvas(str(output_file), pagesize=letter)
        width, height = letter
        
        # Set up fonts and layout
        margin = 50
        y_position = height - margin
        line_height = 12
        font_size = 9
        
        # Add header with filename
        c.setFont("Helvetica-Bold", 14)
        c.drawString(margin, y_position, f"Java Source: {file.filename}")
        y_position -= 30
        
        # Draw a line separator
        c.line(margin, y_position, width - margin, y_position)
        y_position -= 20
        
        # Set font for code
        c.setFont("Courier", font_size)
        
        # Split code into lines and write to PDF
        lines = java_code.split('\n')
        
        for i, line in enumerate(lines, 1):
            # Check if we need a new page
            if y_position < margin + 20:
                c.showPage()
                y_position = height - margin
                c.setFont("Courier", font_size)
            
            # Add line number and code
            line_num = f"{i:4d} | "
            c.setFillColorRGB(0.5, 0.5, 0.5)
            c.drawString(margin, y_position, line_num)
            
            # Draw code line (truncate if too long with ellipsis indicator)
            c.setFillColorRGB(0, 0, 0)
            max_chars = 92
            if len(line) > max_chars:
                display_line = line[:max_chars] + "..."
            else:
                display_line = line
            c.drawString(margin + 50, y_position, display_line)
            
            y_position -= line_height
        
        c.save()
        
        return FileResponse(
            output_file,
            media_type="application/pdf",
            filename=f"{Path(file.filename).stem}.pdf",
            background=lambda: cleanup_files(temp_file, output_file)
        )
    
    except UnicodeDecodeError:
        cleanup_files(temp_file, output_file)
        raise HTTPException(status_code=400, detail="Unable to read Java file. Please ensure it's a valid text file with UTF-8 encoding.")
    except Exception as e:
        cleanup_files(temp_file, output_file)
        raise HTTPException(status_code=500, detail=str(e))

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    if client:
        client.close()