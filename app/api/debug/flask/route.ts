import { NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"
import { join } from "path"
import { writeFile } from "fs/promises"

const execPromise = promisify(exec)

export async function GET() {
  try {
    let output = "=== Verificando instalación de Flask ===\n\n"

    // Verificar si Flask está instalado
    try {
      const { stdout: flaskVersion } = await execPromise('python -c "import flask; print(flask.__version__)"')
      output += `✅ Flask está instalado: versión ${flaskVersion.trim()}\n`
    } catch (error) {
      output += `❌ Flask no está instalado o no se puede importar\n`
      output += `Error: ${error instanceof Error ? error.message : "Error desconocido"}\n`
      output += `Intenta instalar Flask con: pip install Flask\n`
    }

    // Verificar otras dependencias
    const dependencies = [
      { name: "pdf2image", importName: "pdf2image" },
      { name: "PyMuPDF", importName: "fitz" },
      { name: "pytesseract", importName: "pytesseract" },
      { name: "Pillow", importName: "PIL" },
    ]

    output += "\n=== Verificando otras dependencias ===\n"

    for (const dep of dependencies) {
      try {
        const { stdout } = await execPromise(`python -c "import ${dep.importName}; print('Instalado')"`)
        if (stdout.trim() === "Instalado") {
          output += `✅ ${dep.name} está instalado\n`
        }
      } catch (error) {
        output += `❌ ${dep.name} no está instalado o no se puede importar\n`
      }
    }

    // Crear un script de prueba para Flask
    const testScriptPath = join(process.cwd(), "tmp", "test_flask.py")
    const testScript = `
from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/test', methods=['GET'])
def test():
    return jsonify({"status": "success", "message": "Flask está funcionando correctamente"})

if __name__ == '__main__':
    print("Flask está configurado correctamente")
    print("Para ejecutar el servidor Flask, usa: flask run")
`

    try {
      await writeFile(testScriptPath, testScript)
      output += "\nSe ha creado un script de prueba para Flask en tmp/test_flask.py\n"

      // Ejecutar el script para verificar que Flask se importa correctamente
      const { stdout: testOutput } = await execPromise(`python "${testScriptPath}"`)
      output += `\nResultado de la prueba:\n${testOutput}\n`
    } catch (error) {
      output += `\nError al crear o ejecutar el script de prueba: ${error instanceof Error ? error.message : "Error desconocido"}\n`
    }

    return NextResponse.json({ output })
  } catch (error) {
    console.error("Error en la verificación de Flask:", error)
    return NextResponse.json(
      {
        error: `Error al verificar Flask: ${error instanceof Error ? error.message : "Error desconocido"}`,
        output: "Error al ejecutar la verificación. Verifica los logs del servidor.",
      },
      { status: 500 },
    )
  }
}
