"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Layout from "./Layout"
import ResidentTable from "../components/residentsAdmin/ResidentTable"

import "../styles/residentsAdmin/ResidentDashboard.css"

function ResidentDashboard() {
  const [residents, setResidents] = useState([])

  // Obtener residentes desde la API
  const loadResidents = () => {
    const token = localStorage.getItem("token")

    axios
      .get("http://localhost:8080/admin/residents", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setResidents(res.data)
      })
      .catch((err) => {
        console.error("Error al obtener los residentes:", err)
      })
  }

  useEffect(() => {
    loadResidents()
  }, [])

  // Funciones para futuras acciones
  const handleView = (resident) => {
    console.log("Ver detalles de:", resident)
  }

  const handleUpdate = (resident) => {
    console.log("Actualizar residente:", resident)
  }

  const handleToggleStatus = (resident) => {
    console.log("Cambiar estado:", resident)
  }

  return (
    <Layout title="Residentes" subtitle="Mostrar Residentes">
      <div className="row mt-3">
        <ResidentTable
          residents={residents}
          onView={handleView}
          onUpdate={handleUpdate}
          onToggleStatus={handleToggleStatus}
        />
      </div>
    </Layout>
  )
}

export default ResidentDashboard

