# PDF Master

A comprehensive web-based PDF manipulation toolkit with 17+ professional-grade PDF operations.

## 🚀 Features

- ✅ **Merge PDF** - Combine multiple PDFs into one
- ✅ **Split PDF** - Extract specific pages
- ✅ **Compress PDF** - Reduce file size
- ✅ **Rotate PDF** - Rotate pages
- ✅ **PDF to JPG/PNG** - Convert to images
- ✅ **JPG/PNG to PDF** - Convert images to PDF
- ✅ **PDF to Word/Excel** - Document conversion
- ✅ **Word/Excel to PDF** - Document to PDF
- ✅ **OCR** - Extract text from PDF
- ✅ **Watermark** - Add watermark
- ✅ **Protect/Unlock PDF** - Password management
- ✅ **Sign PDF** - Add digital signature
- 🔍 **Search Bar** - Find tools quickly
- 🌓 **Dark/Light Mode** - Theme toggle

## 🛠️ Tech Stack

**Frontend:**

- React 19
- Tailwind CSS
- Framer Motion
- Lucide React Icons

**Backend:**

- Python 3.10
- FastAPI
- PyPDF
- pdf2docx
- Pytesseract

## 📦 Installation

### Prerequisites

- Python 3.10+
- Node.js 16+
- MongoDB (optional)

### Backend Setup

```bash
# Navigate to backend folder
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
# MONGO_URL="mongodb://localhost:27017"
# DB_NAME="pdf_master"
# CORS_ORIGINS="*"

# Run server
uvicorn server:app --reload --port 8000
```

### Frontend Setup

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Run development server
npm start
```

The app will open at `http://localhost:3000`

## 🌐 API Endpoints

- `POST /api/merge` - Merge PDFs
- `POST /api/split` - Split PDF
- `POST /api/compress` - Compress PDF
- `POST /api/rotate` - Rotate PDF
- `POST /api/pdf-to-jpg` - PDF to JPG
- `POST /api/pdf-to-png` - PDF to PNG
- `POST /api/jpg-to-pdf` - JPG to PDF
- `POST /api/png-to-pdf` - PNG to PDF
- `POST /api/pdf-to-word` - PDF to Word
- `POST /api/word-to-pdf` - Word to PDF
- `POST /api/pdf-to-excel` - PDF to Excel
- `POST /api/excel-to-pdf` - Excel to PDF
- `POST /api/ocr` - OCR extraction
- `POST /api/watermark` - Add watermark
- `POST /api/protect` - Protect PDF
- `POST /api/unlock` - Unlock PDF
- `POST /api/sign` - Sign PDF

## 📧 Contact

- **Email**: princethakur545454@gmail.com
- **LinkedIn**: [Prince Thakur](https://www.linkedin.com/in/prince-thakur-578919272/)
- **GitHub**: [princethakur931](https://github.com/princethakur931)

## 📄 License

All files are processed securely and deleted after use.

© 2025 PDF Master
