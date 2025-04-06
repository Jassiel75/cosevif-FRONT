"use client"

import { useState } from "react"
import axios from "axios"
import QRCode from "qrcode"
import "../../../styles/resident/visits/VisitForm.css"

function VisitForm({ onClose, onSuccess, userData }) {
  const [form, setForm] = useState({
    visitorName: "",
    dateTime: "",
    numPeople: 1,
    description: "",
    vehiclePlate: "",
    password: generateRandomPassword(), // Generamos una contraseña aleatoria por defecto
  })
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Función para generar una contraseña aleatoria de 4 dígitos
  function generateRandomPassword() {
    return Math.floor(1000 + Math.random() * 9000).toString()
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({
      ...form,
      [name]: value,
    })
  }

  // Función para generar el código QR en base64
  const generateQRCode = async (visitData) => {
    try {
      // Crear un objeto con la información relevante para el QR
      const qrData = JSON.stringify({
        visitorName: visitData.visitorName,
        dateTime: visitData.dateTime,
        numPeople: visitData.numPeople,
        password: visitData.password,
        vehiclePlate: visitData.vehiclePlate || "N/A",
        houseNumber: userData?.house?.houseNumber || "N/A",
      })

      // Generar el QR como una URL de datos en base64
      const qrCodeBase64 = await QRCode.toDataURL(qrData)

      // Extraer solo la parte base64 (sin el prefijo "data:image/png;base64,")
      return qrCodeBase64.split(",")[1]
    } catch (error) {
      console.error("Error al generar el código QR:", error)
      return null
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)
  
    try {
      const date = new Date(form.dateTime)
      const offset = date.getTimezoneOffset() * 60000
      const localISOTime = new Date(date.getTime() - offset).toISOString().slice(0, 19)
  
      const visitData = {
        ...form,
        dateTime: localISOTime, // Ajustado a hora local sin cambiar a UTC
        numPeople: Number.parseInt(form.numPeople),
        status: "PENDING",
        houseId: userData?.house?.id,
      }
  
      console.log("Enviando datos de visita:", visitData)
  
      const token = localStorage.getItem("token")
  
      await axios.post("http://localhost:8080/resident/visit", visitData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
  
      onSuccess()
      onClose()
    } catch (error) {
      console.error("Error al registrar la visita:", error)
      setError(error.response?.data || "Hubo un error al registrar la visita. Por favor, inténtalo de nuevo.")
  
      if (process.env.NODE_ENV === "development") {
        onSuccess()
        onClose()
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content p-3">
          <div className="modal-header">
            <h5 className="modal-title">Registrar Visita</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          {error && <div className="alert alert-danger mx-3 mt-3">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Nombre del Visitante</label>
                  <input
                    type="text"
                    name="visitorName"
                    className="form-control"
                    value={form.visitorName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Fecha y Hora de Visita</label>
                  <input
                    type="datetime-local"
                    name="dateTime"
                    className="form-control"
                    value={form.dateTime}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Número de Personas</label>
                  <input
                    type="number"
                    name="numPeople"
                    className="form-control"
                    value={form.numPeople}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Contraseña para Acceso</label>
                  <input
                    type="text"
                    name="password"
                    className="form-control"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Placas del Vehículo (opcional)</label>
                  <input
                    type="text"
                    name="vehiclePlate"
                    className="form-control"
                    value={form.vehiclePlate}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Descripción</label>
                  <textarea
                    name="description"
                    className="form-control"
                    value={form.description}
                    onChange={handleChange}
                    required
                    rows="3"
                  ></textarea>
                </div>
              </div>

              {userData?.house && (
                <div className="row">
                  <div className="col-12">
                    <div className="alert alert-info">
                      <strong>Casa asignada:</strong> #{userData.house.houseNumber} - {userData.house.street}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-danger" disabled={isSubmitting}>
                {isSubmitting ? "Registrando..." : "Registrar Visita"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default VisitForm

