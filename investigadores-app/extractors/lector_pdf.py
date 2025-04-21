import fitz  # PyMuPDF

def extraer_datos_pdf(path_pdf):
    doc = fitz.open(path_pdf)
    texto = ""
    for page in doc:
        texto += page.get_text()

    lineas = texto.split('\n')

    datos = {
        "nombre": extraer_por_proximidad(lineas, "NO.CVU:"),
        "curp": extraer_por_etiqueta(lineas, "CURP"),
        "rfc": extraer_por_etiqueta(lineas, "RFC"),
        "correo": extraer_por_etiqueta(lineas, "CORREO PRINCIPAL"),
        "telefono": extraer_por_etiqueta(lineas, "TELÉFONO"),
        "cvu": extraer_por_proximidad(lineas, "NO.CVU:"),
        "orcid": extraer_por_etiqueta(lineas, "ORC ID:"),
        "nivel": "NO DETECTADO",
        "area": extraer_por_etiqueta(lineas, "ÁREA:"),
        "institucion": extraer_por_coincidencia(lineas, "CIMAV"),
        "trayectoria": "NO DETECTADO",
        "evaluacion": "",
    }

    return datos

def extraer_por_etiqueta(lineas, etiqueta):
    for i, linea in enumerate(lineas):
        if etiqueta in linea.upper():
            if i + 1 < len(lineas):
                return lineas[i + 1].strip()
    return "NO DETECTADO"

def extraer_por_proximidad(lineas, clave):
    for linea in lineas:
        if clave in linea:
            return linea.split(":")[-1].strip()
    return "NO DETECTADO"

def extraer_por_coincidencia(lineas, palabra_clave):
    for linea in lineas:
        if palabra_clave.lower() in linea.lower():
            return linea.strip()
    return "NO DETECTADO"
