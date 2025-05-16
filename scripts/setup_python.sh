#!/bin/bash

# Script para instalar las dependencias de Python necesarias para el procesamiento de PDFs

echo "Instalando dependencias de Python para el procesamiento de PDFs..."

# Verificar si Python está instalado
if command -v python3 &>/dev/null; then
    PYTHON_CMD=python3
elif command -v python &>/dev/null; then
    PYTHON_CMD=python
else
    echo "Error: Python no está instalado. Por favor, instala Python 3.x"
    exit 1
fi

echo "Usando Python: $($PYTHON_CMD --version)"

# Instalar dependencias desde requirements.txt
$PYTHON_CMD -m pip install -r requirements.txt

# Verificar si Tesseract OCR está instalado
if command -v tesseract &>/dev/null; then
    echo "Tesseract OCR está instalado: $(tesseract --version | head -n 1)"
else
    echo "Advertencia: Tesseract OCR no está instalado."
    echo "Para instalar Tesseract OCR:"
    echo "  - En Windows: Descarga e instala desde https://github.com/UB-Mannheim/tesseract/wiki"
    echo "  - En macOS: brew install tesseract"
    echo "  - En Ubuntu/Debian: sudo apt-get install tesseract-ocr"
    echo "  - En CentOS/RHEL: sudo yum install tesseract"
fi

echo "Configuración completada."
