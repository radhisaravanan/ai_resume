# backend/ai/pdf_parser.py
import sys
import os
from pypdf import PdfReader

def extract_pdf_text(file_path):
    if not os.path.exists(file_path):
        print(f"ERROR: PDF file not found at {file_path}")
        sys.exit(1)

    try:
        # Try reading as a standard binary PDF
        reader = PdfReader(file_path)
        text = ""
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
        
        print(text.strip())

    except Exception as pdf_error:
        # Fallback: If it's actually a plain text file masquerading as a PDF, read it directly
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                fallback_text = f.read()
            print(fallback_text.strip())
        except Exception as fallback_error:
            print(f"ERROR: Extraction failed. PDF Error: {str(pdf_error)}. Text Fallback Error: {str(fallback_error)}")
            sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("ERROR: Missing PDF path.")
        sys.exit(1)
        
    pdf_path = sys.argv[1]
    extract_pdf_text(pdf_path)