import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock, Download, ExternalLink } from "lucide-react"

// Datos de ejemplo para convocatorias
const convocatorias = [
  {
    id: 1,
    titulo: "Apoyo a Proyectos de Investigación en Energías Renovables",
    organizacion: "Consejo Estatal de Ciencia, Tecnología e Innovación de Chihuahua",
    descripcion:
      "Convocatoria para financiar proyectos de investigación enfocados en el desarrollo de tecnologías de energía renovable adaptadas a las condiciones del estado de Chihuahua.",
    fechaApertura: "2023-05-15",
    fechaCierre: "2023-07-30",
    montoMaximo: "$500,000 MXN",
    categoria: "Energía",
    estado: "Abierta",
  },
  {
    id: 2,
    titulo: "Programa de Estímulos a la Innovación Tecnológica",
    organizacion: "Secretaría de Innovación y Desarrollo Económico",
    descripcion:
      "Programa destinado a incentivar la inversión en investigación y desarrollo tecnológico en empresas chihuahuenses, con énfasis en la vinculación con instituciones académicas.",
    fechaApertura: "2023-06-01",
    fechaCierre: "2023-08-15",
    montoMaximo: "$750,000 MXN",
    categoria: "Desarrollo Tecnológico",
    estado: "Abierta",
  },
  {
    id: 3,
    titulo: "Becas para Estancias de Investigación Internacional",
    organizacion: "Universidad Autónoma de Chihuahua",
    descripcion:
      "Programa de becas para realizar estancias de investigación en instituciones internacionales de prestigio, dirigido a investigadores y estudiantes de posgrado.",
    fechaApertura: "2023-04-10",
    fechaCierre: "2023-06-15",
    montoMaximo: "$300,000 MXN",
    categoria: "Movilidad Académica",
    estado: "Cerrada",
  },
  {
    id: 4,
    titulo: "Fondo para Investigación en Salud Pública",
    organizacion: "Secretaría de Salud del Estado de Chihuahua",
    descripcion:
      "Financiamiento para proyectos de investigación orientados a resolver problemas de salud pública prioritarios en el estado de Chihuahua.",
    fechaApertura: "2023-07-01",
    fechaCierre: "2023-09-30",
    montoMaximo: "$600,000 MXN",
    categoria: "Salud",
    estado: "Próxima",
  },
  {
    id: 5,
    titulo: "Apoyo a Publicaciones Científicas",
    organizacion: "Consejo Estatal de Ciencia, Tecnología e Innovación de Chihuahua",
    descripcion:
      "Programa para apoyar la publicación de artículos científicos en revistas indexadas internacionales, incluyendo costos de traducción y publicación.",
    fechaApertura: "2023-03-15",
    fechaCierre: "2023-11-30",
    montoMaximo: "$50,000 MXN por publicación",
    categoria: "Publicaciones",
    estado: "Abierta",
  },
]

export default function ConvocatoriasPage() {
  // Función para formatear fechas
  const formatearFecha = (fechaStr: string) => {
    const fecha = new Date(fechaStr)
    return fecha.toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Función para determinar el color de la insignia de estado
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Abierta":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "Cerrada":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      case "Próxima":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      default:
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-blue-900">Convocatorias</h1>
          <p className="text-blue-600">
            Encuentra las convocatorias abiertas para financiamiento de proyectos de investigación en Chihuahua
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {convocatorias.map((convocatoria) => (
            <Card key={convocatoria.id} className="bg-white border-blue-100">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <Badge className="mb-2 bg-blue-700 text-white">{convocatoria.categoria}</Badge>
                    <Badge className={`ml-2 ${getEstadoColor(convocatoria.estado)}`}>{convocatoria.estado}</Badge>
                  </div>
                </div>
                <CardTitle className="text-xl text-blue-900">{convocatoria.titulo}</CardTitle>
                <CardDescription className="text-blue-600">{convocatoria.organizacion}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-blue-600 mb-4">{convocatoria.descripcion}</p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-blue-600">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    <span>
                      Apertura: {formatearFecha(convocatoria.fechaApertura)} - Cierre:{" "}
                      {formatearFecha(convocatoria.fechaCierre)}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-blue-600">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>
                      {new Date(convocatoria.fechaCierre) > new Date()
                        ? `Cierra en ${Math.ceil(
                            (new Date(convocatoria.fechaCierre).getTime() - new Date().getTime()) /
                              (1000 * 60 * 60 * 24),
                          )} días`
                        : "Convocatoria cerrada"}
                    </span>
                  </div>
                  <div className="flex items-center text-sm font-medium text-blue-900">
                    <span>Monto máximo: {convocatoria.montoMaximo}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-blue-100 pt-4 flex justify-between">
                <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                  <Download className="mr-2 h-4 w-4" />
                  Descargar bases
                </Button>
                <Button className="bg-blue-700 text-white hover:bg-blue-800">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Ver detalles
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
