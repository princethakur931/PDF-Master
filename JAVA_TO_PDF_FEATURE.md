# Java to PDF Conversion Feature

## Overview
This feature allows users to convert Java source code files (.java) to PDF format with proper formatting and line numbers.

## Backend Implementation

### Endpoint
- **URL**: `/api/java-to-pdf`
- **Method**: POST
- **Content-Type**: multipart/form-data

### Request Parameters
- `file`: Java source file (.java extension required)

### Response
- Returns a PDF file containing the formatted Java source code
- Includes:
  - File header with original filename
  - Line numbers for each line of code
  - Monospaced font (Courier) for code readability
  - Automatic pagination for long files

### Error Handling
- Validates file extension (must be .java)
- Handles encoding errors (UTF-8 expected)
- Proper cleanup of temporary files

## Frontend Implementation

### Home Page
- Added new tool card: "Java to PDF"
- Icon: FileCode (from lucide-react)
- Color gradient: orange-600 to red-600
- Category: "Convert to PDF" section

### Tool Page
- File upload accepts: `.java` files only
- Single file upload (not multiple)
- No additional input required
- Output: PDF file with same base name as input

## Technical Details

### Dependencies
- **Backend**: 
  - reportlab (already in requirements.txt)
  - Pygments (already in requirements.txt) - ready for future syntax highlighting enhancement
  
- **Frontend**:
  - lucide-react (FileCode icon)
  - react-dropzone (file upload)
  - axios (API calls)

### File Processing
1. User uploads .java file through frontend
2. Backend validates file extension
3. Reads file content with UTF-8 encoding
4. Creates PDF using ReportLab canvas
5. Formats code with:
   - Line numbers (4 digits, gray color)
   - Courier font (size 9) for code
   - 50pt margins
   - Automatic page breaks
   - 12pt line height
6. Returns PDF to user

## Usage Example

1. Navigate to "Java to PDF" tool from home page or menu
2. Upload a .java file (drag & drop or click to select)
3. Click "Process" button
4. Download the generated PDF

## Testing

A sample Java file is provided at:
`test_samples/HelloWorld.java`

This file contains:
- Class definition
- Constructor
- Methods (static and instance)
- Comments
- Control structures (for loops, if statements)
- Recursion example

## Future Enhancements

Possible improvements:
- Syntax highlighting using Pygments (imports already added)
- Color-coded keywords, strings, and comments
- Custom font size options
- Code formatting/beautification
- Support for other programming languages (.py, .js, .cpp, etc.)
