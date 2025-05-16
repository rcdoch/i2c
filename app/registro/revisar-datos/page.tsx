"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Textarea } from "@/components/ui/textarea"

interface DatosOCR {
  nombre_completo: string
  curp: string
  rfc: string
  no_cvu: string
  correo: string
  institucion: string
  linea_investigacion: string
  nacionalidad: string
  fecha_nacimiento: string
}

export default function RevisarDatosPage() {
  const [datos, setDatos] = useState<DatosOCR>({
    nombre_completo: "",
    curp: "",
    rfc: "",
    no_cvu: "",
    correo: "",
    institucion: "",
    linea_investigacion: "",
    nacionalidad: "",
    fecha_nacimiento: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDataLoaded, setIsDataLoaded] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Verificar si hay un mensaje en los parámetros de la URL
    const datosGuardados = sessionStorage.getItem("datosOCR")
    if (datosGuardados) {
      try {
        const datosParseados = JSON.parse(datosGuardados)
        console.log("Datos recuperados de sessionStorage:", datosParseados)

        // Formatear la fecha si es necesario
        if (datosParseados.fecha_nacimiento && datosParseados.fecha_nacimiento.includes("-")) {
          const [year, month, day] = datosParseados.fecha_nacimiento.split("-")
          if (year && month && day) {
            datosParseados.fecha_nacimiento = `${year}-${month}-${day}`
          }
        }

        setDatos(datosParseados)
        setIsDataLoaded(true)

        // Verificar si hay un mensaje de simulación
        const mensajeSimulacion = sessionStorage.getItem("mensajeOCR")
        if (mensajeSimulacion) {
          setError(mensajeSimulacion)
        }
      } catch (error) {
        console.error("Error al parsear los datos de sessionStorage:", error)
        setError("Error al cargar los datos extraídos. Por favor, intenta nuevamente.")
      }
    } else {
      console.log("No se encontraron datos en sessionStorage")
      // Si no hay datos, redirigir a la página de subir PU
      router.push("/registro/subir-cvu")
    }
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setDatos((prevDatos) => ({
      ...prevDatos,
      [name]: value,
    }))
  }

  // Modificar la función handleSubmit para asegurar que los datos se guarden correctamente en la base de datos

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      console.log("Enviando datos al servidor:", datos)

      // Enviar datos al servidor
      const response = await fetch("/api/registro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
      })

      const responseData = await response.json()
      console.log("Respuesta del servidor:", responseData)

      if (!response.ok) {
        // Manejar caso de duplicado (código 409)
        if (response.status === 409 && responseData.duplicado) {
          setError(`${responseData.message} ID: ${responseData.id}`)
          setIsLoading(false)
          return
        }

        throw new Error(responseData.error || "Error al guardar los datos")
      }

      // Mostrar mensaje de éxito si es necesario
      if (responseData.message && responseData.message.includes("SIN CURP")) {
        // Podríamos mostrar una alerta, pero seguimos adelante
        console.warn(responseData.message)
      }

      // Limpiar sessionStorage
      sessionStorage.removeItem("datosOCR")

      // Redirigir a la página de éxito con el mensaje adecuado
      const tipo = responseData.message && responseData.message.includes("⚠️") ? "warning" : "success"
      const urlParams = new URLSearchParams({
        mensaje: responseData.message || "Registro completado exitosamente",
        tipo: tipo,
      })

      router.push(`/registro/exito?${urlParams.toString()}`)
    } catch (error) {
      console.error("Error al guardar los datos:", error)
      setError(`Error al guardar los datos: ${error instanceof Error ? error.message : "Error desconocido"}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-2xl mx-auto py-10 px-4">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-blue-900">Revisa tus datos</h1>
          <p className="text-blue-600">
            Verifica y corrige la información extraída de tu Perfil Único antes de continuar
          </p>
        </div>

        <Alert className="bg-blue-50 border-blue-200 text-blue-900">
          <Info className="h-4 w-4" />
          <AlertTitle>Importante</AlertTitle>
          <AlertDescription>
            Los datos han sido extraídos mediante reconocimiento óptico de caracteres (OCR) y pueden contener errores.
            Por favor, revisa cuidadosamente cada campo y realiza las correcciones necesarias.
          </AlertDescription>
        </Alert>

        {!isDataLoaded ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
          </div>
        ) : (
          <Card className="bg-white border-blue-100">
            <CardHeader>
              <CardTitle className="text-blue-900">Datos extraídos de tu Perfil Único</CardTitle>
              <CardDescription className="text-blue-600">
                Estos datos serán utilizados para crear tu perfil de investigador
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form id="revisar-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="no_cvu" className="text-blue-900">
                      Número de PU
                    </Label>
                    <Input
                      id="no_cvu"
                      name="no_cvu"
                      value={datos.no_cvu}
                      onChange={handleChange}
                      className="bg-white border-blue-200 text-blue-900 placeholder:text-blue-400"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nombre_completo" className="text-blue-900">
                      Nombre Completo
                    </Label>
                    <Input
                      id="nombre_completo"
                      name="nombre_completo"
                      value={datos.nombre_completo}
                      onChange={handleChange}
                      className="bg-white border-blue-200 text-blue-900 placeholder:text-blue-400"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="curp" className="text-blue-900">
                      CURP
                    </Label>
                    <Input
                      id="curp"
                      name="curp"
                      value={datos.curp}
                      onChange={handleChange}
                      className="bg-white border-blue-200 text-blue-900 placeholder:text-blue-400"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rfc" className="text-blue-900">
                      RFC
                    </Label>
                    <Input
                      id="rfc"
                      name="rfc"
                      value={datos.rfc}
                      onChange={handleChange}
                      className="bg-white border-blue-200 text-blue-900 placeholder:text-blue-400"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="correo" className="text-blue-900">
                      Correo Electrónico
                    </Label>
                    <Input
                      id="correo"
                      name="correo"
                      type="email"
                      value={datos.correo}
                      onChange={handleChange}
                      className="bg-white border-blue-200 text-blue-900 placeholder:text-blue-400"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fecha_nacimiento" className="text-blue-900">
                      Fecha de Nacimiento
                    </Label>
                    <Input
                      id="fecha_nacimiento"
                      name="fecha_nacimiento"
                      type="date"
                      value={datos.fecha_nacimiento}
                      onChange={handleChange}
                      className="bg-white border-blue-200 text-blue-900 placeholder:text-blue-400"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nacionalidad" className="text-blue-900">
                      Nacionalidad
                    </Label>
                    <Input
                      id="nacionalidad"
                      name="nacionalidad"
                      value={datos.nacionalidad}
                      onChange={handleChange}
                      className="bg-white border-blue-200 text-blue-900 placeholder:text-blue-400"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="institucion" className="text-blue-900">
                      Institución
                    </Label>
                    <Input
                      id="institucion"
                      name="institucion"
                      value={datos.institucion}
                      onChange={handleChange}
                      className="bg-white border-blue-200 text-blue-900 placeholder:text-blue-400"
                      required
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="linea_investigacion" className="text-blue-900">
                      Línea de Investigación
                    </Label>
                    <Textarea
                      id="linea_investigacion"
                      name="linea_investigacion"
                      value={datos.linea_investigacion}
                      onChange={handleChange}
                      className="bg-white border-blue-200 text-blue-900 placeholder:text-blue-400"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive" className="bg-red-900 border-red-800 text-white">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </form>
            </CardContent>
            <CardFooter className="border-t border-blue-100 flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                asChild
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <Link href="/registro/subir-cvu">Volver</Link>
              </Button>
              <Button
                type="submit"
                form="revisar-form"
                disabled={isLoading}
                className="bg-blue-700 text-white hover:bg-blue-800"
              >
                {isLoading ? "Guardando..." : "Guardar y continuar"}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}
