<<<<<<< Updated upstream
import fitz
=======
import fitz  # PyMuPDF
>>>>>>> Stashed changes
import re
from datetime import datetime
from pdf2image import convert_from_path
import pytesseract
<<<<<<< Updated upstream
import os

pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

=======

pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# ---------- FLUJO PRINCIPAL ----------
>>>>>>> Stashed changes
def extraer_datos_pdf(path_pdf):
    texto = extraer_texto(path_pdf)
    lineas = [l.strip() for l in texto.split('\n') if l.strip()]

    datos = {
<<<<<<< Updated upstream
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
=======
        "nombre_completo": extraer_nombre_contextual(lineas),
        "curp": extraer_curp_regex(texto),
        "rfc": extraer_rfc(texto, lineas),
        "no_cvu": buscar_linea_valor(lineas, "NO.CVU"),
        "correo": extraer_email(texto),
        "institucion": buscar_posible_institucion(lineas),
        "linea_investigacion": buscar_valor_proximo(lineas, "LÍNEA", max_adelante=2),
        "fecha_registro": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "nombre_archivo_pdf": path_pdf.split("/")[-1]
    }

    # Generar RFC sugerido si no se detectó
    if datos["rfc"] == "NO DETECTADO" and datos["curp"] != "NO DETECTADO":
        datos["rfc"] = generar_rfc_desde_curp(datos["curp"])

    return datos

# ---------- OCR FALLBACK ----------
def extraer_texto(path_pdf):
    try:
        doc = fitz.open(path_pdf)
        texto = "\n".join([page.get_text() for page in doc])
        if len(texto.strip()) < 20:
            raise ValueError("Texto muy corto")
        return texto
>>>>>>> Stashed changes
    except:
        return extraer_texto_ocr(path_pdf)

def extraer_texto_ocr(path_pdf):
<<<<<<< Updated upstream
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
=======
    texto_final = ""
    try:
        paginas = convert_from_path(path_pdf, dpi=300)
        for imagen in paginas:
            texto = pytesseract.image_to_string(imagen, lang='spa')
            texto_final += texto + "\n"
    except Exception as e:
        texto_final = f"OCR_FAILED: {e}"
    return texto_final

# ---------- EXTRACTORES ----------
def extraer_nombre_contextual(lineas):
    puestos_clave = ["TÉCNICO", "INVESTIGADOR", "TITULAR", "ASOCIADO", "ENLACE", "DOCENTE", "COORDINADOR", "PRESTADOR", "SERVICIOS", "TIEMPO COMPLETO"]
    for i, linea in enumerate(lineas):
        if "NO.CVU" in linea.upper():
            for offset in range(1, 4):
                if i - offset >= 0:
                    posible = lineas[i - offset].strip()
                    palabras = posible.split()
                    if 2 <= len(palabras) <= 6 and posible.isupper():
                        if not any(p in posible.upper() for p in puestos_clave):
                            return formatear_nombre(posible)
    return "NO DETECTADO"

def extraer_curp_regex(texto):
    match = re.search(r'\b([A-Z]{4}\d{6}[HM][A-Z]{5}[0-9A-Z]\d)\b', texto)
    return match.group(1) if match else "NO DETECTADO"

def extraer_rfc(texto, lineas):
    for i, linea in enumerate(lineas):
        if "RFC" in linea.upper():
            partes = linea.split(":")
            if len(partes) > 1:
                rfc = partes[1].strip()
                if validar_rfc(rfc): return rfc
            elif i + 1 < len(lineas):
                rfc = lineas[i + 1].strip()
                if validar_rfc(rfc): return rfc

    match = re.search(r'\b[A-Z&Ñ]{3,4}\d{6}[A-Z0-9]{3}\b', texto)
    return match.group(0) if match else "NO DETECTADO"

# ---------- VALIDACIONES ----------
def validar_rfc(rfc):
    return bool(re.match(r'^[A-Z&Ñ]{3,4}\d{6}[A-Z0-9]{3}$', rfc))

def formatear_nombre(texto):
    return " ".join([w.capitalize() for w in texto.split()])

def buscar_linea_valor(lineas, etiqueta):
    for i, linea in enumerate(lineas):
        if etiqueta in linea.upper():
            partes = linea.split(":")
            if len(partes) > 1:
                return partes[1].strip()
            elif i + 1 < len(lineas):
                return lineas[i + 1].strip()
    return "NO DETECTADO"

def extraer_email(texto):
    match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', texto)
    return match.group(0) if match else "NO DETECTADO"

def buscar_posible_institucion(lineas):
    claves = ["CIMAV", "UACH", "IPN", "UNAM", "COLECH", "TECNOLÓGICO", "UNIVERSIDAD"],

def buscar_valor_proximo(lineas, etiqueta, max_adelante=2):
    for i, linea in enumerate(lineas):
        if etiqueta in linea.upper():
            for j in range(1, max_adelante + 1):
>>>>>>> Stashed changes
                if i + j < len(lineas):
                    return lineas[i + j].strip()
    return "NO DETECTADO"

<<<<<<< Updated upstream
def extraer_por_regex(texto, patron, lineas=None):
    """
    Extrae correos electrónicos considerando:
    - Lo que está entre 'Correo Principal' y 'Móvil Principal'.
    - Si no existe 'Móvil Principal', toma lo que está debajo de 'Correo Principal'.
    - Busca patrones generales en todo el texto como respaldo.
    """
    if lineas:
        for i, linea in enumerate(lineas):
            # Detectar 'Correo Principal'
            if re.search(r'(correo principal)', linea, re.IGNORECASE):
                # Inicializa variables
                correo = ""
                
                # Caso 1: Buscar hasta 'Móvil Principal'
                for j in range(i + 1, len(lineas)):  # Recorre las líneas debajo de 'Correo Principal'
                    siguiente_linea = lineas[j].strip()
                    if re.search(r'(móvil principal)', siguiente_linea, re.IGNORECASE):
                        break  # Detén el bucle al encontrar 'Móvil Principal'
                    correo += f" {siguiente_linea}"  # Combina las líneas intermedias
                
                # Validar formato de correo
                correo = correo.strip()
                match = re.search(patron, correo)
                if match:
                    return match.group(0)

                # Caso 2: Si no está 'Móvil Principal', solo toma la línea siguiente
                if i + 1 < len(lineas):
                    candidato = lineas[i + 1].strip()
                    match = re.search(patron, candidato)
                    if match:
                        return match.group(0)

    # Caso general: Buscar en todo el texto utilizando regex
    match = re.search(patron, texto)
    return match.group(0) if match else "NO DETECTADO"
=======
def generar_rfc_desde_curp(curp):
    try:
        # Primeros 10 caracteres del CURP corresponden al RFC base
        base = curp[:10]
        return base + 'XXX'  # Se agrega una homoclave genérica
    except:
        return "NO DETECTADO"
>>>>>>> Stashed changes
