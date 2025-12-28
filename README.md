# PDF Master 📄

A comprehensive web-based PDF manipulation toolkit offering 17+ professional-grade PDF operations. Built with modern technologies for fast, efficient, and secure PDF processing.

> ⭐ **If you find this project helpful, please consider giving it a star on GitHub!** ⭐

## 🌐 Live PDF Master

**🚀 Visit and Explore:** [https://pdf-master-two.vercel.app/](https://pdf-master-two.vercel.app/)

Access all PDF tools directly in your browser - no installation, no signup required!

## ✨ Overview

PDF Master is a comprehensive toolkit that provides 17+ professional PDF tools in one place. Whether you need to merge documents, convert formats, compress files, or perform advanced operations like OCR and digital signatures, PDF Master has you covered.

## 🚀 Features

### Core PDF Operations

- ✅ **Merge PDF** - Combine multiple PDFs into a single document
- ✅ **Split PDF** - Extract specific pages or ranges from PDFs
- ✅ **Compress PDF** - Reduce file size while maintaining quality
- ✅ **Rotate PDF** - Rotate pages clockwise or counter-clockwise

### Format Conversion

- ✅ **PDF to Images** - Convert PDF to JPG/PNG format
- ✅ **Images to PDF** - Convert JPG/PNG images to PDF
- ✅ **PDF to Word** - Convert PDF to editable Word documents
- ✅ **Word to PDF** - Convert Word documents to PDF
- ✅ **PDF to Excel** - Extract tables and data to Excel
- ✅ **Excel to PDF** - Convert spreadsheets to PDF format

### Advanced Features

- ✅ **OCR (Optical Character Recognition)** - Extract text from scanned PDFs
- ✅ **Watermark** - Add custom watermarks to PDFs
- ✅ **Protect PDF** - Add password protection to PDFs
- ✅ **Unlock PDF** - Remove passwords from protected PDFs
- ✅ **Sign PDF** - Add digital signatures to documents
- ✅ **Source Code to PDF** - Convert programming code files to PDF with syntax highlighting

### User Experience

- 🔍 **Search Functionality** - Quickly find the tool you need
- 🌓 **Dark/Light Mode** - Toggle between themes for comfortable viewing
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- ⚡ **Fast Processing** - Optimized for quick file operations
- 🔗 **Share Without Download** - Share processed PDFs and documents directly without downloading

## 🛠️ Tech Stack

### Frontend

- **React 19.0** - Modern React with latest features
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality UI components built on Radix UI
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful, consistent icons
- **Axios** - HTTP client for API requests
- **React Dropzone** - Drag-and-drop file uploads
- **React Hook Form** - Efficient form handling
- **Sonner** - Toast notifications

### Backend

- **Python 3.10+** - Backend runtime
- **FastAPI** - High-performance async web framework

## 📦 Installation

### Prerequisites

- **Python 3.10 or higher**
- **Node.js 16 or higher**
- **npm or yarn** - Package manager
- **MongoDB** (Optional - for future features)
- **Tesseract OCR** (Required for OCR functionality)

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Create .env file (optional)
# Add the following variables:
# MONGO_URL="mongodb://localhost:27017"
# DB_NAME="pdf_master"
# CORS_ORIGINS="*"

# Start the backend server
python server.py
# Or using uvicorn:
uvicorn server:app --reload --port 8000
```

Backend will run on `http://localhost:8000`

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install Node dependencies
npm install
# Or with yarn:
yarn install

# Start development server
npm start
# Or with yarn:
yarn start
```

Frontend will open automatically at `http://localhost:3000`

### Quick Start (Both Servers)

For Windows users, convenience batch files are provided:

**Recommended: Start everything at once**

```bash
# Simply double-click or run from command line:
start-all.bat
```

This will automatically start both backend and frontend servers.

**Or start individually:**

```bash
cd backend
start.bat

cd frontend
start.bat
```

## 📁 Project Structure

```
pdf-master/
├── backend/                 # Python FastAPI backend
│   ├── server.py           # Main server file with all routes
│   ├── requirements.txt    # Python dependencies
│   └── start.bat          # Windows startup script
│
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── App.js         # Main application component
│   │   ├── pages/         # Page components
│   │   │   ├── Home.js    # Landing page with tool grid
│   │   │   └── ToolPage.js # Individual tool pages
│   │   ├── components/    # Reusable components
│   │   │   └── ui/        # shadcn/ui components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utility functions
│   ├── public/            # Static assets
│   ├── plugins/           # Custom webpack plugins
│   ├── package.json       # Node dependencies
│   └── start.bat         # Windows startup script
│
├── README.md              # Project documentation
└── start-all.bat         # Start both servers (Windows)
```

## 🔒 Security

- Files are processed server-side and automatically deleted after processing
- No files are permanently stored on the server
- Password-protected PDFs can be unlocked with proper authorization
- All operations are performed in isolated temporary directories

## 🌟 Future Enhancements

This project is actively under development! More tools and features coming soon:

- 🔜 PDF Comparison Tool
- 🔜 Form Field Editor
- 🔜 PDF Annotations & Comments
- 🔜 Batch Processing for multiple files
- 🔜 Cloud Storage Integration
- 🔜 User Accounts & History
- 🔜 API Key Management
- 🔜 Custom Branding Options
- 🔜 Advanced OCR with Multiple Languages
- 🔜 PDF Metadata Editor
- 🔜 E-Signature Verification
- 🔜 PDF Accessibility Checker

## 🤝 Contributing

Contributions are always welcome! We encourage open collaboration:

**Have an idea or feature request?**

- 💡 Create an issue describing your feature idea
- 🐛 Report bugs or suggest improvements
- 💬 Join discussions on existing issues

**Want to contribute code?**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

Feel free to openly contribute to any features you'd like to work on. All contributions, big or small, are appreciated!

## 📧 Contact

- **Email**: princethakur545454@gmail.com
- **LinkedIn**: [Prince Thakur](https://www.linkedin.com/in/prince-thakur-578919272/)
- **GitHub**: [princethakur931](https://github.com/princethakur931)

## 📝 License

This project is open source and available for personal and commercial use.
All files are processed securely and deleted after use.

---

**Made with ❤️ for PDF enthusiasts**  
© 2025 PDF Master
