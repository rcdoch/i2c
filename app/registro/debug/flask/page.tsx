"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, AlertCircle, Terminal } from "lucide-react"
import Link from "next/link"

export default function FlaskDebugPage() {
  const [output, setOutput] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkFlaskInstallation = async () => {
    setIsLoading(true)
    setError(null)
    setOutput("Verificando instalación de Flask...")

    try {
      const response = await fetch("/api/debug/flask")

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      setOutput(data.output)
    } catch (err) {
      setError(`Error al verificar Flask: ${err instanceof Error ? err.message : "Error desconocido"}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-3xl mx-auto py-10 px-4">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-blue-900">Diagnóstico de Flask</h1>
          <p className="text-blue-600">Utiliza esta página para verificar la instalación de Flask y sus dependencias</p>
        </div>

        <Alert className="bg-blue-50 border-blue-200 text-blue-900">
          <Info className="h-4 w-4" />
          <AlertTitle>Información</AlertTitle>
          <AlertDescription>
            Esta página te ayudará a diagnosticar problemas con la instalación de Flask y sus dependencias. Flask es
            necesario para algunas funcionalidades del sistema.
          </AlertDescription>
        </Alert>

        <Card className="bg-white border-blue-100">
          <CardHeader>
            <CardTitle className="text-blue-900">Verificar Instalación de Flask</CardTitle>
            <CardDescription className="text-blue-600">
              Ejecuta una prueba para verificar que Flask y sus dependencias estén instalados correctamente.
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
                    <span>Haz clic en "Verificar Flask" para ver los resultados</span>
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
            <Button variant="outline" asChild className="border-blue-200 text-blue-700 hover:bg-blue-50">
              <Link href="/registro/debug">Volver</Link>
            </Button>
            <Button
              onClick={checkFlaskInstallation}
              disabled={isLoading}
              className="bg-blue-700 text-white hover:bg-blue-800"
            >
              {isLoading ? "Verificando..." : "Verificar Flask"}
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-white border-blue-100">
          <CardHeader>
            <CardTitle className="text-blue-900">Instrucciones de Instalación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-blue-900 mb-2">1. Instalar Flask y dependencias</h3>
                <p className="text-blue-600 text-sm mb-2">Ejecuta el siguiente comando:</p>
                <div className="bg-gray-100 p-2 rounded-md">
                  <code>pip install Flask pdf2image PyMuPDF pytesseract Pillow</code>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-blue-900 mb-2">2. Verificar la instalación</h3>
                <p className="text-blue-600 text-sm mb-2">Puedes verificar que Flask está instalado con:</p>
                <div className="bg-gray-100 p-2 rounded-md">
                  <code>python -c "import flask; print(flask.__version__)"</code>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-blue-900 mb-2">3. Problemas comunes</h3>
                <ul className="list-disc pl-5 text-blue-600 text-sm space-y-1">
                  <li>
                    <strong>Error al importar Flask:</strong> Asegúrate de que Flask está instalado en el mismo entorno
                    de Python que estás usando.
                  </li>
                  <li>
                    <strong>Error al importar pdf2image:</strong> Asegúrate de tener instalado poppler-utils
                    (Linux/macOS) o poppler para Windows.
                  </li>
                  <li>
                    <strong>Error al importar pytesseract:</strong> Asegúrate de tener Tesseract OCR instalado en tu
                    sistema.
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
