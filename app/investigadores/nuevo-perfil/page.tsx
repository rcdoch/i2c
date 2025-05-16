import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Info, Edit, Plus, FileText, GraduationCap, Briefcase } from "lucide-react"
import Link from "next/link"

export default function NuevoPerfilPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Alert className="mb-6 bg-blue-50 border-blue-200 text-blue-900">
        <Info className="h-4 w-4" />
        <AlertTitle>Perfil nuevo</AlertTitle>
        <AlertDescription>
          Tu perfil ha sido creado pero está incompleto. Completa la información para que otros investigadores puedan
          conocer tu trabajo.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar con información del perfil */}
        <div className="space-y-6">
          <Card className="bg-white border-blue-100">
            <CardContent className="pt-6 text-center">
              <Avatar className="h-32 w-32 mx-auto mb-4">
                <AvatarFallback className="bg-blue-100 text-blue-700">CM</AvatarFallback>
              </Avatar>
              <h1 className="text-2xl font-bold text-blue-900">Carlos Méndez López</h1>
              <p className="text-blue-600 mb-4">Investigador</p>

              <Button className="w-full bg-blue-700 text-white hover:bg-blue-800" asChild>
                <Link href="#">
                  <Edit className="mr-2 h-4 w-4" />
                  Editar perfil
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white border-blue-100">
            <CardHeader>
              <CardTitle className="text-lg text-blue-900">Información</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-blue-600">Institución</p>
                <Button variant="ghost" size="sm" className="h-8 text-blue-700 hover:bg-blue-50">
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Añadir</span>
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-blue-600">Ubicación</p>
                <Button variant="ghost" size="sm" className="h-8 text-blue-700 hover:bg-blue-50">
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Añadir</span>
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-blue-600">Correo electrónico</p>
                <Button variant="ghost" size="sm" className="h-8 text-blue-700 hover:bg-blue-50">
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Añadir</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-blue-100">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg text-blue-900">Áreas de especialización</CardTitle>
              <Button variant="ghost" size="sm" className="h-8 text-blue-700 hover:bg-blue-50">
                <Plus className="h-4 w-4" />
                <span className="sr-only">Añadir</span>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                  Inteligencia Artificial
                </Badge>
                <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                  Robótica
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contenido principal */}
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-white border-blue-100">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-blue-900">Biografía</CardTitle>
              <Button variant="ghost" size="sm" className="h-8 text-blue-700 hover:bg-blue-50">
                <Edit className="h-4 w-4" />
                <span className="sr-only">Editar</span>
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-blue-600 italic">
                Añade una biografía para que otros investigadores conozcan tu trayectoria...
              </p>
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

            <TabsContent value="projects" className="mt-6">
              <Card className="bg-white border-blue-100">
                <CardContent className="pt-6 text-center py-12">
                  <FileText className="h-12 w-12 mx-auto text-blue-300 mb-4" />
                  <h3 className="text-lg font-semibold mb-2 text-blue-900">No hay proyectos aún</h3>
                  <p className="text-sm text-blue-600 mb-6">
                    Añade tus proyectos de investigación para compartirlos con la comunidad
                  </p>
                  <Button className="bg-blue-700 text-white hover:bg-blue-800">
                    <Plus className="mr-2 h-4 w-4" />
                    Añadir proyecto
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="publications" className="mt-6">
              <Card className="bg-white border-blue-100">
                <CardContent className="pt-6 text-center py-12">
                  <FileText className="h-12 w-12 mx-auto text-blue-300 mb-4" />
                  <h3 className="text-lg font-semibold mb-2 text-blue-900">No hay publicaciones aún</h3>
                  <p className="text-sm text-blue-600 mb-6">Añade tus artículos y publicaciones académicas</p>
                  <Button className="bg-blue-700 text-white hover:bg-blue-800">
                    <Plus className="mr-2 h-4 w-4" />
                    Añadir publicación
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="experience" className="space-y-6 mt-6">
              <Card className="bg-white border-blue-100">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg text-blue-900">Experiencia profesional</CardTitle>
                  <Button variant="ghost" size="sm" className="h-8 text-blue-700 hover:bg-blue-50">
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Añadir</span>
                  </Button>
                </CardHeader>
                <CardContent className="text-center py-8">
                  <Briefcase className="h-12 w-12 mx-auto text-blue-300 mb-4" />
                  <p className="text-sm text-blue-600">No hay experiencia profesional registrada</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-blue-100">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg text-blue-900">Formación académica</CardTitle>
                  <Button variant="ghost" size="sm" className="h-8 text-blue-700 hover:bg-blue-50">
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Añadir</span>
                  </Button>
                </CardHeader>
                <CardContent className="text-center py-8">
                  <GraduationCap className="h-12 w-12 mx-auto text-blue-300 mb-4" />
                  <p className="text-sm text-blue-600">No hay formación académica registrada</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
