import sqlite3

campos = [
    "curp", "nombre_completo", "rfc", "correo", "telefono", "no_cvu", "orcid", "nivel", "area",
    "empleo_actual", "grado_maximo_estudios", "titulo_tesis", "anio_grado", "pais_grado", "disciplina",
    "especialidad", "linea_investigacion", "sni", "anio_sni", "cv_conacyt", "experiencia_docente",
    "experiencia_laboral", "proyectos_investigacion", "proyectos_vinculacion", "patentes",
    "productos_cientificos", "productos_tecnologicos", "productos_humanisticos", "libros",
    "capitulos_libros", "articulos", "revistas_indexadas", "revistas_no_indexadas", "memorias",
    "ponencias", "formacion_recursos", "direccion_tesis", "direccion_posgrados", "evaluador_proyectos",
    "miembro_comites", "editor_revistas", "premios_distinciones", "estancias_academicas", "idiomas",
    "asociaciones_cientificas", "gestion_academica", "gestion_institucional", "colaboracion_internacional",
    "colaboracion_nacional", "divulgacion_cientifica", "otros_logros", "vinculacion_sector_productivo",
    "vinculacion_sector_social", "vinculacion_sector_publico", "participacion_politicas_publicas",
    "impacto_social", "propuesta_linea_trabajo", "documentacion_completa", "archivo_pdf", "observaciones",
    "genero", "fecha_nacimiento", "estado_nacimiento", "municipio", "domicilio", "cp", "entidad_federativa",
    "cv_ligado_orcid", "orcid_verificado", "fecha_registro", "nombre_archivo_pdf", "puesto"
]

conn = sqlite3.connect("database.db")
c = conn.cursor()

c.execute("DROP TABLE IF EXISTS investigadores")

query = f"""
CREATE TABLE investigadores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    {", ".join(f"{campo} TEXT" for campo in campos)}
)
"""

c.execute(query)
conn.commit()
conn.close()

print("🧱 Base de datos creada con 72 campos.")
