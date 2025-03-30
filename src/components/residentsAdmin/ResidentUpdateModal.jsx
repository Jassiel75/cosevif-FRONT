"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import "../../styles/residentsAdmin/ResidentUpdateModal.css"

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
      .get("http://localhost:8080/admin/houses", {
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
      await axios.put(`http://localhost:8080/admin/residents/${resident.id}`, updateData, {
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
    <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content p-3">
          <div className="modal-header">
            <h5 className="modal-title">Actualizar Residente</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          {error && <div className="alert alert-danger mx-3 mt-3">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Apellidos</label>
                  <input
                    type="text"
                    name="surnames"
                    className="form-control"
                    value={form.surnames}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Correo Electrónico</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Contraseña (dejar en blanco para mantener la actual)</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Nueva contraseña (opcional)"
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Teléfono</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-control"
                    value={form.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Edad</label>
                  <input
                    type="number"
                    name="age"
                    className="form-control"
                    value={form.age}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Fecha de Nacimiento</label>
                  <input
                    type="date"
                    name="birthDate"
                    className="form-control"
                    value={form.birthDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Casa Asignada</label>
                  <select name="houseId" className="form-select" onChange={handleChange} value={form.house.id} required>
                    <option value="">Seleccionar Casa</option>
                    {houses.map((house) => (
                      <option key={house.id} value={house.id}>
                        Casa #{house.houseNumber} - {house.street}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Dirección</label>
                  <input
                    type="text"
                    name="address"
                    className="form-control"
                    value={form.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Calle</label>
                  <input
                    type="text"
                    name="street"
                    className="form-control"
                    value={form.street}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Actualizar Residente
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ResidentUpdateModal

