"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { User, Mail, Lock, Phone, Calendar, MapPin, Home } from "lucide-react"
import "../../styles/resident/ResidentUpdateModal.css"

function ResidentUpdateModal({ resident, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    surnames: "",
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
  const [successMessage, setSuccessMessage] = useState("")

  // Cargar los datos cuando se abra el modal
  useEffect(() => {
    if (resident) {
      const formattedDate = resident.birthDate ? resident.birthDate.substring(0, 10) : ""
      setForm({
        name: resident.name || "",
        surnames: resident.surnames || "",
        email: resident.email || "",
        password: "", // Campo vacío para la contraseña
        phone: resident.phone || "",
        age: resident.age || "",
        birthDate: formattedDate,
        address: resident.address || "",
        street: resident.street || "",
      })
    }
  }, [resident])

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
    setSuccessMessage("")
    setLoading(true)

    const token = localStorage.getItem("token")
    const updateData = { ...form }

    // No mandar contraseña si está vacía
    if (!updateData.password) {
      delete updateData.password
    }

    try {
      const response = await axios.put(`http://localhost:8080/auth/resident/profile`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      console.log("Respuesta del servidor:", response.data)

      // Actualizar localStorage con los nuevos datos
      localStorage.setItem("name", form.name)
      localStorage.setItem("surnames", form.surnames)
      localStorage.setItem("email", form.email)
      localStorage.setItem("phone", form.phone)
      localStorage.setItem("age", form.age)
      localStorage.setItem("birthDate", form.birthDate)
      localStorage.setItem("address", form.address)
      localStorage.setItem("street", form.street)

      setSuccessMessage("¡Perfil actualizado correctamente!")

      // Esperar 1.5 segundos antes de cerrar el modal para que el usuario vea el mensaje de éxito
      setTimeout(() => {
        onSuccess()
      }, 1500)
    } catch (error) {
      console.error("Error al actualizar el perfil:", error)
      setError(error.response?.data || "Hubo un error al actualizar el perfil. Por favor, inténtalo de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="resident-update-modal">
        <div className="resident-update-header">
          <h3>Actualizar Perfil</h3>
          <button type="button" className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="resident-update-body">
            {error && <div className="error-alert">{error}</div>}
            {successMessage && <div className="success-alert">{successMessage}</div>}

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
                  placeholder="Tu nombre"
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
                  name="surnames"
                  value={form.surnames}
                  onChange={handleChange}
                  placeholder="Tus apellidos"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  <Mail size={16} className="field-icon" />
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <Lock size={16} className="field-icon" />
                  Contraseña (dejar en blanco para mantener la actual)
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Nueva contraseña (opcional)"
                />
              </div>
            </div>

            <div className="form-row">
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
                  placeholder="Tu número de teléfono"
                  required
                />
              </div>

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
                  placeholder="Tu edad"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  <Calendar size={16} className="field-icon" />
                  Fecha de Nacimiento
                </label>
                <input type="date" name="birthDate" value={form.birthDate} onChange={handleChange} required />
              </div>

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
                  placeholder="Tu dirección"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  <Home size={16} className="field-icon" />
                  Calle
                </label>
                <input
                  type="text"
                  name="street"
                  value={form.street}
                  onChange={handleChange}
                  placeholder="Tu calle"
                  required
                />
              </div>
            </div>
          </div>

          <div className="resident-update-footer">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Actualizando...
                </>
              ) : (
                "Guardar Cambios"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ResidentUpdateModal
