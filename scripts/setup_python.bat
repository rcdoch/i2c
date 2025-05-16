@echo off
echo Instalando dependencias de Python para el procesamiento de PDFs...

REM Verificar si Python está instalado
python --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Error: Python no está instalado. Por favor, instala Python 3.x
    exit /b 1
)

echo Usando Python: 
python --version

REM Instalar dependencias desde requirements.txt
python -m pip install -r requirements.txt

REM Verificar si Tesseract OCR está instalado
tesseract --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Advertencia: Tesseract OCR no está instalado.
    echo Para instalar Tesseract OCR en Windows:
    echo   - Descarga e instala desde https://github.com/UB-Mannheim/tesseract/wiki
    echo   - Asegúrate de que la ruta de Tesseract esté en la variable PATH
) else (
    echo Tesseract OCR está instalado
)

echo Configuración completada.
