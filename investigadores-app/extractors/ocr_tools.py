from pdf2image import convert_from_path
import pytesseract

def extraer_texto_ocr(path_pdf):
    texto_final = ""
    try:
        paginas = convert_from_path(path_pdf, dpi=300)
        for imagen in paginas:
            texto = pytesseract.image_to_string(imagen, lang='spa')
            texto_final += texto + "\n"
    except Exception as e:
        texto_final = f"OCR_FAILED: {e}"
    return texto_final
