"use client"

import { useState, useEffect } from "react"
import { PlatformManager } from "@/components/platform-manager"
import { AuthScreen } from "@/components/auth-screen"

export default function Home() {
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem("currentUser")
    if (user) {
      setCurrentUser(user)
    }
    setIsLoading(false)
  }, [])

  const handleLogin = (username: string) => {
    setCurrentUser(username)
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    setCurrentUser(null)
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-muted-foreground">Cargando...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {currentUser ? (
        <PlatformManager currentUser={currentUser} onLogout={handleLogout} />
      ) : (
        <AuthScreen onLogin={handleLogin} />
      )}
    </main>
  )
}
