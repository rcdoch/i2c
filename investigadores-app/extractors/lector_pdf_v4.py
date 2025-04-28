import fitz
import re
from datetime import datetime
from pdf2image import convert_from_path
import pytesseract
import os

pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def extraer_datos_pdf(path_pdf):
    texto = extraer_texto(path_pdf)
    lineas = [l.strip() for l in texto.split('\n') if l.strip()]

    datos = {
        "nombre_completo": extraer_nombre(lineas),
        "curp": extraer_por_regex(texto, r'\b[A-Z]{4}\d{6}[HM][A-Z]{5}[0-9A-Z]\d\b'),
        "rfc": extraer_rfc(texto, lineas),
        "no_cvu": extraer_cvu(lineas),
        "correo": extraer_por_regex(texto, r'[\w\.-]+@[\w\.-]+\.\w+'),
        "institucion": extraer_institucion(lineas),
        "linea_investigacion": buscar_contexto(lineas, "LÍNEA"),
        "fecha_registro": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "nombre_archivo_pdf": os.path.basename(path_pdf)
    }

    if datos["rfc"] == "NO DETECTADO" and datos["curp"] != "NO DETECTADO":
        datos["rfc"] = datos["curp"][:10] + 'XXX'

    return datos

def extraer_texto(path_pdf):
    try:
        with fitz.open(path_pdf) as doc:
            texto = "\n".join(page.get_text() for page in doc)
            return texto if len(texto.strip()) > 20 else extraer_texto_ocr(path_pdf)
    except:
        return extraer_texto_ocr(path_pdf)

def extraer_texto_ocr(path_pdf):
    try:
        return "\n".join(
            pytesseract.image_to_string(img, lang='spa')
            for img in convert_from_path(path_pdf, dpi=300)
        )
    except Exception as e:
        return f"OCR_ERROR: {str(e)}"

def extraer_cvu(lineas):
    """
    Detecta el número CVU basado en su posición anterior relativa a 'No.CVU' o en la misma línea a la derecha.
    """
    for i, linea in enumerate(lineas):
        # Busca el texto 'No.CVU'
        if re.search(r'(no\.?\s?cvu|cvu:)', linea, re.IGNORECASE):
            # Método 1: Buscar en la línea anterior
            if i - 1 >= 0:  # Verificar que exista una línea anterior
                candidato = lineas[i - 1].strip()
                if re.match(r'^\d{4,6}$', candidato):  # Validar que sea un número
                    return candidato
            
            # Método 2 (else): Buscar en la misma línea a la derecha
            mismo_linea = re.search(r'(?:no\.?\s?cvu|cvu:)\s*(\d{4,6})', linea, re.IGNORECASE)
            if mismo_linea:
                return mismo_linea.group(1)
    
    # Si no se detecta en ningún caso
    return "NO DETECTADO"

def extraer_nombre(lineas):
    """
    Extrae el nombre completo considerando:
    - Las 3 líneas anteriores a 'No.CVU', combinando si el nombre y apellidos están separados.
    - Validación robusta para nombres con uno o dos apellidos.
    """
    for i, linea in enumerate(lineas):
        if "NO.CVU" in linea.upper():  # Busca el texto 'No.CVU'
            nombre_completo = []  # Para acumular líneas válidas que forman el nombre
            for offset in range(1, 4):  # Explorar hasta 3 líneas anteriores
                if i - offset >= 0:
                    candidato = lineas[i - offset].strip()
                    if (
                        1 <= len(candidato.split()) <= 6 and  # Aceptar entre 1 y 6 palabras
                        candidato.isupper() and  # Verificar que esté en mayúsculas
                        not any(p in candidato.upper() for p in ["TÉCNICO", "INVESTIGADOR", "DOCENTE", "CVU"])  # Filtrar palabras irrelevantes
                    ):
                        nombre_completo.insert(0, candidato)  # Agregar al inicio (orden correcto)
            if nombre_completo:  # Combinar las líneas válidas en un solo nombre
                return " ".join(p.capitalize() for linea in nombre_completo for p in linea.split())

    # Si no se encuentra cerca de 'No.CVU'
    return "NO DETECTADO"

def extraer_rfc(texto, lineas):
    for i, linea in enumerate(lineas):
        if "RFC" in linea.upper():
            posible = linea.split(":")[1].strip() if ":" in linea else lineas[i + 1].strip()
            if re.match(r'^[A-Z&Ñ]{3,4}\d{6}[A-Z0-9]{3}$', posible):
                return posible
    return extraer_por_regex(texto, r'\b[A-Z&Ñ]{3,4}\d{6}[A-Z0-9]{3}\b')

def extraer_institucion(lineas):
    instituciones = ["CIMAV", "UACH", "IPN", "UNAM", "TECNOLÓGICO", "UNIVERSIDAD"]
    for linea in lineas:
        if any(inst in linea.upper() for inst in instituciones):
            return linea.strip()
    return "NO DETECTADO"

def buscar_contexto(lineas, clave, distancia=2):
    for i, linea in enumerate(lineas):
        if clave in linea.upper():
            for j in range(1, distancia + 1):
                if i + j < len(lineas):
                    return lineas[i + j].strip()
    return "NO DETECTADO"

def extraer_por_regex(texto, patron, lineas=None):
    """
    Extrae correos electrónicos considerando el acomodo específico:
    - 'Correo Principal' está en la línea 1.
    - La línea 2 contiene la segunda parte del correo.
    - La línea 3 contiene la primera parte del correo.
    - Valida y retorna el correo reconstruido.
    """
    if lineas:
        for i, linea in enumerate(lineas):
            # Detectar 'Correo Principal'
            if re.search(r'(correo principal)', linea, re.IGNORECASE):
                # Extraer las partes del correo según el acomodo
                segunda_parte = lineas[i + 1].strip() if i + 1 < len(lineas) else ""  # Segunda parte del correo
                primera_parte = lineas[i + 2].strip() if i + 2 < len(lineas) else ""  # Primera parte del correo
                
                # Reconstruir el correo en el orden correcto
                correo = f"{primera_parte}{segunda_parte}".strip()
                
                # Validar el correo completo con regex
                match = re.search(patron, correo)
                if match:
                    return match.group(0)

    # Caso general: Buscar en todo el texto usando regex
    match = re.search(patron, texto)
    return match.group(0) if match else "NO DETECTADO"
