"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { User, Calendar, Clock, Users, Car, FileText, Key, CheckCircle, AlertTriangle, ArrowLeft } from "lucide-react"
import "../../styles/public/RegisterVisit.css"
import logo from "../../assets/logos/LogoCosevif-removed.png"

import { API_URL } from "../../auth/IP"


function RegisterVisit() {
  const { residentId } = useParams()
  const navigate = useNavigate()
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
  const [residentInfo, setResidentInfo] = useState(null)

  // Obtener información del residente al cargar
  useEffect(() => {
    if (!residentId) return

    const fetchResidentInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/public/resident/${residentId}`)
        setResidentInfo(response.data)
      } catch (err) {
        console.error("Error al obtener información del residente:", err)
      }
    }

    fetchResidentInfo()
  }, [residentId])

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
      // Limpiar el formulario
      setForm({
        visitorName: "",
        dateTime: "",
        numPeople: 1,
        description: "",
        vehiclePlate: "",
        password: "",
      })
    } catch (err) {
      console.error("Error al registrar la visita:", err)
      setError(err.response?.data || "Error al registrar la visita. Por favor, intente nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  // Función para volver a la página anterior
  const handleGoBack = () => {
    navigate(-1)
  }

  // Obtener la fecha mínima (hoy) para el input de fecha
  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  }

  return (
    <div className="register-visit-container">
      <div className="register-visit-card">
        <div className="register-visit-header">
          <img src={logo || "/placeholder.svg"} alt="Logo Cosevif" className="register-visit-logo" />
          <h2>Registro de Visita</h2>

          {residentInfo && (
            <div className="resident-info">
              <p>
                Visita para:{" "}
                <span className="resident-name">
                  {residentInfo.name} {residentInfo.surnames}
                </span>
              </p>
              {residentInfo.house && (
                <p>
                  Casa: <span className="house-number">#{residentInfo.house.houseNumber}</span>
                </p>
              )}
            </div>
          )}
        </div>

        {error && (
          <div className="alert-error">
            <AlertTriangle size={20} />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="success-container">
            <div className="success-icon">
              <CheckCircle size={60} />
            </div>
            <h3>¡Visita registrada correctamente!</h3>
            <p>Su visita ha sido registrada con éxito.</p>
            <p className="password-reminder">
              <Key size={16} />
              <span>
                Recuerde su contraseña para el día de su visita: <strong>{form.password}</strong>
              </span>
            </p>
            <button className="back-button" onClick={handleGoBack}>
              <ArrowLeft size={16} />
              Volver
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="visit-form">
            <div className="form-section">
              <h3 className="section-title">Información del Visitante</h3>

              <div className="form-group">
                <label htmlFor="visitorName">
                  <User size={16} />
                  Nombre del Visitante
                </label>
                <input
                  type="text"
                  id="visitorName"
                  name="visitorName"
                  value={form.visitorName}
                  onChange={handleChange}
                  placeholder="Nombre completo"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="dateTime">
                    <Calendar size={16} />
                    Fecha
                  </label>
                  <input
                    type="date"
                    id="dateTime"
                    name="dateTime"
                    value={form.dateTime.split("T")[0] || ""}
                    onChange={(e) => {
                      const timeValue = form.dateTime.split("T")[1] || "12:00"
                      setForm({
                        ...form,
                        dateTime: `${e.target.value}T${timeValue}`,
                      })
                    }}
                    min={getMinDate()}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="timeInput">
                    <Clock size={16} />
                    Hora
                  </label>
                  <input
                    type="time"
                    id="timeInput"
                    value={form.dateTime.split("T")[1] || ""}
                    onChange={(e) => {
                      const dateValue = form.dateTime.split("T")[0] || getMinDate()
                      setForm({
                        ...form,
                        dateTime: `${dateValue}T${e.target.value}`,
                      })
                    }}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="numPeople">
                    <Users size={16} />
                    Número de Personas
                  </label>
                  <input
                    type="number"
                    id="numPeople"
                    name="numPeople"
                    min="1"
                    value={form.numPeople}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">
                    <Key size={16} />
                    Contraseña de Acceso
                  </label>
                  <input
                    type="text"
                    id="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Contraseña para acceso"
                    required
                  />
                  <small className="form-hint">
                    Esta contraseña será solicitada por el guardia el día de su visita.
                  </small>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-title">Detalles Adicionales</h3>

              <div className="form-group">
                <label htmlFor="vehiclePlate">
                  <Car size={16} />
                  Placas del Vehículo (opcional)
                </label>
                <input
                  type="text"
                  id="vehiclePlate"
                  name="vehiclePlate"
                  value={form.vehiclePlate}
                  onChange={handleChange}
                  placeholder="Ej: ABC-123"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">
                  <FileText size={16} />
                  Motivo de la Visita
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describa el motivo de su visita"
                  required
                ></textarea>
              </div>
            </div>

            <div className="form-actions">
              
              <button type="submit" className="submit-button" disabled={loading}>
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
