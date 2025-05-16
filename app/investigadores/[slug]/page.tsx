import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Briefcase, Building, ExternalLink, FileText, GraduationCap, Mail, MapPin, Share2 } from "lucide-react"

// Datos de ejemplo para un investigador
const researcher = {
  id: 1,
  name: "Dra. María Rodríguez",
  avatar: "/placeholder.svg?height=400&width=400",
  title: "Investigadora Principal en Neurociencia",
  institution: "Universidad Autónoma de Chihuahua",
  location: "Chihuahua, México",
  email: "maria.rodriguez@universidad.edu",
  bio: "Investigadora con más de 15 años de experiencia en el campo de la neurociencia. Mi trabajo se centra en comprender los mecanismos neuronales subyacentes a los trastornos del sueño y su impacto en la cognición.",
  expertise: ["Neurociencia", "Trastornos del sueño", "Neuroimagen", "Cognición"],
  education: [
    {
      degree: "Doctorado en Neurociencia",
      institution: "Universidad de California",
      year: "2008",
    },
    {
      degree: "Maestría en Biología",
      institution: "Universidad Nacional Autónoma",
      year: "2004",
    },
    {
      degree: "Licenciatura en Biología",
      institution: "Universidad Nacional Autónoma",
      year: "2002",
    },
  ],
  experience: [
    {
      position: "Investigadora Principal",
      institution: "Universidad Nacional Autónoma",
      period: "2015 - Presente",
    },
    {
      position: "Investigadora Asociada",
      institution: "Instituto de Neurociencias",
      period: "2010 - 2015",
    },
    {
      position: "Investigadora Postdoctoral",
      institution: "Universidad de California",
      period: "2008 - 2010",
    },
  ],
  projects: [
    {
      id: 1,
      title: "Patrones de actividad neuronal durante el sueño REM",
      description:
        "Análisis de la actividad cerebral durante las diferentes fases del sueño y su relación con la consolidación de la memoria.",
      date: "2020 - Presente",
      slug: "patrones-actividad-neuronal-sueno-rem",
    },
    {
      id: 2,
      title: "Efectos de la privación del sueño en la función cognitiva",
      description: "Estudio sobre cómo la falta de sueño afecta las capacidades cognitivas y el rendimiento mental.",
      date: "2018 - 2021",
      slug: "efectos-privacion-sueno-funcion-cognitiva",
    },
    {
      id: 3,
      title: "Biomarcadores neuronales para trastornos del sueño",
      description: "Identificación de marcadores biológicos para el diagnóstico temprano de trastornos del sueño.",
      date: "2016 - 2019",
      slug: "biomarcadores-neuronales-trastornos-sueno",
    },
  ],
  publications: [
    {
      id: 1,
      title: "Alteraciones en la arquitectura del sueño en pacientes con trastornos neurodegenerativos",
      journal: "Revista de Neurociencia Clínica",
      year: "2022",
      doi: "10.1234/rnc.2022.001",
    },
    {
      id: 2,
      title: "Correlatos neurales del procesamiento de la memoria durante el sueño REM",
      journal: "Journal of Sleep Research",
      year: "2020",
      doi: "10.1234/jsr.2020.002",
    },
    {
      id: 3,
      title: "Efectos de la privación crónica del sueño en la plasticidad sináptica",
      journal: "Neuroscience",
      year: "2019",
      doi: "10.1234/neuro.2019.003",
    },
    {
      id: 4,
      title: "Mecanismos neuronales del procesamiento de la memoria durante el sueño",
      journal: "Nature Neuroscience",
      year: "2017",
      doi: "10.1234/nn.2017.004",
    },
  ],
}

