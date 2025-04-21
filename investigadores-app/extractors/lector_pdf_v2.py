import fitz
import re
from datetime import datetime

def limpiar(lineas):
    return [l.strip() for l in lineas if l.strip()]

def buscar_valor(lineas, campo):
    for i, linea in enumerate(lineas):
        if campo.lower() in linea.lower():
            if i + 1 < len(lineas):
                return lineas[i + 1].strip()
    return "NO DETECTADO"

def buscar_regex(lineas, regex):
    for linea in lineas:
        match = re.search(regex, linea)
        if match:
            return match.group(1).strip()
    return "NO DETECTADO"

def extraer_datos_pdf(path_pdf):
    doc = fitz.open(path_pdf)
    texto = "\n".join([page.get_text() for page in doc])
    lineas = limpiar(texto.split("\n"))

    datos = {
        "nombre_completo": buscar_regex(lineas, r'(?i)nombre[:\s]+(.+)') or lineas[0],
        "curp": buscar_regex(lineas, r'CURP[:\s]+([A-Z0-9]{18})'),
        "rfc": buscar_regex(lineas, r'RFC[:\s]+([A-Z0-9]{13})'),
        "correo": buscar_regex(lineas, r'CORREO PRINCIPAL[:\s]+([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})'),
        "telefono": buscar_regex(lineas, r'TELÉFONO[:\s]+([\d +\-()]+)'),
        "no_cvu": buscar_regex(lineas, r'NO.CVU[:\s]+(\d+)'),
        "orcid": buscar_regex(lineas, r'ORC ID[:\s]+([\d\-]+)'),
        "institucion": buscar_valor(lineas, "INSTITUCIÓN"),
        "grado_maximo": buscar_valor(lineas, "GRADO OBTENIDO"),
        "universidad_grado_maximo": buscar_valor(lineas, "UNIVERSIDAD"),
        "linea_investigacion": buscar_valor(lineas, "LÍNEA DE INVESTIGACIÓN"),
        "trayectoria_academica": buscar_valor(lineas, "TRAYECTORIA"),
        "fecha_nacimiento": buscar_regex(lineas, r'FECHA NACIMIENTO[:\s]+([\d\-\/]+)'),
        "sexo": buscar_valor(lineas, "SEXO"),
        "nacionalidad": buscar_valor(lineas, "NACIONALIDAD"),
        "estado_civil": buscar_valor(lineas, "ESTADO CIVIL"),
        "empleo_actual": buscar_valor(lineas, "EMPLEO ACTUAL"),
    }

    campos_restantes = [
        "municipio", "estado", "pais", "tipo_contrato", "fecha_ingreso_institucion", "departamento",
        "nivel_sni", "ano_ingreso_sni", "nivel_estudios", "campo_amplio", "campo_especifico", "campo_detallado",
        "area_conocimiento", "disciplina", "subdisciplina", "perfil_deseable_prodep", "ano_ingreso_prodep",
        "sni_ultimo_nivel", "total_articulos_indexados", "total_articulos_no_indexados", "total_capitulos_libros",
        "total_libros", "total_memorias", "total_tesis_dirigidas", "total_proyectos_internos", "total_proyectos_externos",
        "total_proyectos_vinculados", "total_patentes", "total_estancias", "total_eventos_academicos", "total_cursos",
        "total_posgrados_dirigidos", "idiomas", "software_usado", "formacion_licenciatura", "formacion_maestria",
        "formacion_doctorado", "experiencia_docente", "experiencia_profesional", "distinciones", "reconocimientos",
        "membresias_academicas", "productividad_destacada", "participacion_redes", "evaluador_proyectos",
        "comite_editorial", "cuerpo_academico", "rol_cuerpo_academico", "nombre_archivo_pdf", "fecha_registro",
        "firma_digital", "estatus_validacion"
    ]

    for campo in campos_restantes:
        datos[campo] = "NO DETECTADO"

    datos["fecha_registro"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    datos["nombre_archivo_pdf"] = path_pdf.split("/")[-1]

    return datos

