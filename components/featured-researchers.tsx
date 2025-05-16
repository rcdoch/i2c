import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

// Datos de ejemplo para investigadores destacados
const featuredResearchers = [
  {
    id: 1,
    name: "Dra. María Rodríguez",
    avatar: "/placeholder.svg?height=100&width=100",
    institution: "Universidad Autónoma de Chihuahua",
    field: "Neurociencia",
    projects: 12,
    publications: 45,
    slug: "maria-rodriguez",
  },
  {
    id: 2,
    name: "Dr. Carlos Méndez",
    avatar: "/placeholder.svg?height=100&width=100",
    institution: "Instituto Tecnológico de Chihuahua",
    field: "Inteligencia Artificial",
    projects: 8,
    publications: 32,
    slug: "carlos-mendez",
  },
  {
    id: 3,
    name: "Dra. Ana Martínez",
    avatar: "/placeholder.svg?height=100&width=100",
    institution: "Centro de Investigación en Materiales Avanzados",
    field: "Cambio Climático",
    projects: 15,
    publications: 38,
    slug: "ana-martinez",
  },
  {
    id: 4,
    name: "Dr. Javier López",
    avatar: "/placeholder.svg?height=100&width=100",
    institution: "Universidad Tecnológica de Ciudad Juárez",
    field: "Robótica",
    projects: 10,
    publications: 27,
    slug: "javier-lopez",
  },
]

export function FeaturedResearchers() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {featuredResearchers.map((researcher) => (
        <Link href={`/investigadores/${researcher.slug}`} key={researcher.id}>
          <Card className="h-full hover:shadow-md transition-shadow bg-white border-blue-100">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={researcher.avatar || "/placeholder.svg"} alt={researcher.name} />
                  <AvatarFallback className="bg-blue-100 text-blue-700">
                    {researcher.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-bold text-blue-900">{researcher.name}</h3>
                <p className="text-blue-600 text-sm mb-2">{researcher.institution}</p>
                <Badge variant="secondary" className="mb-4 bg-blue-50 text-blue-700">
                  {researcher.field}
                </Badge>
              </div>
            </CardContent>
            <CardFooter className="border-t border-blue-100 flex justify-around py-3">
              <div className="text-center">
                <p className="font-bold text-blue-900">{researcher.projects}</p>
                <p className="text-xs text-blue-600">Proyectos</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-blue-900">{researcher.publications}</p>
                <p className="text-xs text-blue-600">Publicaciones</p>
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}
