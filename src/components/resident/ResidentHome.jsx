"use client"

import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import ResidentLayout from "./ResidentLayout"
import ResidentVisitsDashboard from "./ResidentVisitsDashboard"
import ResidentWorkersDashboard from "./ResidentWorkersDashboard"
import axios from "axios"
import { API_URL } from "../../auth/IP"

function ResidentHome() {
  const [activeView, setActiveView] = useState("visits") // "visits" o "workers"
  const [showVisitForm, setShowVisitForm] = useState(false)
  const [showWorkerForm, setShowWorkerForm] = useState(false)
  const [userData, setUserData] = useState({
    name: "",
    house: null,
  })
  const navigate = useNavigate()

  // Cargar datos del usuario al iniciar
  useEffect(() => {
    const token = localStorage.getItem("token")
    const userId = localStorage.getItem("userId")
    const userName = localStorage.getItem("name")
    const userRole = localStorage.getItem("role")

    if (!token) {
      navigate("/")
      return
    }

    // Verificar que el usuario sea un residente
    if (userRole !== "RESIDENT") {
      navigate("/")
      return
    }

    setUserData((prev) => ({
      ...prev,
      name: userName,
    }))

    // Obtener información de la casa del residente
    if (userId) {
      axios
      .get(`${API_URL}/auth/resident/profile`, {
        headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUserData((prev) => ({
            ...prev,
            house: response.data.house || null,
          }))
        })
        .catch((error) => {
          console.error("Error al obtener datos del residente:", error)
        })
    }
  }, [navigate])

  // Función para cambiar entre vistas
  const handleViewChange = (view) => {
    setActiveView(view)
  }

  // Función para manejar el botón de agregar
  const handleOpenForm = () => {
    if (activeView === "visits") {
      setShowVisitForm(true)
    } else {
      setShowWorkerForm(true)
    }
  }

  // Función para manejar la búsqueda
  const handleSearch = (term) => {
    // This function is called when the search input changes in ResidentLayout
    console.log("Search term:", term)

    // Call the appropriate child component's search method based on the active view
    if (activeView === "visits" && visitsDashboardRef.current) {
      visitsDashboardRef.current.handleSearch(term)
    } else if (activeView === "workers" && workersDashboardRef.current) {
      workersDashboardRef.current.handleSearch(term)
    }
  }

  // Agregar referencias para acceder a los métodos de los componentes hijos
  const visitsDashboardRef = useRef(null)
  const workersDashboardRef = useRef(null)

  // En el return, modificar cómo se renderizan los componentes hijos
  return (
    <ResidentLayout
      title={activeView === "visits" ? "Mis Visitas" : "Mis Trabajadores"}
      subtitle={activeView === "visits" ? "Gestión de Visitas" : "Gestión de Trabajadores"}
      onOpenForm={handleOpenForm}
      viewType={activeView}
      onViewChange={handleViewChange}
      userData={userData}
      onSearch={handleSearch}
    >
      {activeView === "visits" ? (
        <ResidentVisitsDashboard
          ref={visitsDashboardRef}
          showForm={showVisitForm}
          setShowForm={setShowVisitForm}
          userData={userData}
        />
      ) : (
        <ResidentWorkersDashboard
          ref={workersDashboardRef}
          showForm={showWorkerForm}
          setShowForm={setShowWorkerForm}
          userData={userData}
        />
      )}
    </ResidentLayout>
  )
}

export default ResidentHome
