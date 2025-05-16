#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sys
import json
import re
import os
from datetime import datetime

# Imprimir información de diagnóstico
print(f"Python version: {sys.version}", file=sys.stderr)
print(f"Current working directory: {os.getcwd()}", file=sys.stderr)
print(f"Arguments received: {sys.argv}", file=sys.stderr)

# Verificar que se recibió la ruta del archivo
if len(sys.argv) != 2:
    error_data = {"error": "Uso: python extraer_datos_pu.py <ruta_al_pdf>"}
    print(json.dumps(error_data))
    sys.exit(1)

path_pdf = sys.argv[1]
print(f"Procesando archivo: {path_pdf}", file=sys.stderr)

# Verificar que el archivo existe
if not os.path.exists(path_pdf):
    error_data = {"error": f"El archivo no existe: {path_pdf}"}
    print(json.dumps(error_data))
    sys.exit(1)

# Intentar importar las bibliotecas necesarias
try:
    import fitz  # PyMuPDF
    from pdf2image import convert_from_path
    import pytesseract
    print("Bibliotecas importadas correctamente", file=sys.stderr)
except ImportError as e:
    error_data = {
        "error": f"Error al importar bibliotecas: {str(e)}. Instale PyMuPDF, pdf2image y pytesseract."
    }
    print(json.dumps(error_data))
    sys.exit(1)

# ---------- FLUJO PRINCIPAL ----------
def extraer_datos_pdf(path_pdf):
    print(f"Extrayendo texto del PDF: {path_pdf}", file=sys.stderr)
    texto = extraer_texto(path_pdf)
    print(f"Longitud del texto extraído: {len(texto)}", file=sys.stderr)
    
    # Imprimir una muestra del texto para diagnóstico
    print(f"Muestra del texto extraído: {texto[:500]}...", file=sys.stderr)
    
    lineas = [l.strip() for l in texto.split('\n') if l.strip()]
    print(f"Número de líneas: {len(lineas)}", file=sys.stderr)

    datos = {
        "nombre_completo": extraer_nombre_contextual(lineas, texto),
        "curp": extraer_curp_regex(texto),
        "rfc": extraer_rfc(texto, lineas),
        "no_cvu": buscar_linea_valor(lineas, "NO.CVU"),
        "correo": extraer_email(texto),
        "institucion": buscar_posible_institucion(lineas),
        "linea_investigacion": buscar_valor_proximo(lineas, "LÍNEA", max_adelante=2),
        "nacionalidad": extraer_nacionalidad(texto, lineas),
        "fecha_nacimiento": extraer_fecha_nacimiento(texto, lineas),
        "fecha_registro": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "nombre_archivo_pdf": os.path.basename(path_pdf)
    }

    # Generar RFC sugerido si no se detectó
    if datos["rfc"] == "NO DETECTADO" and datos["curp"] != "NO DETECTADO":
        datos["rfc"] = generar_rfc_desde_curp(datos["curp"])

    print(f"Datos extraídos: {datos}", file=sys.stderr)
    return datos

# ---------- OCR FALLBACK ----------
def extraer_texto(path_pdf):
    try:
        print("Intentando extraer texto con PyMuPDF", file=sys.stderr)
        doc = fitz.open(path_pdf)
        texto = "\n".join([page.get_text() for page in doc])
        if len(texto.strip()) < 20:
            print("Texto extraído muy corto, usando OCR", file=sys.stderr)
            raise ValueError("Texto muy corto")
        return texto
    except Exception as e:
        print(f"Error al extraer texto con PyMuPDF: {str(e)}, usando OCR", file=sys.stderr)
        return extraer_texto_ocr(path_pdf)

def extraer_texto_ocr(path_pdf):
    texto_final = ""
    try:
        print("Extrayendo texto con OCR", file=sys.stderr)
        # Configurar ruta de Tesseract si es necesario
        if sys.platform == "win32":
            pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
            print(f"Tesseract path: {pytesseract.pytesseract.tesseract_cmd}", file=sys.stderr)
        
        paginas = convert_from_path(path_pdf, dpi=300)
        print(f"Convertidas {len(paginas)} páginas a imágenes", file=sys.stderr)
        
        for i, imagen in enumerate(paginas):
            print(f"Procesando página {i+1}/{len(paginas)} con OCR", file=sys.stderr)
            # Usar idioma español si está disponible
            try:
                texto = pytesseract.image_to_string(imagen, lang='spa')
            except:
                print("Error con idioma 'spa', usando idioma por defecto", file=sys.stderr)
                texto = pytesseract.image_to_string(imagen)
                
            texto_final += texto + "\n"
            print(f"Longitud del texto extraído de la página {i+1}: {len(texto)}", file=sys.stderr)
    except Exception as e:
        print(f"Error en OCR: {str(e)}", file=sys.stderr)
        texto_final = f"OCR_FAILED: {str(e)}"
    
    # Imprimir una muestra del texto extraído para diagnóstico
    if len(texto_final) > 200:
        print(f"Muestra del texto extraído: {texto_final[:200]}...", file=sys.stderr)
    else:
        print(f"Texto extraído completo: {texto_final}", file=sys.stderr)
        
    return texto_final

