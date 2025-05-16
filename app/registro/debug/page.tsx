"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, AlertCircle, Terminal } from "lucide-react"
import Link from "next/link"

export default function DebugPage() {
  const [output, setOutput] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runPythonTest = async () => {
    setIsLoading(true)
    setError(null)
    setOutput("Ejecutando prueba de Python y Tesseract OCR...")

    try {
      const response = await fetch("/api/debug/python")

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      setOutput(data.output)
    } catch (err) {
      setError(`Error al ejecutar la prueba: ${err instanceof Error ? err.message : "Error desconocido"}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-3xl mx-auto py-10 px-4">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-blue-900">Diagnóstico del Sistema</h1>
          <p className="text-blue-600">
            Utiliza esta página para verificar la configuración del sistema y solucionar problemas con el procesamiento
            de PDFs.
          </p>
        </div>

        <Alert className="bg-blue-50 border-blue-200 text-blue-900">
          <Info className="h-4 w-4" />
          <AlertTitle>Información</AlertTitle>
          <AlertDescription>
            Esta página te ayudará a diagnosticar problemas con la extracción de datos de PDFs. Verifica que Python y
            Tesseract OCR estén correctamente instalados.
          </AlertDescription>
        </Alert>

        <Card className="bg-white border-blue-100">
          <CardHeader>
            <CardTitle className="text-blue-900">Verificar Instalación de Python y Tesseract OCR</CardTitle>
            <CardDescription className="text-blue-600">
              Ejecuta una prueba para verificar que todas las dependencias necesarias estén instaladas correctamente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-900 text-gray-100 p-4 rounded-md font-mono text-sm overflow-auto max-h-96">
                {output ? (
                  <pre>{output}</pre>
                ) : (
                  <div className="flex items-center justify-center h-32 text-gray-400">
                    <Terminal className="mr-2 h-5 w-5" />
                    <span>Haz clic en "Ejecutar Prueba" para ver los resultados</span>
                  </div>
                )}
              </div>

              {error && (
                <Alert variant="destructive" className="bg-red-900 border-red-800 text-white">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex justify-between">
              <Button variant="outline" asChild className="border-blue-200 text-blue-700 hover:bg-blue-50">
                <Link href="/registro/subir-cvu">Volver</Link>
              </Button>
              <div className="space-x-2">
                <Button asChild variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                  <Link href="/registro/debug/flask">Verificar Flask</Link>
                </Button>
                <Button
                  onClick={runPythonTest}
                  disabled={isLoading}
                  className="bg-blue-700 text-white hover:bg-blue-800"
                >
                  {isLoading ? "Ejecutando..." : "Ejecutar Prueba"}
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>

        <Card className="bg-white border-blue-100">
          <CardHeader>
            <CardTitle className="text-blue-900">Instrucciones de Instalación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-blue-900 mb-2">1. Instalar Python</h3>
                <p className="text-blue-600 text-sm">
                  Asegúrate de tener Python 3.x instalado en tu sistema. Puedes descargarlo desde{" "}
                  <a
                    href="https://www.python.org/downloads/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 underline"
                  >
                    python.org
                  </a>
                </p>
              </div>

              <div>
                <h3 className="font-medium text-blue-900 mb-2">2. Instalar Tesseract OCR</h3>
                <p className="text-blue-600 text-sm mb-2">Según tu sistema operativo:</p>
                <ul className="list-disc pl-5 text-blue-600 text-sm space-y-1">
                  <li>
                    <strong>Windows:</strong> Descarga e instala desde{" "}
                    <a
                      href="https://github.com/UB-Mannheim/tesseract/wiki"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 underline"
                    >
                      github.com/UB-Mannheim/tesseract/wiki
                    </a>
                  </li>
                  <li>
                    <strong>macOS:</strong>{" "}
                    <code className="bg-gray-100 px-1 py-0.5 rounded">brew install tesseract</code>
                  </li>
                  <li>
                    <strong>Ubuntu/Debian:</strong>{" "}
                    <code className="bg-gray-100 px-1 py-0.5 rounded">sudo apt-get install tesseract-ocr</code>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-blue-900 mb-2">3. Instalar Dependencias de Python</h3>
                <p className="text-blue-600 text-sm mb-2">Ejecuta el siguiente comando:</p>
                <div className="bg-gray-100 p-2 rounded-md">
                  <code>pip install PyMuPDF pdf2image pytesseract</code>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-blue-900 mb-2">4. Instalar Idioma Español para Tesseract</h3>
                <ul className="list-disc pl-5 text-blue-600 text-sm space-y-1">
                  <li>
                    <strong>Windows:</strong> Descarga{" "}
                    <a
                      href="https://github.com/tesseract-ocr/tessdata/raw/main/spa.traineddata"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 underline"
                    >
                      spa.traineddata
                    </a>{" "}
                    y colócalo en la carpeta <code className="bg-gray-100 px-1 py-0.5 rounded">tessdata</code> de tu
                    instalación de Tesseract
                  </li>
                  <li>
                    <strong>macOS:</strong>{" "}
                    <code className="bg-gray-100 px-1 py-0.5 rounded">brew install tesseract-lang</code>
                  </li>
                  <li>
                    <strong>Ubuntu/Debian:</strong>{" "}
                    <code className="bg-gray-100 px-1 py-0.5 rounded">sudo apt-get install tesseract-ocr-spa</code>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
