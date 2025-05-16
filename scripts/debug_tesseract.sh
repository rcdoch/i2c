#!/bin/bash

# Script para verificar la instalación de Tesseract OCR y sus capacidades

echo "=== Verificando instalación de Tesseract OCR ==="

# Verificar si Tesseract está instalado
if command -v tesseract &>/dev/null; then
    echo "✅ Tesseract OCR está instalado"
    echo "Versión: $(tesseract --version | head -n 1)"
    
    # Verificar idiomas disponibles
    echo "Idiomas disponibles:"
    tesseract --list-langs
    
    # Verificar si el idioma español está disponible
    if tesseract --list-langs 2>&1 | grep -q "spa"; then
        echo "✅ El idioma español (spa) está disponible"
    else
        echo "❌ El idioma español (spa) NO está disponible"
        echo "Para instalar el idioma español:"
        echo "  - En Ubuntu/Debian: sudo apt-get install tesseract-ocr-spa"
        echo "  - En macOS: brew install tesseract-lang"
        echo "  - En Windows: Descarga el paquete de idioma desde https://github.com/tesseract-ocr/tessdata/"
    fi
else
    echo "❌ Tesseract OCR NO está instalado"
    echo "Para instalar Tesseract OCR:"
    echo "  - En Windows: Descarga e instala desde https://github.com/UB-Mannheim/tesseract/wiki"
    echo "  - En macOS: brew install tesseract"
    echo "  - En Ubuntu/Debian: sudo apt-get install tesseract-ocr"
    echo "  - En CentOS/RHEL: sudo yum install tesseract"
fi

echo ""
echo "=== Verificando instalación de Python y dependencias ==="

# Verificar si Python está instalado
if command -v python3 &>/dev/null; then
    PYTHON_CMD=python3
elif command -v python &>/dev/null; then
    PYTHON_CMD=python
else
    echo "❌ Python no está instalado"
    exit 1
fi

echo "✅ Python está instalado: $($PYTHON_CMD --version)"

# Verificar dependencias de Python
echo "Verificando dependencias de Python:"
$PYTHON_CMD -c "
try:
    import fitz
    print('✅ PyMuPDF (fitz) está instalado')
except ImportError:
    print('❌ PyMuPDF (fitz) NO está instalado')

try:
    import pdf2image
    print('✅ pdf2image está instalado')
except ImportError:
    print('❌ pdf2image NO está instalado')

try:
    import pytesseract
    print('✅ pytesseract está instalado')
except ImportError:
    print('❌ pytesseract NO está instalado')
"

echo ""
echo "Para instalar todas las dependencias necesarias:"
echo "pip install PyMuPDF pdf2image pytesseract"
