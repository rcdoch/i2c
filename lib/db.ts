import sqlite3 from "sqlite3"
import { open } from "sqlite"
import path from "path"
import fs from "fs"

// Función para inicializar la base de datos
export async function initDB() {
  const dbPath = path.join(process.cwd(), "database.db")

  // Verificar si el directorio existe, si no, crearlo
  const dbDir = path.dirname(dbPath)
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true })
  }

  console.log(`Inicializando base de datos en: ${dbPath}`)

  // Abrir la conexión a la base de datos
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  })

  // Definir los campos de la tabla investigadores
  const campos = [
    "curp",
    "nombre_completo",
    "rfc",
    "correo",
    "telefono",
    "no_cvu",
    "orcid",
    "nivel",
    "area",
    "institucion",
    "nacionalidad",
    "fecha_nacimiento",
    "grado_maximo_estudios",
    "titulo_tesis",
    "anio_grado",
    "pais_grado",
    "disciplina",
    "especialidad",
    "linea_investigacion",
    "sni",
    "anio_sni",
    "cv_conacyt",
    "experiencia_docente",
    "experiencia_laboral",
    "proyectos_investigacion",
    "proyectos_vinculacion",
    "patentes",
    "productos_cientificos",
    "productos_tecnologicos",
    "productos_humanisticos",
    "libros",
    "capitulos_libros",
    "articulos",
    "revistas_indexadas",
    "revistas_no_indexadas",
    "memorias",
    "ponencias",
    "formacion_recursos",
    "direccion_tesis",
    "direccion_posgrados",
    "evaluador_proyectos",
    "miembro_comites",
    "editor_revistas",
    "premios_distinciones",
    "estancias_academicas",
    "idiomas",
    "asociaciones_cientificas",
    "gestion_academica",
    "gestion_institucional",
    "colaboracion_internacional",
    "colaboracion_nacional",
    "divulgacion_cientifica",
    "otros_logros",
    "vinculacion_sector_productivo",
    "vinculacion_sector_social",
    "vinculacion_sector_publico",
    "participacion_politicas_publicas",
    "impacto_social",
    "propuesta_linea_trabajo",
    "documentacion_completa",
    "archivo_pdf",
    "observaciones",
    "genero",
    "estado_nacimiento",
    "municipio",
    "domicilio",
    "cp",
    "entidad_federativa",
    "cv_ligado_orcid",
    "orcid_verificado",
    "fecha_registro",
    "nombre_archivo_pdf",
  ]

  // Crear la tabla si no existe
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS investigadores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ${campos.map((campo) => `${campo} TEXT`).join(", ")}
    )
  `

  try {
    await db.exec(createTableQuery)
    console.log("Tabla 'investigadores' creada o ya existente")
  } catch (error) {
    console.error("Error al crear la tabla:", error)
  }

  return db
}

// Modificar la función guardarInvestigador para incluir la lógica de verificación de duplicados
export async function guardarInvestigador(datos: any) {
  try {
    console.log("Guardando investigador en la base de datos:", datos)

    const db = await initDB()

    const curp = datos.curp?.trim() || ""
    const nombre = datos.nombre_completo?.trim() || ""

    // CASO 1: Sin CURP - verificamos por nombre
    if (curp === "" || curp.toUpperCase() === "NO DETECTADO") {
      // Verificar si existe un registro con el mismo nombre
      const existente = await db.get("SELECT * FROM investigadores WHERE nombre_completo = ?", nombre)

      if (existente) {
        console.log(`Nombre duplicado encontrado: ${nombre}`)
        return {
          success: false,
          message: `⚠️ CURP no detectado, pero el nombre coincide con otro registro. Revisa si es duplicado o edita manualmente.`,
          id: existente.id,
        }
      } else {
        // Preparar los campos y valores para la inserción
        const campos = Object.keys(datos).filter((campo) => datos[campo] !== undefined)
        const placeholders = campos.map(() => "?").join(", ")
        const valores = campos.map((campo) => datos[campo])

        // Construir la consulta SQL
        const query = `
          INSERT INTO investigadores (${campos.join(", ")})
          VALUES (${placeholders})
        `

        console.log("Query SQL:", query)
        console.log("Valores:", valores)

        // Ejecutar la consulta
        const result = await db.run(query, valores)
        console.log("Resultado de la inserción:", result)

        return {
          success: true,
          message: `⚠️ Registro agregado SIN CURP detectado. Favor de revisar y editar luego.`,
          id: result.lastID,
        }
      }
    }

    // CASO 2: CURP válido - revisamos duplicado
    const existenteCurp = await db.get("SELECT * FROM investigadores WHERE curp = ?", curp)
    if (existenteCurp) {
      console.log(`CURP duplicado encontrado: ${curp}`)
      return {
        success: false,
        message: `❌ El CURP ${curp} ya está registrado.`,
        id: existenteCurp.id,
      }
    }

    // CASO 3: CURP válido y nuevo
    // Preparar los campos y valores para la inserción
    const campos = Object.keys(datos).filter((campo) => datos[campo] !== undefined)
    const placeholders = campos.map(() => "?").join(", ")
    const valores = campos.map((campo) => datos[campo])

    // Construir la consulta SQL
    const query = `
      INSERT INTO investigadores (${campos.join(", ")})
      VALUES (${placeholders})
    `

    console.log("Query SQL:", query)
    console.log("Valores:", valores)

    // Ejecutar la consulta
    const result = await db.run(query, valores)
    console.log("Resultado de la inserción:", result)

    return {
      success: true,
      message: `✅ Registro exitoso para CURP ${curp}`,
      id: result.lastID,
    }
  } catch (error) {
    console.error("Error al guardar investigador:", error)
    return {
      success: false,
      message: `❌ Error al guardar: ${error instanceof Error ? error.message : "Error desconocido"}`,
      error,
    }
  }
}

// Función para obtener todos los investigadores
export async function obtenerInvestigadores() {
  try {
    const db = await initDB()
    const investigadores = await db.all("SELECT * FROM investigadores")
    return investigadores
  } catch (error) {
    console.error("Error al obtener investigadores:", error)
    return []
  }
}

// Función para obtener un investigador por ID
export async function obtenerInvestigadorPorId(id: number) {
  try {
    const db = await initDB()
    const investigador = await db.get("SELECT * FROM investigadores WHERE id = ?", id)
    return investigador
  } catch (error) {
    console.error(`Error al obtener investigador con ID ${id}:`, error)
    return null
  }
}