# ---------- EXTRACTORES MEJORADOS ----------
def extraer_nombre_contextual(lineas, texto_completo):
    # Método 1: Buscar cerca de "NO.CVU"
    puestos_clave = ["TÉCNICO", "INVESTIGADOR", "TITULAR", "ASOCIADO", "ENLACE", "DOCENTE", "COORDINADOR", "PRESTADOR", "SERVICIOS", "TIEMPO COMPLETO"]
    for i, linea in enumerate(lineas):
        if "NO.CVU" in linea.upper():
            for offset in range(1, 5):  # Buscar hasta 5 líneas antes
                if i - offset >= 0:
                    posible = lineas[i - offset].strip()
                    palabras = posible.split()
                    if 2 <= len(palabras) <= 6 and posible.isupper():
                        if not any(p in posible.upper() for p in puestos_clave):
                            return formatear_nombre(posible)
    
    # Método 2: Buscar patrones comunes de nombres
    nombre_match = re.search(r'\b([A-Z][a-z]+ [A-Z][a-z]+(?: [A-Z][a-z]+){0,2})\b', texto_completo)
    if nombre_match:
        return nombre_match.group(1)
    
    # Método 3: Buscar después de "NOMBRE:"
    for i, linea in enumerate(lineas):
        if "NOMBRE:" in linea.upper():
            partes = linea.split(":")
            if len(partes) > 1:
                return partes[1].strip()
            elif i + 1 < len(lineas):
                return lineas[i + 1].strip()
    
    return "NO DETECTADO"

def extraer_curp_regex(texto):
    # Patrón CURP mejorado
    match = re.search(r'\b([A-Z]{4}\d{6}[HM][A-Z]{5}[0-9A-Z]\d)\b', texto)
    if match:
        return match.group(1)
    
    # Buscar con formato más flexible
    match = re.search(r'CURP[:\s]*([A-Z0-9]{18})', texto, re.IGNORECASE)
    if match:
        return match.group(1)
        
    return "NO DETECTADO"

def extraer_rfc(texto, lineas):
    # Método 1: Buscar después de "RFC:"
    for i, linea in enumerate(lineas):
        if "RFC" in linea.upper():
            partes = linea.split(":")
            if len(partes) > 1:
                rfc = partes[1].strip()
                if validar_rfc(rfc): return rfc
            elif i + 1 < len(lineas):
                rfc = lineas[i + 1].strip()
                if validar_rfc(rfc): return rfc

    # Método 2: Buscar patrón RFC
    match = re.search(r'\b[A-Z&Ñ]{3,4}\d{6}[A-Z0-9]{3}\b', texto)
    if match:
        return match.group(0)
        
    # Método 3: Buscar con formato más flexible
    match = re.search(r'RFC[:\s]*([A-Z0-9&Ñ]{10,13})', texto, re.IGNORECASE)
    if match:
        return match.group(1)
        
    return "NO DETECTADO"

def extraer_nacionalidad(texto, lineas):
    # Método 1: Buscar después de "NACIONALIDAD:"
    for linea in lineas:
        if "NACIONALIDAD" in linea.upper():
            partes = linea.split(":")
            if len(partes) > 1:
                return partes[1].strip()
    
    # Método 2: Buscar palabras clave comunes
    claves_nacionalidad = ["MEXICANA", "ESTADOUNIDENSE", "CANADIENSE", "ESPAÑOLA", "ARGENTINA"]
    for clave in claves_nacionalidad:
        if clave in texto.upper():
            return clave.capitalize()
            
    # Método 3: Buscar con regex
    match = re.search(r'NACIONALIDAD[:\s]*([A-Za-z]+)', texto, re.IGNORECASE)
    if match:
        return match.group(1).capitalize()
        
    return "NO DETECTADO"

