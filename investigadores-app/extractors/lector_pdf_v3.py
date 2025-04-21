import fitz
import re
from datetime import datetime

def limpiar(lineas):
    return [l.strip() for l in lineas if l.strip()]

def buscar_curp_avanzado(texto):
    # Buscar CURP formato válido
    match = re.search(r'\b([A-Z]{4}\d{6}[HM][A-Z]{5}[0-9A-Z]\d)\b', texto)
    return match.group(1) if match else "NO DETECTADO"

def buscar_valor(lineas, etiqueta):
    for i, linea in enumerate(lineas):
        if etiqueta.lower() in linea.lower():
            if i + 1 < len(lineas):
                return lineas[i + 1].strip()
    return "NO DETECTADO"

def es_nombre_valido(texto, blacklist):
    if any(p in texto.upper() for p in blacklist):
        return False
    if len(texto.split()) < 2 or len(texto.split()) > 5:
        return False
    if any(char.isdigit() for char in texto):
        return False
    return True

def formatear_nombre(texto):
    return " ".join([w.capitalize() for w in texto.split()])

def extraer_nombre_por_cvu(lineas):
    for i, linea in enumerate(lineas):
        if "NO.CVU" in linea.upper():
            # Primero intentamos i - 1 (inmediato superior)
            candidato_1 = lineas[i - 1].strip() if i >= 1 else ""
            if es_puesto(candidato_1):
                # Si es un puesto, entonces vamos a i - 2
                candidato_2 = lineas[i - 2].strip() if i >= 2 else ""
                if es_nombre_valido(candidato_2):
                    return formatear_nombre(candidato_2)
            elif es_nombre_valido(candidato_1):
                return formatear_nombre(candidato_1)
    return "NO DETECTADO"


def extraer_datos_pdf(path_pdf):
    doc = fitz.open(path_pdf)
    texto_completo = "\n".join([page.get_text() for page in doc])
    lineas = limpiar(texto_completo.split('\n'))

    datos = {
        "nombre_completo": extraer_nombre_por_cvu(lineas),
        "curp": buscar_curp_avanzado(texto_completo),
        "correo": buscar_valor(lineas, "CORREO"),
        "no_cvu": buscar_valor(lineas, "CVU"),
        "institucion": buscar_valor(lineas, "INSTITUCIÓN"),
        "linea_investigacion": buscar_valor(lineas, "LÍNEA"),
        "nombre_archivo_pdf": path_pdf.split("/")[-1],
        "fecha_registro": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    }

    return datos
def es_nombre_valido(texto):
    palabras = texto.strip().split()
    return 2 <= len(palabras) <= 6 and all(p.replace('.', '').isalpha() for p in palabras)

def formatear_nombre(texto):
    return " ".join([w.capitalize() for w in texto.split()])

def es_puesto(texto):
    puestos = [
        "PRESTADOR", "INVESTIGADOR", "TÉCNICO", "COORDINADOR", "JEFE",
        "AUXILIAR", "DOCENTE", "PROFESOR", "ASOCIADO", "TITULAR", "ENLACE",
        "SERVICIOS", "CATEDRÁTICO", "TIEMPO COMPLETO"
    ]
    return any(p in texto.upper() for p in puestos)

def es_nombre_valido(texto):
    palabras = texto.strip().split()
    return (
        2 <= len(palabras) <= 6 and
        all(p.replace('.', '').isalpha() for p in palabras)
    )

def formatear_nombre(texto):
    return " ".join([w.capitalize() for w in texto.split()])








