"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { UploadIcon as FileUpload, Upload, AlertCircle, Info } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Progress } from "@/components/ui/progress"

export default function SubirCVUPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [mensaje, setMensaje] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)
    setError(null)
  }

  // Modificar la función handleSubmit para mostrar mensajes más claros y manejar mejor los errores

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      setError("Por favor selecciona un archivo PDF")
      return
    }

    if (file.type !== "application/pdf") {
      setError("El archivo debe ser un PDF")
      return
    }

    setIsUploading(true)
    setMensaje("Procesando documento...")
    setProgress(10)

    try {
      // Crear FormData para enviar el archivo
      const formData = new FormData()
      formData.append("file", file)

      // Simular progreso
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 500)

      // Enviar el archivo a nuestra API
      const response = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setProgress(100)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al procesar el archivo")
      }

      const data = await response.json()
      console.log("Respuesta del servidor:", data)

      // Verificar si se usaron datos simulados
      if (data.simulado) {
        const mensajeAdvertencia =
          data.mensaje ||
          "ADVERTENCIA: Se están usando datos simulados porque no se pudo procesar el PDF. Verifica la instalación de Python y Tesseract."
        setMensaje(mensajeAdvertencia)

        // Guardar el mensaje de advertencia en sessionStorage
        sessionStorage.setItem("mensajeOCR", mensajeAdvertencia)
      } else {
        setMensaje(data.mensaje || "¡Datos extraídos correctamente! Redirigiendo a la página de revisión...")
        // Limpiar cualquier mensaje de advertencia previo
        sessionStorage.removeItem("mensajeOCR")
      }

      // Almacenar temporalmente los datos en sessionStorage para la página de revisión
      sessionStorage.setItem("datosOCR", JSON.stringify(data.datos))
      console.log("Datos guardados en sessionStorage:", data.datos)

      // Redirigir a la página de revisión después de un breve retraso
      setTimeout(() => {
        router.push("/registro/revisar-datos")
      }, 2000)
    } catch (error) {
      setError(
        `Ocurrió un error al procesar el archivo: ${error instanceof Error ? error.message : "Error desconocido"}`,
      )
      setProgress(0)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="container max-w-2xl mx-auto py-10 px-4">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-blue-900">Sube tu Perfil Único</h1>
          <p className="text-blue-600">Sube tu Perfil Único (PU) en formato PDF para agilizar tu registro</p>
        </div>

        <Card className="bg-white border-blue-100">
          <CardHeader>
            <CardTitle className="text-blue-900">Subir Perfil Único (PDF)</CardTitle>
            <CardDescription className="text-blue-600">
              Utilizamos tecnología OCR para extraer automáticamente tus datos del Perfil Único
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid w-full items-center gap-4">
                <div className="space-y-2">
                  <Label htmlFor="file" className="text-blue-900">
                    Archivo PDF del Perfil Único
                  </Label>
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-blue-200 rounded-md p-8 bg-blue-50">
                    <FileUpload className="h-10 w-10 text-blue-600 mb-4" />
                    <p className="text-sm text-blue-600 mb-4 text-center">
                      Arrastra y suelta tu archivo PDF aquí o haz clic para seleccionarlo
                    </p>
                    <Input id="file" type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("file")?.click()}
                      className="border-blue-200 text-blue-700 hover:bg-blue-50"
                    >
                      Seleccionar archivo
                    </Button>
                    {file && (
                      <p className="mt-4 text-sm text-blue-900">
                        Archivo seleccionado: <span className="font-medium">{file.name}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-blue-600">Procesando archivo...</Label>
                    <span className="text-sm text-blue-600">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2 bg-blue-50 [&>div]:bg-blue-700" />
                </div>
              )}

              {error && (
                <Alert variant="destructive" className="bg-red-900 border-red-800 text-white">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {mensaje && !error && !isUploading && (
                <Alert className="bg-blue-50 border-blue-200 text-blue-900">
                  <Upload className="h-4 w-4" />
                  <AlertTitle>Procesando</AlertTitle>
                  <AlertDescription>{mensaje}</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  asChild
                  className="border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  <Link href="/registro">Volver</Link>
                </Button>
                <Button
                  type="submit"
                  disabled={!file || isUploading}
                  className="bg-blue-700 text-white hover:bg-blue-800"
                >
                  {isUploading ? "Procesando..." : "Subir y procesar"}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="border-t border-blue-100 flex flex-col items-start pt-6">
            <Alert className="bg-blue-50 border-blue-200 text-blue-900 mb-4">
              <Info className="h-4 w-4" />
              <AlertTitle>¿Qué es el Perfil Único (PU)?</AlertTitle>
              <AlertDescription>
                El Perfil Único (PU) es el documento que contiene tu información académica y profesional. Anteriormente
                conocido como CVU (Currículum Vitae Único).
              </AlertDescription>
            </Alert>

            <h3 className="text-sm font-medium text-blue-900 mb-2">¿Cómo funciona el procesamiento OCR?</h3>
            <ul className="space-y-1 text-sm text-blue-600">
              <li className="flex items-start">
                <span className="mr-2">1.</span>
                <span>Subimos tu archivo PDF del Perfil Único al servidor</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">2.</span>
                <span>Nuestro sistema extrae el texto mediante reconocimiento óptico de caracteres (OCR)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">3.</span>
                <span>Identificamos automáticamente tus datos personales y académicos</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">4.</span>
                <span>Te mostramos los datos extraídos para que los verifiques antes de guardarlos</span>
              </li>
            </ul>
          </CardFooter>
        </Card>

        <div className="text-center text-sm text-blue-600">
          <p>
            ¿Prefieres registrarte manualmente?{" "}
            <Link href="/registro" className="text-blue-700 underline underline-offset-4 hover:text-blue-900">
              Volver al formulario de registro
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