def extraer_fecha_nacimiento(texto, lineas):
    # Método 1: Buscar formato año-mes-día (YYYY-MM-DD)
    match = re.search(r'\b(\d{4}-\d{2}-\d{2})\b', texto)
    if match:
        return match.group(1)  # Ya está en el formato correcto

    # Método 2: Buscar formatos comunes (dd/mm/yyyy o dd-mm-yyyy)
    match = re.search(r'\b(\d{2}[/-]\d{2}[/-]\d{4})\b', texto)
    if match:
        fecha = match.group(1)
        return formatear_fecha(fecha)

    # Método 3: Buscar después de "FECHA DE NACIMIENTO:"
    for linea in lineas:
        if "FECHA DE NACIMIENTO" in linea.upper():
            partes = linea.split(":")
            if len(partes) > 1:
                fecha = partes[1].strip()
                return formatear_fecha(fecha)
                
    # Método 4: Buscar con regex más flexible
    match = re.search(r'NACIMIENTO[:\s]*(\d{1,2}[/-]\d{1,2}[/-]\d{4}|\d{4}[/-]\d{1,2}[/-]\d{1,2})', texto, re.IGNORECASE)
    if match:
        return formatear_fecha(match.group(1))

    return "NO DETECTADO"

def formatear_fecha(fecha):
    try:
        # Detectar el delimitador y convertir al formato YYYY-MM-DD
        delimitador = "/" if "/" in fecha else "-"
        
        # Intentar diferentes formatos
        formatos = [
            f"%d{delimitador}%m{delimitador}%Y",  # DD/MM/YYYY
            f"%Y{delimitador}%m{delimitador}%d",  # YYYY/MM/DD
            f"%m{delimitador}%d{delimitador}%Y"   # MM/DD/YYYY
        ]
        
        for formato in formatos:
            try:
                fecha_obj = datetime.strptime(fecha, formato)
                return fecha_obj.strftime("%Y-%m-%d")  # Formato año-mes-día
            except ValueError:
                continue
                
        return "NO DETECTADO"
    except Exception:
        return "NO DETECTADO"

# ---------- VALIDACIONES ----------
def validar_rfc(rfc):
    return bool(re.match(r'^[A-Z&Ñ]{3,4}\d{6}[A-Z0-9]{3}$', rfc))

def formatear_nombre(texto):
    # Eliminar caracteres no deseados
    texto = re.sub(r'[^\w\s]', '', texto)
    # Convertir a formato de nombre propio
    return " ".join([w.capitalize() for w in texto.split()])

def buscar_linea_valor(lineas, etiqueta):
    for i, linea in enumerate(lineas):
        if etiqueta in linea.upper():
            partes = linea.split(":")
            if len(partes) > 1:
                return partes[1].strip()
            elif i + 1 < len(lineas):
                return lineas[i + 1].strip()
                
    # Buscar con regex más flexible
    for linea in lineas:
        match = re.search(f"{etiqueta}[:\s]*([A-Za-z0-9]+)", linea, re.IGNORECASE)
        if match:
            return match.group(1).strip()
            
    return "NO DETECTADO"

def extraer_email(texto):
    match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', texto)
    if match:
        return match.group(0)
        
    # Buscar con formato más flexible
    match = re.search(r'CORREO[:\s]*([\w\.-]+@[\w\.-]+\.\w+)', texto, re.IGNORECASE)
    if match:
        return match.group(1)
        
    return "NO DETECTADO"

def buscar_posible_institucion(lineas):
    claves = ["CIMAV", "UACH", "IPN", "UNAM", "COLECH", "TECNOLÓGICO", "UNIVERSIDAD", "INSTITUTO", "CENTRO", "COLEGIO"]
    
    # Método 1: Buscar líneas que contengan palabras clave
    for linea in lineas:
        for clave in claves:
            if clave in linea.upper():
                return linea.strip()
                
    # Método 2: Buscar después de "INSTITUCIÓN:"
    for i, linea in enumerate(lineas):
        if "INSTITUCIÓN" in linea.upper() or "INSTITUCION" in linea.upper():
            partes = linea.split(":")
            if len(partes) > 1:
                return partes[1].strip()
            elif i + 1 < len(lineas):
                return lineas[i + 1].strip()
                
    # Método 3: Buscar con regex
    for clave in claves:
        match = re.search(f"({clave}[A-Za-z\s]+)", " ".join(lineas), re.IGNORECASE)
        if match:
            return match.group(1).strip()
    
    return "NO DETECTADO"

def buscar_valor_proximo(lineas, etiqueta, max_adelante=2):
    for i, linea in enumerate(lineas):
        if etiqueta in linea.upper():
            # Buscar en la misma línea después de ":"
            partes = linea.split(":")
            if len(partes) > 1:
                return partes[1].strip()
                
            # Buscar en las líneas siguientes
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

# Función principal para ejecutar desde línea de comandos
if __name__ == "__main__":
    try:
        datos = extraer_datos_pdf(path_pdf)
        # Asegurarse de que la salida sea JSON válido
        print(json.dumps(datos, ensure_ascii=False))
    except Exception as e:
        print(f"Error no manejado: {str(e)}", file=sys.stderr)
        error_data = {"error": f"Error al procesar el PDF: {str(e)}"}
        print(json.dumps(error_data))
        sys.exit(1)
