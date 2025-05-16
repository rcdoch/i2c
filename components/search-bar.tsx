"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState("all")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica de búsqueda
    console.log("Buscando:", searchQuery, "Tipo:", searchType)
  }

  return (
    <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Buscar investigadores, proyectos, instituciones..."
            className="bg-white border-blue-200 text-blue-900 placeholder:text-blue-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={searchType} onValueChange={setSearchType}>
          <SelectTrigger className="w-full md:w-[180px] bg-white border-blue-200 text-blue-900">
            <SelectValue placeholder="Filtrar por" />
          </SelectTrigger>
          <SelectContent className="bg-white border-blue-100 text-blue-900">
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="researchers">Investigadores</SelectItem>
            <SelectItem value="projects">Proyectos</SelectItem>
            <SelectItem value="publications">Publicaciones</SelectItem>
            <SelectItem value="institutions">Instituciones</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" className="bg-blue-700 text-white hover:bg-blue-800">
          Buscar
        </Button>
      </div>
    </form>
  )
}
