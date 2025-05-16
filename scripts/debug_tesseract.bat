@echo off
echo === Verificando instalacion de Tesseract OCR ===

REM Verificar si Tesseract está instalado
tesseract --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Tesseract OCR esta instalado
    echo Version:
    tesseract --version | findstr /B /C:"tesseract"
    
    REM Verificar idiomas disponibles
    echo Idiomas disponibles:
    tesseract --list-langs
    
    REM Verificar si el idioma español está disponible
    tesseract --list-langs 2>&1 | findstr /C:"spa" >nul
    if %ERRORLEVEL% EQU 0 (
        echo ✅ El idioma espanol (spa) esta disponible
    ) else (
        echo ❌ El idioma espanol (spa) NO esta disponible
        echo Para instalar el idioma espanol:
        echo   - En Windows: Descarga el paquete de idioma desde https://github.com/tesseract-ocr/tessdata/
        echo   - Coloca el archivo spa.traineddata en la carpeta tessdata de tu instalacion de Tesseract
    )
) else (
    echo ❌ Tesseract OCR NO esta instalado
    echo Para instalar Tesseract OCR en Windows:
    echo   - Descarga e instala desde https://github.com/UB-Mannheim/tesseract/wiki
    echo   - Asegurate de que la ruta de Tesseract este en la variable PATH
)

echo.
echo === Verificando instalacion de Python y dependencias ===

REM Verificar si Python está instalado
python --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Python esta instalado:
    python --version
) else (
    echo ❌ Python no esta instalado
    exit /b 1
)

REM Verificar dependencias de Python
echo Verificando dependencias de Python:
python -c "
try:
    import fitz
    print('✅ PyMuPDF (fitz) esta instalado')
except ImportError:
    print('❌ PyMuPDF (fitz) NO esta instalado')

try:
    import pdf2image
    print('✅ pdf2image esta instalado')
except ImportError:
    print('❌ pdf2image NO esta instalado')

try:
    import pytesseract
    print('✅ pytesseract esta instalado')
except ImportError:
    print('❌ pytesseract NO esta instalado')
"

echo.
echo Para instalar todas las dependencias necesarias:
echo pip install PyMuPDF pdf2image pytesseract
