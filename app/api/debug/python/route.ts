import { NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"
import { join } from "path"

const execPromise = promisify(exec)

export async function GET() {
  try {
    let output = "=== Diagnóstico del Sistema ===\n\n"

    // Verificar versión de Python
    try {
      const { stdout: pythonVersion } = await execPromise("python --version")
      output += `✅ Python instalado: ${pythonVersion.trim()}\n`
    } catch (error) {
      output += `❌ Python no está instalado o no está en el PATH\n`
      output += `Error: ${error instanceof Error ? error.message : "Error desconocido"}\n`
    }

    // Verificar versión de Tesseract
    try {
      const { stdout: tesseractVersion } = await execPromise("tesseract --version")
      output += `✅ Tesseract OCR instalado\n`
      output += `${tesseractVersion.split("\n")[0].trim()}\n`

      // Verificar idiomas disponibles
      const { stdout: tesseractLangs } = await execPromise("tesseract --list-langs")
      output += `\nIdiomas disponibles en Tesseract:\n${tesseractLangs}\n`

      // Verificar si el idioma español está disponible
      if (tesseractLangs.includes("spa")) {
        output += `✅ El idioma español (spa) está disponible\n`
      } else {
        output += `❌ El idioma español (spa) NO está disponible\n`
        output += `Por favor, instala el paquete de idioma español para Tesseract\n`
      }
    } catch (error) {
      output += `❌ Tesseract OCR no está instalado o no está en el PATH\n`
      output += `Error: ${error instanceof Error ? error.message : "Error desconocido"}\n`
    }

    // Verificar dependencias de Python
    try {
      const scriptPath = join(process.cwd(), "scripts", "check_dependencies.py")
      const pythonScript = `
import sys

def check_dependency(module_name):
    try:
        __import__(module_name)
        return True
    except ImportError:
        return False

# Verificar dependencias
dependencies = {
    "fitz (PyMuPDF)": "fitz",
    "pdf2image": "pdf2image",
    "pytesseract": "pytesseract"
}

for name, module in dependencies.items():
    if check_dependency(module):
        print(f"✅ {name} está instalado")
    else:
        print(f"❌ {name} NO está instalado")

# Verificar configuración de pytesseract
if check_dependency("pytesseract"):
    import pytesseract
    try:
        print(f"\\nConfiguración de pytesseract:")
        print(f"Ruta de Tesseract: {pytesseract.pytesseract.tesseract_cmd}")
    except Exception as e:
        print(f"Error al obtener configuración de pytesseract: {str(e)}")
`

      // Escribir el script temporal
      const fs = await import("fs/promises")
      await fs.writeFile(scriptPath, pythonScript)

      // Ejecutar el script
      const { stdout: dependenciesOutput } = await execPromise(`python "${scriptPath}"`)
      output += `\n=== Dependencias de Python ===\n${dependenciesOutput}\n`

      // Eliminar el script temporal
      await fs.unlink(scriptPath)
    } catch (error) {
      output += `\n❌ Error al verificar dependencias de Python\n`
      output += `Error: ${error instanceof Error ? error.message : "Error desconocido"}\n`
    }

    // Instrucciones de instalación
    output += `\n=== Instrucciones de Instalación ===\n`
    output += `Si falta alguna dependencia, puedes instalarlas con:\n`
    output += `pip install PyMuPDF pdf2image pytesseract\n\n`
    output += `Para instalar Tesseract OCR:\n`
    output += `- Windows: Descarga desde https://github.com/UB-Mannheim/tesseract/wiki\n`
    output += `- macOS: brew install tesseract\n`
    output += `- Ubuntu/Debian: sudo apt-get install tesseract-ocr\n\n`
    output += `Para instalar el idioma español para Tesseract:\n`
    output += `- Windows: Descarga spa.traineddata y colócalo en la carpeta tessdata\n`
    output += `- macOS: brew install tesseract-lang\n`
    output += `- Ubuntu/Debian: sudo apt-get install tesseract-ocr-spa\n`

    return NextResponse.json({ output })
  } catch (error) {
    console.error("Error en el diagnóstico:", error)
    return NextResponse.json(
      {
        error: `Error al ejecutar el diagnóstico: ${error instanceof Error ? error.message : "Error desconocido"}`,
        output: "Error al ejecutar el diagnóstico. Verifica los logs del servidor.",
      },
      { status: 500 },
    )
  }
}
