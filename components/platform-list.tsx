"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Eye, EyeOff, ExternalLink, Copy, Check, Loader2, Edit, Download, X, Search } from "lucide-react"
import type { PlatformCredential } from "@/types/platform"
import { Input } from "./ui/input"
import { DeleteConfirmationDialog } from "./ui/delete-confirmation-dialog"

interface PlatformListProps {
  platforms: PlatformCredential[]
  onDelete: (id: string) => void
  onUpdate: (platform: PlatformCredential) => void
  onFindByName: (name: string) => Promise<PlatformCredential>
  exportToExcel: () => Promise<void>
  exportToPdf: () => Promise<void>
  loading?: boolean

  currentPage: number
  totalPages: number
  totalElements: number
  onPageChange: (newPage: number) => void
}

export function PlatformList({ platforms, onDelete, onUpdate, onFindByName, exportToExcel, exportToPdf, loading = false, currentPage, totalPages, totalElements, onPageChange }: PlatformListProps) {
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set())
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [searching, setSearching] = useState(false)
  const [searchResult, setSearchResult] = useState<PlatformCredential | null>(null)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [platformToDelete, setPlatformToDelete] = useState<{ id: string; name: string } | null>(null)

  const togglePasswordVisibility = (id: string) => {
    const newVisible = new Set(visiblePasswords)
    if (newVisible.has(id)) {
      newVisible.delete(id)
    } else {
      newVisible.add(id)
    }
    setVisiblePasswords(newVisible)
  }

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00Z')
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC"
    })
  }

  /*
  const formatSearchTerm = (term: string, strategy: 'capitalize' | 'uppercase' | 'lowercase' | 'original' = 'capitalize'): string => {
    const trimmed = term.trim()
    
    switch (strategy) {
      case 'capitalize':
        // Primera letra mayúscula, resto minúsculas: "Netflix"
        return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase()
      
      case 'uppercase':
        // Todo mayúsculas: "NETFLIX"
        return trimmed.toUpperCase()
      
      case 'lowercase':
        // Todo minúsculas: "netflix"
        return trimmed.toLowerCase()
      
      case 'original':
        // Sin cambios: mantiene lo que escribió el usuario
        return trimmed
      
      default:
        return trimmed
    }
  }
*/
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchError("Por favor ingresa un nombre de plataforma")
      return
    }

    setSearching(true)
    setSearchError(null)

    try {

      const result = await onFindByName(searchTerm.trim())
      setSearchResult(result)
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : "No se encontró la plataforma")
      setSearchResult(null)
    } finally {
      setSearching(false)
    }
  }

  const handleClearSearch = () => {
    setSearchTerm("")
    setSearchResult(null)
    setSearchError(null)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleDeleteClick = (platform: PlatformCredential) => {
    setPlatformToDelete({id: platform.id, name: platform.name})
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if(platformToDelete){
      onDelete(platformToDelete.id)
      setDeleteDialogOpen(false)
      setPlatformToDelete(null)
    }
  }

  const platformsToDisplay = searchResult ? [searchResult] : platforms

  //skeleton mientras carga
  if (loading) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-foreground">Plataformas Registradas</h2>
          <p className="text-sm text-muted-foreground">Cargando plataformas...</p>
        </div>

        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Cargando tus plataformas...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-foreground">Plataformas Registradas</h2>
        <p className="text-sm text-muted-foreground">
          {platforms.length === 0
            ? "No hay plataformas registradas"
            : `${totalElements} plataforma${totalElements !== 1 ? "s" : ""} registrada${totalElements !== 1 ? "s" : ""}`}
        </p>
      </div>
      {/* Barra de búsqueda y botones de exportación */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex-1 max-w-md">
          {/*<label className="mb-2 block text-sm font-medium text-foreground">Buscar Plataforma</label>*/}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Ejm: GitHub, AWS, Google Cloud"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pr-10"
                disabled={searching}
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSearch}
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Button
              onClick={handleSearch}
              disabled={searching || !searchTerm.trim()}
              className="gap-2"
            >
              {searching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              Buscar
            </Button>
          </div>
          {searchError && (
            <p className="mt-2 text-sm text-destructive">{searchError}</p>
          )}
          {/*}
          {searchResult && (
            <p className="mt-2 text-sm text-muted-foreground">
              Mostrando resultado para: <span className="font-medium text-foreground">{searchTerm}</span>
            </p>
          )}
            */}
        </div>
        <div className="flex gap-2">
          <Button className="gap-2 bg-red-500 hover:bg-red-700 text-white" onClick={exportToPdf}>
            <Download className="h-5 w-5" />
            PDF
          </Button>
          <Button className="gap-2 bg-green-500 hover:bg-green-700 text-white" onClick={exportToExcel}>
            <Download className="h-5 w-5" />
            Excel
          </Button>
        </div>
      </div>

      {platformsToDisplay.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground">No hay plataformas registradas</p>
              <p className="mt-1 text-sm text-muted-foreground">Haz clic en "Agregar Plataforma" para comenzar</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-4">
          {platformsToDisplay.map((platform) => (
            <Card key={platform.id} className="border-border transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{platform.name}</CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {formatDate(platform.createdDate)}
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-1">
                  <a
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-primary hover:underline"
                  >
                    <span className="truncate">{platform.url}</span>
                    <ExternalLink className="h-3 w-3 flex-shrink-0" />
                  </a>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Username */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2">
                    <div className="min-w-0 flex-1">
                      <span className="text-xs text-muted-foreground">Usuario</span>
                      <p className="truncate font-mono text-sm text-card-foreground">{platform.username}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(platform.username, `user-${platform.id}`)}
                      className="ml-2 flex-shrink-0"
                    >
                      {copiedId === `user-${platform.id}` ? (
                        <Check className="h-4 w-4 text-primary" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2">
                    <div className="min-w-0 flex-1">
                      <span className="text-xs text-muted-foreground">Contraseña</span>
                      <p className="truncate font-mono text-sm text-card-foreground">
                        {visiblePasswords.has(platform.id) ? platform.password : "••••••••••••"}
                      </p>
                    </div>
                    <div className="ml-2 flex flex-shrink-0 gap-1">
                      <Button variant="ghost" size="sm" onClick={() => togglePasswordVisibility(platform.id)}>
                        {visiblePasswords.has(platform.id) ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(platform.password, `pass-${platform.id}`)}
                      >
                        {copiedId === `pass-${platform.id}` ? (
                          <Check className="h-4 w-4 text-primary" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                <CardFooter className="flex w-full items-center">
                  <div className="mx-auto flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onUpdate(platform)}
                      className="text-primary hover:bg-primary/10 hover:text-primary"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                     /* onClick={() => onDelete(platform.id)}*/
                     onClick={ () => handleDeleteClick(platform)}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Eliminar
                    </Button>
                  </div>
                </CardFooter>
              </CardContent>
            </Card>
          ))}
        </div>
      )}


      {/* Paginación */}
      {!searchResult && totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
          <div className="text-sm text-muted-foreground">
            Mostrando {platforms.length > 0 ? (currentPage * 9) + 1 : 0} - {Math.min((currentPage + 1) * 9, totalElements)} de {totalElements} plataformas
          </div>

          <div className="flex items-center gap-2">
            {/* Botón Anterior */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="gap-2"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Anterior
            </Button>

            {/* Números de página */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => {
                // Mostrar solo algunas páginas alrededor de la página actual
                if (
                  i === 0 || // Primera página
                  i === totalPages - 1 || // Última página
                  (i >= currentPage - 1 && i <= currentPage + 1) // Páginas cercanas
                ) {
                  return (
                    <Button
                      key={i}
                      variant={currentPage === i ? "default" : "outline"}
                      size="sm"
                      onClick={() => onPageChange(i)}
                      className="min-w-[40px]"
                    >
                      {i + 1}
                    </Button>
                  )
                } else if (
                  i === currentPage - 2 ||
                  i === currentPage + 2
                ) {
                  return <span key={i} className="px-2 text-muted-foreground">...</span>
                }
                return null
              })}
            </div>

            {/* Botón Siguiente */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              className="gap-2"
            >
              Siguiente
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        platformName={platformToDelete?.name || ""}
      />

    </div>
  )
}