import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { writeFile } from "fs/promises"
import { join } from "path"
import { exec } from "child_process"
import { promisify } from "util"

const execPromise = promisify(exec)

// Función mejorada para procesar PDF con Python
async function procesarPDFConPython(filePath: string): Promise<any> {
  try {
    // Ruta al script Python
    const scriptPath = join(process.cwd(), "scripts", "extraer_datos_pu.py")

    console.log(`Ejecutando script Python: python "${scriptPath}" "${filePath}"`)
    console.log(`Ruta completa del archivo: ${filePath}`)
    console.log(`El archivo existe: ${await import("fs").then((fs) => (fs.existsSync(filePath) ? "Sí" : "No"))}`)

    // Ejecutar el script Python con más diagnóstico
    const { stdout, stderr } = await execPromise(`python "${scriptPath}" "${filePath}"`, {
      shell: true,
      maxBuffer: 1024 * 1024 * 10,
      timeout: 60000, // 60 segundos de timeout
    })

    // Registrar salida de error para diagnóstico
    if (stderr && stderr.trim() !== "") {
      console.error("Salida de error del script Python:", stderr)
    }

    // Verificar que la salida no esté vacía
    if (!stdout || stdout.trim() === "") {
      throw new Error("El script Python no produjo ninguna salida")
    }

    console.log("Salida del script Python:", stdout.substring(0, 200) + "...")

    // Parsear la salida JSON del script Python
    try {
      const datos = JSON.parse(stdout)

      // Verificar si hay un error en los datos
      if (datos.error) {
        throw new Error(`Error en el script Python: ${datos.error}`)
      }

      return datos
    } catch (parseError) {
      console.error("Error al parsear la salida JSON:", parseError)
      console.error("Salida recibida:", stdout)
      throw new Error("La salida del script Python no es un JSON válido")
    }
  } catch (error) {
    console.error("Error al ejecutar el script Python:", error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No se ha proporcionado ningún archivo" }, { status: 400 })
    }

    // Verificar que sea un PDF
    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "El archivo debe ser un PDF" }, { status: 400 })
    }

    // Crear directorio temporal si no existe
    const uploadDir = join(process.cwd(), "tmp")
    try {
      await import("fs").then((fs) => {
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true })
        }
      })
    } catch (err) {
      console.error("Error al crear directorio temporal:", err)
    }

    // Guardar el archivo en el servidor temporalmente
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filePath = join(uploadDir, file.name)
    await writeFile(filePath, buffer)

    console.log(`Archivo guardado temporalmente en: ${filePath}`)

    // Procesar el PDF con el script Python
    let datosExtraidos
    let usandoDatosSimulados = false

    try {
      // Intentar procesar con Python
      datosExtraidos = await procesarPDFConPython(filePath)
      console.log("Datos extraídos exitosamente:", datosExtraidos)

      // Verificar si los datos extraídos son válidos
      if (!datosExtraidos || Object.keys(datosExtraidos).length === 0) {
        throw new Error("No se pudieron extraer datos del PDF")
      }

      // Verificar si la mayoría de los campos son "NO DETECTADO"
      const camposNoDetectados = Object.values(datosExtraidos).filter((valor) => valor === "NO DETECTADO").length
      const totalCampos = Object.keys(datosExtraidos).length

      if (camposNoDetectados > totalCampos / 2) {
        console.warn(
          `La mayoría de los campos no fueron detectados (${camposNoDetectados}/${totalCampos}), posible problema con el OCR`,
        )
      }
    } catch (error) {
      console.error("Error crítico al procesar con Python:", error)

      // SOLO en caso de error crítico, usar datos simulados
      usandoDatosSimulados = true

      // Datos simulados para desarrollo/demo - SOLO EN CASO DE ERROR CRÍTICO
      datosExtraidos = {
        nombre_completo: "Carlos Méndez López",
        curp: "MELM800101HCHNNS09",
        rfc: "MELC800101AB9",
        no_cvu: "123456",
        correo: "carlos.mendez@universidad.edu",
        institucion: "Universidad Autónoma de Chihuahua",
        linea_investigacion: "Inteligencia Artificial y Robótica",
        nacionalidad: "Mexicana",
        fecha_nacimiento: "1980-01-01",
      }

      console.warn("Usando datos simulados debido a un error crítico:", datosExtraidos)
    }

    // Formatear la fecha de nacimiento si está en formato ISO
    if (datosExtraidos.fecha_nacimiento && datosExtraidos.fecha_nacimiento.match(/^\d{4}-\d{2}-\d{2}$/)) {
      try {
        const fecha = new Date(datosExtraidos.fecha_nacimiento)
        datosExtraidos.fecha_nacimiento = fecha.toISOString().split("T")[0]
      } catch (e) {
        console.error("Error al formatear la fecha:", e)
      }
    }

    // Limpiar el archivo temporal
    try {
      await import("fs").then((fs) => {
        fs.unlinkSync(filePath)
        console.log(`Archivo temporal eliminado: ${filePath}`)
      })
    } catch (err) {
      console.error("Error al eliminar archivo temporal:", err)
    }

    return NextResponse.json({
      success: true,
      datos: datosExtraidos,
      simulado: usandoDatosSimulados,
      mensaje: usandoDatosSimulados
        ? "ADVERTENCIA: Se están usando datos simulados debido a un error en el procesamiento. Verifica la instalación de Python y Tesseract."
        : "Datos extraídos correctamente del PDF.",
    })
  } catch (error) {
    console.error("Error al procesar el archivo:", error)
    return NextResponse.json(
      {
        error: `Error al procesar el archivo: ${error instanceof Error ? error.message : "Error desconocido"}`,
      },
      { status: 500 },
    )
  }
}
