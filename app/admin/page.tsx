import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BarChart3, FileText, GraduationCap, Home, LayoutDashboard, Settings, Users } from "lucide-react"

export default function AdminDashboard() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Panel de Administración</h1>
          <p className="text-blue-600 mt-1">Gestiona la plataforma SECCTI y sus usuarios</p>
        </div>
        <Button asChild className="bg-blue-700 text-white hover:bg-blue-800">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Volver al inicio
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white border-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-blue-900">Investigadores</CardTitle>
            <CardDescription className="text-blue-600">Total de investigadores registrados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">124</div>
            <p className="text-sm text-green-600 mt-2">+12% desde el mes pasado</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-blue-900">Proyectos</CardTitle>
            <CardDescription className="text-blue-600">Total de proyectos publicados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">87</div>
            <p className="text-sm text-green-600 mt-2">+8% desde el mes pasado</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-blue-900">Instituciones</CardTitle>
            <CardDescription className="text-blue-600">Total de instituciones registradas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">18</div>
            <p className="text-sm text-green-600 mt-2">+2 nuevas este mes</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="bg-white border-blue-100">
            <CardHeader>
              <CardTitle className="text-blue-900">Módulos de administración</CardTitle>
              <CardDescription className="text-blue-600">Accede a las diferentes secciones del panel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start text-blue-700 hover:bg-blue-50" asChild>
                  <Link href="/admin/dashboard">
                    <LayoutDashboard className="mr-2 h-5 w-5" />
                    Dashboard
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start text-blue-700 hover:bg-blue-50" asChild>
                  <Link href="/admin/investigadores">
                    <Users className="mr-2 h-5 w-5" />
                    Investigadores
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start text-blue-700 hover:bg-blue-50" asChild>
                  <Link href="/admin/proyectos">
                    <FileText className="mr-2 h-5 w-5" />
                    Proyectos
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start text-blue-700 hover:bg-blue-50" asChild>
                  <Link href="/admin/instituciones">
                    <GraduationCap className="mr-2 h-5 w-5" />
                    Instituciones
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start text-blue-700 hover:bg-blue-50" asChild>
                  <Link href="/admin/estadisticas">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Estadísticas
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start text-blue-700 hover:bg-blue-50" asChild>
                  <Link href="/admin/configuracion">
                    <Settings className="mr-2 h-5 w-5" />
                    Configuración
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="bg-white border-blue-100">
            <CardHeader>
              <CardTitle className="text-blue-900">Actividad reciente</CardTitle>
              <CardDescription className="text-blue-600">Últimas acciones en la plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    action: "Nuevo investigador registrado",
                    user: "Dr. Roberto Sánchez",
                    time: "Hace 2 horas",
                  },
                  {
                    action: "Proyecto actualizado",
                    user: "Dra. María Rodríguez",
                    time: "Hace 5 horas",
                  },
                  {
                    action: "Nueva institución añadida",
                    user: "Admin",
                    time: "Hace 1 día",
                  },
                  {
                    action: "Perfil actualizado",
                    user: "Dr. Carlos Méndez",
                    time: "Hace 2 días",
                  },
                  {
                    action: "Nuevo proyecto publicado",
                    user: "Dra. Ana Martínez",
                    time: "Hace 3 días",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center border-b border-blue-100 pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium text-blue-900">{item.action}</p>
                      <p className="text-sm text-blue-600">Por: {item.user}</p>
                    </div>
                    <span className="text-xs text-blue-600">{item.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
