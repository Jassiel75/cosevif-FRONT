"use client"

import { useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import "bootstrap/dist/css/bootstrap.min.css"
import "../../styles/public/RegisterVisit.css"
import logo from "../../assets/logos/LogoCosevif-removed.png"

function RegisterVisit() {
  const { residentId } = useParams() // Obtener el ID del residente de la URL
  const [form, setForm] = useState({
    visitorName: "",
    dateTime: "",
    numPeople: 1,
    description: "",
    vehiclePlate: "",
    password: "",
  })
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (!residentId) {
        setError("Enlace inválido. No se encontró el ID del residente.")
        setLoading(false)
        return
      }

      // Formatear la fecha para enviarla en formato ISO
      const date = new Date(form.dateTime)
      const offset = date.getTimezoneOffset() * 60000
      const localISOTime = new Date(date.getTime() - offset).toISOString().slice(0, 19)

      const visitData = {
        ...form,
        dateTime: localISOTime,
        numPeople: Number.parseInt(form.numPeople),
        status: "PENDING",
      }

      // Enviar la solicitud al endpoint correcto
      const response = await axios.post(`http://localhost:8080/public/visit?residentId=${residentId}`, visitData)

      console.log("Respuesta del servidor:", response.data)
      setSuccess(true)
    } catch (err) {
      console.error("Error al registrar la visita:", err)
      setError(err.response?.data || "Error al registrar la visita. Por favor, intente nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-visit-container">
      <div className="register-visit-card">
        <div className="register-visit-header">
          <img src={logo || "/placeholder.svg"} alt="Logo Cosevif" className="register-visit-logo" />
          <h2>Registro de Visita</h2>
          <p className="resident-info">Complete el formulario para registrar su visita</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {success ? (
          <div className="alert alert-success">
            <h4>✅ Visita registrada correctamente</h4>
            <p>Su visita ha sido registrada con éxito. El residente recibirá una notificación.</p>
            <p>Por favor, guarde la contraseña proporcionada para acceder el día de su visita.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="visitorName">Nombre del Visitante</label>
              <input
                type="text"
                id="visitorName"
                name="visitorName"
                className="form-control"
                value={form.visitorName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="dateTime">Fecha y Hora</label>
                <input
                  type="datetime-local"
                  id="dateTime"
                  name="dateTime"
                  className="form-control"
                  value={form.dateTime}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="numPeople">Número de Personas</label>
                <input
                  type="number"
                  id="numPeople"
                  name="numPeople"
                  className="form-control"
                  min="1"
                  value={form.numPeople}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña de Acceso</label>
              <input
                type="text"
                id="password"
                name="password"
                className="form-control"
                value={form.password}
                onChange={handleChange}
                required
              />
              <small className="form-text text-muted">
                Esta contraseña será solicitada por el guardia el día de su visita.
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="vehiclePlate">Placas del Vehículo (opcional)</label>
              <input
                type="text"
                id="vehiclePlate"
                name="vehiclePlate"
                className="form-control"
                value={form.vehiclePlate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Descripción / Motivo de la Visita</label>
              <textarea
                id="description"
                name="description"
                className="form-control"
                rows="3"
                value={form.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Registrando..." : "Registrar Visita"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default RegisterVisit

