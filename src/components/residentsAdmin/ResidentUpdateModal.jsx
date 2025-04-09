"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { User, Mail, Lock, Phone, Calendar, MapPin, Building } from "lucide-react"
import "../../styles/residentsAdmin/ResidentUpdateModal.css"
import { API_URL } from "../../auth/IP"

function ResidentUpdateModal({ resident, onClose, onSuccess }) {
  const [houses, setHouses] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    name: resident.name || "",
    surnames: resident.surnames || resident.lastName || "",
    email: resident.email || "",
    password: "", // Campo vacío para la contraseña
    phone: resident.phone || "",
    age: resident.age || "",
    birthDate: resident.birthDate ? resident.birthDate.substring(0, 10) : "",
    address: resident.address || "",
    street: resident.street || "",
    house: { id: resident.house?.id || "" },
  })
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
        // Incluir todas las casas y la casa actual del residente
        const availableHouses = res.data.filter(
          (house) => !house.resident || (resident.house && house.id === resident.house.id),
        )
        setHouses(availableHouses)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error al obtener las casas:", err)
        setHouses([])
        setLoading(false)
      })
  }, [resident])

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    const token = localStorage.getItem("token")
    const updateData = { ...form }

    // Si la contraseña está vacía, eliminarla del objeto para no enviarla
    if (!updateData.password) {
      delete updateData.password
    }

    try {
      await axios.put(`${API_URL}/admin/residents/${resident.id}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      onSuccess() // Recargar la lista de residentes
      onClose() // Cerrar el modal
    } catch (error) {
      console.error("Error al actualizar el residente:", error)
      setError(error.response?.data || "Hubo un error al actualizar el residente. Por favor, inténtalo de nuevo.")
    }
  }

  return (
    <div className="modal-overlay">
      <div className="resident-update-modal">
        <div className="resident-update-header">
          <h3>Actualizar Residente</h3>
          <button type="button" className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="resident-update-body">
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
                <select name="houseId" onChange={handleChange} value={form.house.id} required>
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

          <div className="resident-update-footer">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="submit-button">
              Actualizar Residente
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ResidentUpdateModal
