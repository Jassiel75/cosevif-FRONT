"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import ResidentLayout from "./ResidentLayout"
import ResidentVisitsDashboard from "./ResidentVisitsDashboard"
import ResidentWorkersDashboard from "./ResidentWorkersDashboard"
import axios from "axios"

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

    if (!token) {
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
        .get(`http://localhost:8080/resident/profile`, {
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

  return (
    <ResidentLayout
      title={activeView === "visits" ? "Mis Visitas" : "Mis Trabajadores"}
      subtitle={activeView === "visits" ? "Gestión de Visitas" : "Gestión de Trabajadores"}
      onOpenForm={handleOpenForm}
      viewType={activeView}
      onViewChange={handleViewChange}
      userData={userData}
    >
      {activeView === "visits" ? (
        <ResidentVisitsDashboard showForm={showVisitForm} setShowForm={setShowVisitForm} userData={userData} />
      ) : (
        <ResidentWorkersDashboard showForm={showWorkerForm} setShowForm={setShowWorkerForm} userData={userData} />
      )}
    </ResidentLayout>
  )
}

export default ResidentHome

