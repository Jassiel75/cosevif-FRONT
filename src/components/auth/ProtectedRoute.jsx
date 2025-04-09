"use client"

import { useEffect, useState } from "react"
import { Navigate, useLocation } from "react-router-dom"
import UnauthorizedAccess from "./UnauthorizedAccess"

/**
 * Componente para proteger rutas según el rol del usuario
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Componentes hijos a renderizar si el usuario está autorizado
 * @param {string[]} props.allowedRoles - Roles permitidos para acceder a esta ruta
 * @param {boolean} props.requireAuth - Si se requiere autenticación para esta ruta
 */
function ProtectedRoute({ children, allowedRoles = [], requireAuth = true }) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [userRole, setUserRole] = useState(null)
  const location = useLocation()

  useEffect(() => {
    // Verificar autenticación y autorización
    const checkAuth = () => {
      const token = localStorage.getItem("token")
      const role = localStorage.getItem("role")

      // Si no se requiere autenticación, permitir acceso
      if (!requireAuth) {
        setIsAuthorized(true)
        setIsLoading(false)
        return
      }

      // Si no hay token, no está autenticado
      if (!token) {
        setIsAuthorized(false)
        setIsLoading(false)
        return
      }

      // Guardar el rol del usuario para mostrarlo en caso de error
      setUserRole(role)

      // Si no se especifican roles permitidos, cualquier usuario autenticado puede acceder
      if (allowedRoles.length === 0) {
        setIsAuthorized(true)
        setIsLoading(false)
        return
      }

      // Verificar si el rol del usuario está en la lista de roles permitidos
      const hasPermission = allowedRoles.includes(role)
      console.log(`Verificando acceso: Rol ${role}, Ruta ${location.pathname}, Permitido: ${hasPermission}`)
      setIsAuthorized(hasPermission)
      setIsLoading(false)
    }

    checkAuth()
  }, [allowedRoles, requireAuth, location.pathname])

  // Mientras se verifica la autenticación, mostrar un indicador de carga
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    )
  }

  // Si no está autenticado, redirigir al login
  if (requireAuth && !localStorage.getItem("token")) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  // Si está autenticado pero no autorizado, mostrar mensaje de error
  if (!isAuthorized) {
    return <UnauthorizedAccess userRole={userRole} />
  }

  // Si está autorizado, renderizar los componentes hijos
  return children
}

export default ProtectedRoute
