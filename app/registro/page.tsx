"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { FileText, Upload, AlertCircle, Info } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Progress } from "@/components/ui/progress"

export default function RegistroPage() {
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

      // En una implementación real, enviaríamos el archivo a nuestra API
      // const response = await fetch("/api/ocr", {
      //   method: "POST",
      //   body: formData,
      // })

      // Simulación de respuesta para la demo
      await new Promise((resolve) => setTimeout(resolve, 3000))
      // const data = await response.json()

      clearInterval(progressInterval)
      setProgress(100)

      // Simulación de datos extraídos por OCR
      const datosExtraidos = {
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

      // Almacenar temporalmente los datos en sessionStorage para la página de revisión
      sessionStorage.setItem("datosOCR", JSON.stringify(datosExtraidos))

      // Redirigir a la página de revisión
      setTimeout(() => {
        router.push("/registro/revisar-datos")
      }, 500)
    } catch (error) {
      setError("Ocurrió un error al procesar el archivo. Inténtalo de nuevo.")
      setProgress(0)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="container max-w-2xl mx-auto py-10 px-4">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-blue-900">Regístrate en SECCTI</h1>
          <p className="text-blue-600">
            Sube tu Perfil Único en formato PDF para crear tu cuenta de investigador automáticamente
          </p>
        </div>

        <Alert className="bg-blue-50 border-blue-200 text-blue-900">
          <Info className="h-4 w-4" />
          <AlertTitle>Registro simplificado</AlertTitle>
          <AlertDescription>
            Utilizamos tecnología de reconocimiento óptico de caracteres (OCR) para extraer automáticamente tus datos
            del Perfil Único y agilizar tu registro en la plataforma.
          </AlertDescription>
        </Alert>

        <Card className="bg-white border-blue-100">
          <CardHeader>
            <CardTitle className="text-blue-900">Subir Perfil Único (PDF)</CardTitle>
            <CardDescription className="text-blue-600">
              Sube tu documento en formato PDF para crear tu cuenta de investigador
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
                    <FileText className="h-10 w-10 text-blue-600 mb-4" />
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
                <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-700">
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

              <Button
                type="submit"
                disabled={!file || isUploading}
                className="w-full bg-blue-700 text-white hover:bg-blue-800"
              >
                {isUploading ? "Procesando..." : "Subir y procesar"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="border-t border-blue-100 flex flex-col items-start pt-6">
            <h3 className="text-sm font-medium text-blue-900 mb-2">¿Cómo funciona el registro con Perfil Único?</h3>
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

        <div className="bg-blue-50 rounded-lg p-4">
          <h2 className="font-medium mb-2 text-blue-900">¿Por qué crear un perfil en SECCTI?</h2>
          <ul className="space-y-2 text-sm text-blue-600">
            <li>• Comparte tus investigaciones y proyectos con la comunidad científica</li>
            <li>• Conecta con otros investigadores en tu campo</li>
            <li>• Encuentra oportunidades de colaboración</li>
            <li>• Aumenta la visibilidad de tu trabajo académico</li>
          </ul>
        </div>

        <div className="text-center text-sm text-blue-600">
          <p>
            ¿Ya tienes una cuenta?{" "}
            <Link href="/iniciar-sesion" className="text-blue-700 underline underline-offset-4 hover:text-blue-900">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
