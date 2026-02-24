import os
import sys
import subprocess

def install_and_import(package):
    try:
        __import__(package)
    except ImportError:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "PyMuPDF"])

install_and_import("fitz")
import fitz  # PyMuPDF

def extract_text(pdf_path, txt_path):
    print(f"Extracting {pdf_path}")
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text() + "\n"
    with open(txt_path, 'w', encoding='utf-8') as f:
        f.write(text)

files = [
    "Die flüchtige Wahrheit der Kunst_Verlag.pdf",
    "Lehmann Vorträge.pdf",
    "Lehmann_Kunst_Satz_V8 (2).pdf",
    "lehmann gehalt (2).pdf"
]

for file in files:
    try:
        extract_text(file, file + ".txt")
        print(f"Success for {file}")
    except Exception as e:
        print(f"Failed to read {file}: {e}")