export default function ResearcherProfile({ params }: { params: { slug: string } }) {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar con información del perfil */}
        <div className="space-y-6">
          <Card className="bg-white border-blue-100">
            <CardContent className="pt-6 text-center">
              <Avatar className="h-32 w-32 mx-auto mb-4">
                <AvatarImage src={researcher.avatar || "/placeholder.svg"} alt={researcher.name} />
                <AvatarFallback>
                  {researcher.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <h1 className="text-2xl font-bold text-blue-900">{researcher.name}</h1>
              <p className="text-blue-600 mb-4">{researcher.title}</p>

              <div className="flex justify-center space-x-2 mb-4">
                <Button variant="outline" size="icon" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                  <Mail className="h-4 w-4" />
                  <span className="sr-only">Correo electrónico</span>
                </Button>
                <Button variant="outline" size="icon" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                  <Share2 className="h-4 w-4" />
                  <span className="sr-only">Compartir perfil</span>
                </Button>
                <Button variant="outline" size="icon" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                  <ExternalLink className="h-4 w-4" />
                  <span className="sr-only">Sitio web</span>
                </Button>
              </div>

              <Button className="w-full bg-blue-700 text-white hover:bg-blue-800">Contactar</Button>
            </CardContent>
          </Card>

          <Card className="bg-white border-blue-100">
            <CardHeader>
              <CardTitle className="text-lg text-blue-900">Información</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-2">
                <Building className="h-4 w-4 mt-0.5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Institución</p>
                  <p className="text-sm text-blue-600">{researcher.institution}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Ubicación</p>
                  <p className="text-sm text-blue-600">{researcher.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Correo electrónico</p>
                  <p className="text-sm text-blue-600">{researcher.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-blue-100">
            <CardHeader>
              <CardTitle className="text-lg text-blue-900">Áreas de especialización</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {researcher.expertise.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contenido principal */}
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-white border-blue-100">
            <CardHeader>
              <CardTitle className="text-blue-900">Biografía</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-600">{researcher.bio}</p>
            </CardContent>
          </Card>

          <Tabs defaultValue="projects" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-blue-50">
              <TabsTrigger
                value="projects"
                className="text-blue-700 data-[state=active]:bg-white data-[state=active]:text-blue-900"
              >
                Proyectos
              </TabsTrigger>
              <TabsTrigger
                value="publications"
                className="text-blue-700 data-[state=active]:bg-white data-[state=active]:text-blue-900"
              >
                Publicaciones
              </TabsTrigger>
              <TabsTrigger
                value="experience"
                className="text-blue-700 data-[state=active]:bg-white data-[state=active]:text-blue-900"
              >
                Experiencia
              </TabsTrigger>
            </TabsList>

            <TabsContent value="projects" className="space-y-4 mt-6">
              {researcher.projects.map((project) => (
                <Card key={project.id} className="bg-white border-blue-100">
                  <CardContent className="pt-6">
                    <Link href={`/proyectos/${project.slug}`} className="hover:underline">
                      <h3 className="text-lg font-semibold mb-2 text-blue-900">{project.title}</h3>
                    </Link>
                    <p className="text-sm text-blue-600 mb-4">{project.description}</p>
                    <div className="flex items-center text-sm text-blue-600">
                      <span>{project.date}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="publications" className="space-y-4 mt-6">
              {researcher.publications.map((publication) => (
                <Card key={publication.id} className="bg-white border-blue-100">
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-2 text-blue-900">{publication.title}</h3>
                    <div className="flex flex-col space-y-1 text-sm text-blue-600">
                      <p>
                        {publication.journal}, {publication.year}
                      </p>
                      <p className="flex items-center">
                        <FileText className="h-3.5 w-3.5 mr-1" />
                        DOI: {publication.doi}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="experience" className="space-y-6 mt-6">
              <Card className="bg-white border-blue-100">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-900">Experiencia profesional</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {researcher.experience.map((exp, index) => (
                    <div key={index} className="border-b last:border-0 pb-4 last:pb-0 border-blue-100">
                      <div className="flex items-start gap-2">
                        <Briefcase className="h-4 w-4 mt-1 text-blue-500" />
                        <div>
                          <p className="font-medium text-blue-900">{exp.position}</p>
                          <p className="text-sm text-blue-600">{exp.institution}</p>
                          <p className="text-sm text-blue-600">{exp.period}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-white border-blue-100">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-900">Formación académica</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {researcher.education.map((edu, index) => (
                    <div key={index} className="border-b last:border-0 pb-4 last:pb-0 border-blue-100">
                      <div className="flex items-start gap-2">
                        <GraduationCap className="h-4 w-4 mt-1 text-blue-500" />
                        <div>
                          <p className="font-medium text-blue-900">{edu.degree}</p>
                          <p className="text-sm text-blue-600">{edu.institution}</p>
                          <p className="text-sm text-blue-600">{edu.year}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
