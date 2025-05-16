import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, FileText, Link2, Share2, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Datos de ejemplo para un proyecto
const project = {
  id: 1,
  title: "Patrones de actividad neuronal durante el sueño REM",
  description:
    "Este proyecto investiga los patrones de actividad cerebral durante las diferentes fases del sueño, con un enfoque especial en la fase REM. Utilizamos técnicas avanzadas de neuroimagen y electroencefalografía para monitorear la actividad cerebral durante el sueño y analizar cómo estos patrones se relacionan con la consolidación de la memoria y otros procesos cognitivos.",
  image: "/placeholder.svg?height=600&width=1200",
  startDate: "Enero 2020",
  endDate: "Diciembre 2023",
  status: "En curso",
  category: "Neurociencia",
  tags: ["Neurociencia", "Sueño REM", "Cognición", "Memoria", "EEG"],
  researchers: [
    {
      id: 1,
      name: "Dra. María Rodríguez",
      role: "Investigadora Principal",
      avatar: "/placeholder.svg?height=100&width=100",
      slug: "maria-rodriguez",
    },
    {
      id: 2,
      name: "Dr. Carlos Méndez",
      role: "Investigador Asociado",
      avatar: "/placeholder.svg?height=100&width=100",
      slug: "carlos-mendez",
    },
    {
      id: 3,
      name: "Dra. Ana Martínez",
      role: "Investigadora Asociada",
      avatar: "/placeholder.svg?height=100&width=100",
      slug: "ana-martinez",
    },
  ],
  institution: "Universidad Autónoma de Chihuahua",
  funding: "Consejo Estatal de Ciencia, Tecnología e Innovación de Chihuahua",
  fundingAmount: "$450,000",
  publications: [
    {
      id: 1,
      title: "Correlatos neurales del procesamiento de la memoria durante el sueño REM",
      journal: "Journal of Sleep Research",
      year: "2022",
      doi: "10.1234/jsr.2022.001",
    },
    {
      id: 2,
      title: "Patrones de actividad cerebral durante diferentes fases del sueño",
      journal: "Neuroscience",
      year: "2021",
      doi: "10.1234/neuro.2021.002",
    },
  ],
  methodology:
    "Este estudio utiliza un enfoque multidisciplinario que combina electroencefalografía (EEG), resonancia magnética funcional (fMRI) y pruebas cognitivas. Los participantes son monitoreados durante ciclos completos de sueño en un laboratorio especializado, mientras se registra su actividad cerebral. Posteriormente, se realizan pruebas de memoria y otras funciones cognitivas para correlacionar con los patrones observados durante el sueño.",
  findings:
    "Los resultados preliminares sugieren una correlación significativa entre ciertos patrones de actividad durante la fase REM y la consolidación de la memoria declarativa. También hemos identificado patrones específicos asociados con el procesamiento emocional durante esta fase del sueño.",
  impact:
    "Este estudio tiene implicaciones importantes para la comprensión de los trastornos del sueño y su relación con problemas cognitivos. Los hallazgos podrían contribuir al desarrollo de nuevas terapias para trastornos como el insomnio, la apnea del sueño y ciertas condiciones neurodegenerativas.",
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-8">
        {/* Encabezado del proyecto */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge className="bg-blue-700 text-white">{project.category}</Badge>
            <Badge variant="outline" className="border-blue-200 text-blue-700">
              {project.status}
            </Badge>
          </div>

          <h1 className="text-3xl font-bold md:text-4xl text-blue-900">{project.title}</h1>

          <div className="flex flex-wrap gap-4 text-sm text-blue-600">
            <div className="flex items-center">
              <CalendarDays className="mr-1 h-4 w-4" />
              <span>
                {project.startDate} - {project.endDate}
              </span>
            </div>
            <div className="flex items-center">
              <Users className="mr-1 h-4 w-4" />
              <span>{project.researchers.length} investigadores</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {project.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-50">
              <Share2 className="mr-2 h-4 w-4" />
              Compartir
            </Button>
            <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-50">
              <Link2 className="mr-2 h-4 w-4" />
              Copiar enlace
            </Button>
          </div>
        </div>

        {/* Imagen del proyecto */}
        <div className="relative w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden">
          <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" priority />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contenido principal */}
          <div className="md:col-span-2 space-y-6">
            <Card className="bg-white border-blue-100">
              <CardHeader>
                <CardTitle className="text-blue-900">Descripción del proyecto</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-600">{project.description}</p>
              </CardContent>
            </Card>

            <Tabs defaultValue="methodology" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-blue-50">
                <TabsTrigger
                  value="methodology"
                  className="text-blue-700 data-[state=active]:bg-white data-[state=active]:text-blue-900"
                >
                  Metodología
                </TabsTrigger>
                <TabsTrigger
                  value="findings"
                  className="text-blue-700 data-[state=active]:bg-white data-[state=active]:text-blue-900"
                >
                  Hallazgos
                </TabsTrigger>
                <TabsTrigger
                  value="impact"
                  className="text-blue-700 data-[state=active]:bg-white data-[state=active]:text-blue-900"
                >
                  Impacto
                </TabsTrigger>
              </TabsList>

              <TabsContent value="methodology" className="mt-6">
                <Card className="bg-white border-blue-100">
                  <CardContent className="pt-6">
                    <p className="text-blue-600">{project.methodology}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="findings" className="mt-6">
                <Card className="bg-white border-blue-100">
                  <CardContent className="pt-6">
                    <p className="text-blue-600">{project.findings}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="impact" className="mt-6">
                <Card className="bg-white border-blue-100">
                  <CardContent className="pt-6">
                    <p className="text-blue-600">{project.impact}</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <Card className="bg-white border-blue-100">
              <CardHeader>
                <CardTitle className="text-blue-900">Publicaciones relacionadas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {project.publications.map((publication) => (
                  <div key={publication.id} className="border-b last:border-0 pb-4 last:pb-0 border-blue-100">
                    <h3 className="font-medium mb-1 text-blue-900">{publication.title}</h3>
                    <div className="flex flex-col space-y-1 text-sm text-blue-600">
                      <p>
                        {publication.journal}, {publication.year}
                      </p>
                      <p className="flex items-center">
                        <FileText className="h-3.5 w-3.5 mr-1" />
                        DOI: {publication.doi}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Barra lateral */}
          <div className="space-y-6">
            <Card className="bg-white border-blue-100">
              <CardHeader>
                <CardTitle className="text-lg text-blue-900">Equipo de investigación</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {project.researchers.map((researcher) => (
                  <div key={researcher.id} className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={researcher.avatar || "/placeholder.svg"} alt={researcher.name} />
                      <AvatarFallback className="bg-blue-100 text-blue-700">
                        {researcher.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Link
                        href={`/investigadores/${researcher.slug}`}
                        className="font-medium hover:underline text-blue-900"
                      >
                        {researcher.name}
                      </Link>
                      <p className="text-sm text-blue-600">{researcher.role}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-white border-blue-100">
              <CardHeader>
                <CardTitle className="text-lg text-blue-900">Información del proyecto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-blue-900">Institución</p>
                  <p className="text-sm text-blue-600">{project.institution}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">Financiamiento</p>
                  <p className="text-sm text-blue-600">{project.funding}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">Monto</p>
                  <p className="text-sm text-blue-600">{project.fundingAmount}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">Periodo</p>
                  <p className="text-sm text-blue-600">
                    {project.startDate} - {project.endDate}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-blue-100">
              <CardHeader>
                <CardTitle className="text-lg text-blue-900">Contacto</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-600 mb-4">¿Interesado en colaborar o saber más sobre este proyecto?</p>
                <Button className="w-full bg-blue-700 text-white hover:bg-blue-800">Contactar al equipo</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
