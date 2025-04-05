"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import ResidentLayout from "./ResidentLayout"
import ResidentVisitsDashboard from "./ResidentVisitsDashboard"
import ResidentWorkersDashboard from "./ResidentWorkersDashboard"

function ResidentHome() {
  const [activeView, setActiveView] = useState("visits") // "visits" o "workers"
  const [showVisitForm, setShowVisitForm] = useState(false)
  const [showWorkerForm, setShowWorkerForm] = useState(false)
  const navigate = useNavigate()

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
    >
      {activeView === "visits" ? (
        <ResidentVisitsDashboard showForm={showVisitForm} setShowForm={setShowVisitForm} />
      ) : (
        <ResidentWorkersDashboard showForm={showWorkerForm} setShowForm={setShowWorkerForm} />
      )}
    </ResidentLayout>
  )
}

export default ResidentHome

