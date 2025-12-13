"use client"

import { useState } from "react"
import { PlatformForm } from "./platform-form"
import { PlatformList } from "./platform-list"
import { Lock, Plus, X, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePlatforms } from "@/hooks/usePlatforms"
import { authService } from "@/services/auth.service"
import type { PlatformCredentialDTO, PlatformCredential } from "@/types/platform"
import { platform } from "os"

interface PlatformManagerProps {
  currentUser: string
  onLogout: () => void
}

export function PlatformManager({ currentUser, onLogout }: PlatformManagerProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPlatform, setEditingPlatform] = useState<PlatformCredential | null>(null)
  
  
  // Usar el hook personalizado para manejar las plataformas
  const {
    platforms,
    loading,
    error,
    createPlatform,
    deletePlatform,
    updatePlatform,
    findByName,
    refetch
  } = usePlatforms()

  const handleAddPlatform = async (platform: Omit<PlatformCredential, "id" | "createdDate">) => {
    try {
      const newPlatformDTO: PlatformCredentialDTO = {
        name: platform.name,
        url: platform.url,
        username: platform.username,
        password: platform.password,
      }
      
      await createPlatform(newPlatformDTO)
      setIsFormOpen(false)
    } catch (err) {
      console.error("Error al agregar plataforma:", err)
      alert(err instanceof Error ? err.message : "Error al agregar la plataforma")
    }
  }

  const handleDeletePlatform = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta plataforma?")) {
      return
    }

    try {
      await deletePlatform(id)
    } catch (err) {
      console.error("Error al eliminar plataforma:", err)
      alert(err instanceof Error ? err.message : "Error al eliminar la plataforma")
    }
  }

  const handleEditClick = (platform: PlatformCredential) => {
    console.log("Abriendo formulario para editar: ", platform)
    setEditingPlatform(platform)
    setIsFormOpen(true)
  }

  const handleUpdatePlatform = async (updatedData: Omit<PlatformCredential, "id" | "createdDate">) => {
    
    if(!editingPlatform) return

    try {
      const platformDTO: PlatformCredentialDTO = {
        name: updatedData.name,
        url: updatedData.url,
        username: updatedData.username,
        password: updatedData.password,
      }
      
      await updatePlatform(editingPlatform.id, platformDTO)
      console.log("Plataforma actualizada: ", updatedData)
      setIsFormOpen(false)
      setEditingPlatform(null)
    } catch (err) {
      console.error("Error al actualizar plataforma:", err)
      alert(err instanceof Error ? err.message : "Error al actualizar la plataforma")
    }
  }

  const handleFormSubmit = async (platform: Omit<PlatformCredential, "id" | "createdDate">) => {
    if (editingPlatform) {
      await handleUpdatePlatform(platform)
    } else {
      await handleAddPlatform(platform)
    }
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingPlatform(null)
  }

  const handleOpenNewForm = () => {
    setEditingPlatform(null)
    setIsFormOpen(true)
  }

  const handleLogout = () => {
    authService.logout()
    onLogout()
  }

  const handleFindByName = async (name: string): Promise<PlatformCredential> => {
    return await findByName(name)
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Lock className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Gestor de Credenciales</h1>
                <p className="text-sm text-muted-foreground">Bienvenido, {currentUser}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleLogout} className="gap-2 bg-transparent">
                <LogOut className="h-4 w-4" />
                Cerrar Sesión
              </Button>
              <Button onClick={handleOpenNewForm} className="gap-2">
                <Plus className="h-5 w-5" />
                Agregar Plataforma
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 rounded-lg bg-destructive/10 p-4 text-destructive">
            {error}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refetch()} 
              className="ml-4"
            >
              Reintentar
            </Button>
          </div>
        )}
        
        <PlatformList 
          platforms={platforms} 
          onDelete={handleDeletePlatform} 
          onUpdate={handleEditClick}
          onFindByName={handleFindByName}
          loading={loading}
        />
      </div>

      {isFormOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={handleCloseForm}
          />

          {/* Side Panel */}
          <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-border bg-background shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex h-full flex-col">
              {/* Panel Header */}
              <div className="flex items-center justify-between border-b border-border p-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">{editingPlatform ? "Editar Plataforma" : "Nueva Plataforma"}</h2>
                  <p className="text-sm text-muted-foreground">{editingPlatform ? "Modifica los datos de la plataforma" : "Registra una nueva credencial"}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={handleCloseForm} className="h-8 w-8">
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Panel Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <PlatformForm 
                onSubmit={handleFormSubmit} 
                initialData={editingPlatform}
                isEditing={!!editingPlatform}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}