"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Save } from "lucide-react"
import { PlatformCredential } from "@/types/platform"

interface PlatformFormProps {
  onSubmit: (platform: {
    name: string
    url: string
    username: string
    password: string
  }) => void
  initialData?: PlatformCredential | null
  isEditing?: boolean
}

export function PlatformForm({ onSubmit, initialData = null, isEditing = false }: PlatformFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    username: "",
    password: "",
  })

  //para cargar datos iniciales para editar 
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        url: initialData.url,
        username: initialData.username,
        password: initialData.password,
      })
    } else {
      setFormData({
        name: "",
        url: "",
        username: "",
        password: "",
      })
    }
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.url || !formData.username || !formData.password) {
      return
    }
    onSubmit(formData)
    setFormData({ name: "", url: "", username: "", password: "" })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre de la Plataforma</Label>
        <Input
          id="name"
          name="name"
          placeholder="Ejm: GitHub, AWS, Google Cloud"
          value={formData.name}
          onChange={handleChange}
          required
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="url">URL</Label>
        <Input
          id="url"
          name="url"
          type="url"
          placeholder="https://ejemplo.com"
          value={formData.url}
          onChange={handleChange}
          required
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">Usuario</Label>
        <Input
          id="username"
          name="username"
          placeholder="usuario@ejemplo.com"
          value={formData.username}
          onChange={handleChange}
          required
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          required
          className="h-11"
        />
      </div>

      <Button type="submit" className="w-full h-11" size="lg">
        {
          isEditing ? (
            <>
              <Save className="mr-2 h-5 w-5" />
              Guardar Cambios
            </>
          ) : (
            <>
              <Plus className="mr-2 h-5 w-5" />
              Agregar Plataforma
            </>
          )}
      </Button>
    </form>
  )
}
