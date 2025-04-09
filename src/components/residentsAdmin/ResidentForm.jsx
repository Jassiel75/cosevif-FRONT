"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { User, Mail, Lock, Phone, Calendar, MapPin, Building } from "lucide-react"
import "../../styles/residentsAdmin/ResidentForm.css"
import { API_URL } from "../../auth/IP"

function ResidentForm({ onClose, onSuccess }) {
  // Asegurarse de que el estado inicial incluya status: true
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
    house: { id: "" },
    status: true, // Siempre activo por defecto
  })
  const [houses, setHouses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Cargar las casas disponibles
  useEffect(() => {
    const token = localStorage.getItem("token")

    axios
    .get(`${API_URL}/admin/houses`, {
      headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // Filtrar casas que no tienen residentes asignados
        setHouses(res.data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error al obtener las casas:", err)
        setHouses([])
        setLoading(false)
      })
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === "houseId") {
      // Si es el selector de casa, actualizar el objeto house
      setForm({
        ...form,
        house: { id: value },
      })
    } else {
      // Para otros campos, actualizar directamente
      setForm({
        ...form,
        [name]: value,
      })
    }
  }

  // En el handleSubmit, asegurarse de que se envía el status
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    const token = localStorage.getItem("token")

    // Asegurarse de que el status siempre sea true al registrar
    const formData = {
      ...form,
      status: true, // Forzar que siempre sea true
    }

    try {
      await axios.post(`${API_URL}/admin/residents`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      onSuccess() // Recargar la lista de residentes
      onClose() // Cerrar el modal
    } catch (error) {
      console.error("Error al registrar el residente:", error.response?.data || error.message)
      setError("Error al registrar el residente: " + (error.response?.data || error.message))
    }
  }

  return (
    <div className="modal-overlay">
      <div className="resident-form-modal">
        <div className="resident-form-header">
          <h3>Registrar Residente</h3>
          <button type="button" className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="resident-form-body">
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
                  placeholder="Nombre del residente"
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
                  placeholder="Apellidos del residente"
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
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <Lock size={16} className="field-icon" />
                  Contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Contraseña segura"
                  required
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
                  placeholder="Número de teléfono"
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
                  placeholder="Edad del residente"
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
                  <Building size={16} className="field-icon" />
                  Casa Asignada
                </label>
                <select name="houseId" onChange={handleChange} required>
                  <option value="">Seleccionar Casa</option>
                  {houses.map((house) => (
                    <option key={house.id} value={house.id}>
                      Casa #{house.houseNumber} - {house.street}
                    </option>
                  ))}
                </select>
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

          <div className="resident-form-footer">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="submit-button">
              Registrar Residente
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ResidentForm
