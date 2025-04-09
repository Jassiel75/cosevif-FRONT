"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { User, Mail, Lock, Phone, Calendar, MapPin } from "lucide-react"
import "../../styles/guardsAdmin/GuardUpdateModal.css"

function GuardUpdateModal({ guard, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    phone: "",
    age: "",
    birthDate: "",
    address: "",
    street: "",
  })

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Cargar los datos cuando se abra el modal
  useEffect(() => {
    if (guard) {
      const formattedDate = guard.birthDate ? new Date(guard.birthDate).toISOString().split("T")[0] : ""
      setForm({
        name: guard.name || "",
        lastName: guard.lastName || "",
        username: guard.username || "",
        email: guard.email || "",
        password: "",
        phone: guard.phone || "",
        age: guard.age || "",
        birthDate: formattedDate,
        address: guard.address || "",
        street: guard.street || "",
      })
    }
  }, [guard])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const token = localStorage.getItem("token")
    const updateData = { ...form }

    // No mandar contraseña si está vacía
    if (!updateData.password) {
      delete updateData.password
    }

    try {
      await axios.put(`http://localhost:8080/admin/guards/${guard.id}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      onSuccess()
      onClose()
    } catch (error) {
      console.error("Error al actualizar el guardia:", error)
      let errorMessage = "Hubo un error al actualizar el guardia."

      if (error.response) {
        errorMessage = `Error ${error.response.status}: ${error.response.data || errorMessage}`
      }

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="guard-update-modal">
        <div className="guard-update-header">
          <h3>Actualizar Guardia</h3>
          <button type="button" className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="guard-update-body">
            {error && <div className="error-alert">{error}</div>}

            <div className="form-row">
              <div className="form-group">
                <label>
                  <User size={16} className="field-icon" />
                  Nombre
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Nombre del guardia"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <User size={16} className="field-icon" />
                  Apellidos
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Apellidos del guardia"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  <User size={16} className="field-icon" />
                  Usuario
                </label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Nombre de usuario"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <Lock size={16} className="field-icon" />
                  Contraseña (opcional)
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Dejar en blanco para mantener la actual"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  <Mail size={16} className="field-icon" />
                  Correo
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <Phone size={16} className="field-icon" />
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Número de teléfono"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  <Calendar size={16} className="field-icon" />
                  Edad
                </label>
                <input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  placeholder="Edad del guardia"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <Calendar size={16} className="field-icon" />
                  Fecha de Nacimiento
                </label>
                <input type="date" name="birthDate" value={form.birthDate} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  <MapPin size={16} className="field-icon" />
                  Dirección
                </label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Dirección completa"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <MapPin size={16} className="field-icon" />
                  Calle
                </label>
                <input
                  type="text"
                  name="street"
                  value={form.street}
                  onChange={handleChange}
                  placeholder="Nombre de la calle"
                  required
                />
              </div>
            </div>
          </div>

          <div className="guard-update-footer">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? "Actualizando..." : "Actualizar Guardia"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default GuardUpdateModal
