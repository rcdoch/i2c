import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarIcon, Users } from "lucide-react"

// Datos de ejemplo para proyectos recientes
const recentProjects = [
  {
    id: 1,
    title: "Impacto del cambio climático en ecosistemas del desierto de Chihuahua",
    description: "Estudio sobre los efectos del cambio climático en la biodiversidad del desierto chihuahuense.",
    researcher: {
      name: "Dra. Ana Martínez",
      avatar: "/placeholder.svg?height=100&width=100",
      slug: "ana-martinez",
    },
    date: "Mayo 2023",
    category: "Ecología",
    collaborators: 4,
    slug: "impacto-cambio-climatico-ecosistemas-desierto-chihuahua",
  },
  {
    id: 2,
    title: "Desarrollo de algoritmos de aprendizaje profundo para la industria manufacturera local",
    description: "Implementación de redes neuronales para optimizar procesos en la industria de Chihuahua.",
    researcher: {
      name: "Dr. Carlos Méndez",
      avatar: "/placeholder.svg?height=100&width=100",
      slug: "carlos-mendez",
    },
    date: "Abril 2023",
    category: "Inteligencia Artificial",
    collaborators: 3,
    slug: "algoritmos-aprendizaje-profundo-industria-manufacturera",
  },
  {
    id: 3,
    title: "Innovación en sistemas de riego para agricultura en zonas áridas",
    description: "Desarrollo de tecnologías eficientes para el uso del agua en la agricultura de Chihuahua.",
    researcher: {
      name: "Dr. Javier López",
      avatar: "/placeholder.svg?height=100&width=100",
      slug: "javier-lopez",
    },
    date: "Junio 2023",
    category: "Agricultura",
    collaborators: 5,
    slug: "innovacion-sistemas-riego-agricultura-zonas-aridas",
  },
]

export function RecentProjects() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {recentProjects.map((project) => (
        <Link href={`/proyectos/${project.slug}`} key={project.id}>
          <Card className="h-full hover:shadow-md transition-shadow bg-white border-blue-100">
            <CardContent className="pt-6">
              <Badge className="mb-3 bg-blue-700 text-white hover:bg-blue-800">{project.category}</Badge>
              <h3 className="font-bold text-lg mb-2 line-clamp-2 text-blue-900">{project.title}</h3>
              <p className="text-blue-600 text-sm mb-4 line-clamp-3">{project.description}</p>

              <div className="flex items-center gap-2 mt-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={project.researcher.avatar || "/placeholder.svg"} alt={project.researcher.name} />
                  <AvatarFallback className="bg-blue-100 text-blue-700">
                    {project.researcher.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-blue-900">{project.researcher.name}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-blue-100 flex justify-between py-3">
              <div className="flex items-center gap-1 text-xs text-blue-600">
                <CalendarIcon className="h-3 w-3" />
                <span>{project.date}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-blue-600">
                <Users className="h-3 w-3" />
                <span>{project.collaborators} colaboradores</span>
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}
