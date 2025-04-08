"use client"

import { useState, useEffect } from "react"
import axios from "axios"
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
      const formattedDate = resident.birthDate ? new Date(resident.birthDate).toISOString().split("T")[0] : ""
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
    <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content p-3">
          <div className="modal-header">
            <h5 className="modal-title">Actualizar Perfil</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          {error && <div className="alert alert-danger mx-3 mt-3">{error}</div>}
          {successMessage && <div className="alert alert-success mx-3 mt-3">{successMessage}</div>}

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
              </div>

              <div className="row">
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
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
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
    </div>
  )
}

export default ResidentUpdateModal
