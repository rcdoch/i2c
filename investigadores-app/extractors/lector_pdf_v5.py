import fitz  # PyMuPDF
import re
from datetime import datetime
from pdf2image import convert_from_path
import pytesseract

pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# ---------- FLUJO PRINCIPAL ----------
def extraer_datos_pdf(path_pdf):
    texto = extraer_texto(path_pdf)
    lineas = [l.strip() for l in texto.split('\n') if l.strip()]

    datos = {
        "nombre_completo": extraer_nombre_contextual(lineas),
        "curp": extraer_curp_regex(texto),
        "rfc": extraer_rfc(texto, lineas),
        "no_cvu": buscar_linea_valor(lineas, "NO.CVU"),
        "correo": extraer_email(texto),
        "institucion": buscar_posible_institucion(lineas),
        "linea_investigacion": buscar_valor_proximo(lineas, "LÍNEA", max_adelante=2),
        "fecha_nacimiento": extraer_fecha_nacimiento(texto, lineas),
        "puesto": extraer_puesto(lineas),  # Nuevo campo
        "telefono": extraer_telefono(lineas),  # Nuevo campo
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
    except:
        return extraer_texto_ocr(path_pdf)

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

def extraer_fecha_nacimiento(texto, lineas):
    # Buscar fecha de nacimiento en formato común (dd/mm/yyyy o dd-mm-yyyy)
    match = re.search(r'\b(\d{2}[/-]\d{2}[/-]\d{4})\b', texto)
    if match:
        fecha = match.group(1)
        return formatear_fecha(fecha)
    # Buscar en líneas específicas
    for linea in lineas:
        if "FECHA DE NACIMIENTO" in linea.upper():
            partes = linea.split(":")
            if len(partes) > 1:
                fecha = partes[1].strip()
                return formatear_fecha(fecha)
    return "NO DETECTADO"

def formatear_fecha(fecha):
    try:
        # Detectar el delimitador y convertir al formato YYYY-MM-DD
        delimitador = "/" if "/" in fecha else "-"
        fecha_obj = datetime.strptime(fecha, f"%d{delimitador}%m{delimitador}%Y")
        return fecha_obj.strftime("%Y-%m-%d")
    except ValueError:
        return "NO DETECTADO"

def extraer_puesto(lineas):
    # Busca el último puesto trabajado en las líneas
    for linea in lineas:
        if "PUESTO" in linea.upper():
            partes = linea.split(":")
            if len(partes) > 1:
                return partes[1].strip()
    return "NO DETECTADO"

def extraer_telefono(lineas):
    # Busca las etiquetas "MÓVIL PRINCIPAL" o "TELÉFONO PRINCIPAL" y extrae el número en las líneas siguientes
    etiquetas = ["MÓVIL PRINCIPAL", "TELÉFONO PRINCIPAL"]
    for i, linea in enumerate(lineas):
        if any(etiqueta in linea.upper() for etiqueta in etiquetas):
            # Busca en la línea siguiente si existe
            if i + 1 < len(lineas):
                # Extraer un número de 10 dígitos de la línea siguiente
                posible_telefono = re.search(r'\b\d{10}\b', lineas[i + 1])
                if posible_telefono:
                    return posible_telefono.group(0)
            # Si no está en la línea siguiente, intenta buscar en la misma línea
            posible_telefono = re.search(r'\b\d{10}\b', linea)
            if posible_telefono:
                return posible_telefono.group(0)
    return "NO DETECTADO"

<<<<<<< HEAD
def extraer_empleo_actual(lineas):
    # Busca la sección "EMPLEO ACTUAL" y extrae el texto correspondiente
    for i, linea in enumerate(lineas):
        if "EMPLEO ACTUAL" in linea.upper():
            # Busca en las líneas siguientes el texto del empleo actual
            if i + 1 < len(lineas):
                empleo = lineas[i + 1].strip()
                return empleo
    return "NO DETECTADO"

=======
>>>>>>> parent of 3b881f4 (Filtrado PDF)
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
    claves = ["CIMAV", "UACH", "IPN", "UNAM", "COLECH", "TECNOLÓGICO", "UNIVERSIDAD", "INSTITUTO", "CENTRO"]
    for linea in reversed(lineas):  # Recorremos las líneas en orden inverso
        for clave in claves:
            if clave in linea.upper():
                return linea.strip()
    return "NO DETECTADO"

def buscar_valor_proximo(lineas, etiqueta, max_adelante=2):
    for i, linea in enumerate(lineas):
        if etiqueta in linea.upper():
            for j in range(1, max_adelante + 1):
                if i + j < len(lineas):
                    return lineas[i + j].strip()
    return "NO DETECTADO"

def generar_rfc_desde_curp(curp):
    try:
        # Primeros 10 caracteres del CURP corresponden al RFC base
        base = curp[:10]
        return base + 'XXX'  # Se agrega una homoclave genérica
    except:
        return "NO DETECTADO"