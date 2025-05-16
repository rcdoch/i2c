"use client"

import React from "react"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { Menu } from "lucide-react"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="border-b border-blue-100">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-10 w-10">
              <Image
                src="/images/sei-logo.png"
                alt="Sistema Estatal de Investigadores Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-bold text-lg text-gray-800 hidden sm:inline">Sistema Estatal de Investigadores</span>
            <span className="font-bold text-lg text-gray-800 sm:hidden">SEI</span>
          </Link>

          <NavigationMenu className="hidden md:flex ml-4">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-blue-700">Explorar</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-2 bg-white">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-gray-50 to-gray-100 p-6 no-underline outline-none focus:shadow-md"
                          href="/investigadores"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium text-blue-900">Investigadores</div>
                          <p className="text-sm leading-tight text-blue-600">
                            Explora perfiles de investigadores destacados en diferentes campos.
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <ListItem href="/proyectos" title="Proyectos">
                      Descubre los últimos proyectos de investigación.
                    </ListItem>
                    <ListItem href="/instituciones" title="Instituciones">
                      Explora por universidades y centros de investigación.
                    </ListItem>
                    <ListItem href="/campos" title="Campos de estudio">
                      Navega por diferentes áreas de conocimiento.
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/proyectos" legacyBehavior passHref>
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "text-blue-700")}>
                    Proyectos
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/publicaciones" legacyBehavior passHref>
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "text-blue-700")}>
                    Publicaciones
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-4">
          <Button className="hidden md:flex bg-blue-700 text-white hover:bg-blue-800 px-3 py-1 h-9" asChild>
            <a href="https://i2c.com.mx/" target="_blank" rel="noopener noreferrer" className="flex items-center">
              <div className="flex items-baseline">
                <span className="text-lg font-bold tracking-tight">I</span>
                <span className="text-xs font-bold relative top-[-5px]">2</span>
                <span className="text-lg font-bold tracking-tight">C</span>
              </div>
            </a>
          </Button>
          <div className="hidden md:flex gap-2">
            <Button variant="ghost" asChild className="text-blue-700 hover:bg-blue-50">
              <Link href="/iniciar-sesion">Iniciar sesión</Link>
            </Button>
            <Button asChild className="bg-blue-700 text-white hover:bg-blue-800">
              <Link href="/registro">Registrarse</Link>
            </Button>
          </div>

          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-blue-700 hover:bg-blue-50">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-white text-blue-900 border-blue-100">
              <div className="flex flex-col gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <div className="relative h-8 w-8">
                    <Image
                      src="/images/sei-logo.png"
                      alt="Sistema Estatal de Investigadores Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="font-bold text-lg">Sistema Estatal de Investigadores</span>
                </div>
                <div className="flex flex-col gap-2">
                  <Button variant="ghost" className="justify-start text-blue-700 hover:bg-blue-50" asChild>
                    <Link href="/explorar">Explorar</Link>
                  </Button>
                  <Button variant="ghost" className="justify-start text-blue-700 hover:bg-blue-50" asChild>
                    <Link href="/proyectos">Proyectos</Link>
                  </Button>
                  <Button variant="ghost" className="justify-start text-blue-700 hover:bg-blue-50" asChild>
                    <Link href="/publicaciones">Publicaciones</Link>
                  </Button>
                  <Button className="justify-start bg-blue-700 text-white hover:bg-blue-800" asChild>
                    <a
                      href="https://i2c.com.mx/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      <div className="flex items-baseline">
                        <span className="text-lg font-bold tracking-tight">I</span>
                        <span className="text-xs font-bold relative top-[-5px]">2</span>
                        <span className="text-lg font-bold tracking-tight">C</span>
                      </div>
                    </a>
                  </Button>
                  <Button variant="ghost" className="justify-start text-blue-700 hover:bg-blue-50" asChild>
                    <Link href="/iniciar-sesion">Iniciar sesión</Link>
                  </Button>
                  <Button className="mt-2 bg-blue-700 text-white hover:bg-blue-800" asChild>
                    <Link href="/registro">Registrarse</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-blue-50 text-blue-900",
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-blue-600">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  },
)
ListItem.displayName = "ListItem"
