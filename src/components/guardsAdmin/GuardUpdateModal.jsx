"use client"

import { useState, useEffect } from "react"
import axios from "axios"
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

  // Cargar los datos cuando se abra el modal
  useEffect(() => {
    if (guard) {
      const formattedDate = guard.birthDate
        ? new Date(guard.birthDate).toISOString().split("T")[0]
        : ""
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
    }
  }

  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content p-3">
          <div className="modal-header">
            <h5 className="modal-title">Actualizar Guardia</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          {error && <div className="alert alert-danger mx-3 mt-3">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {/* Agrupa los campos por filas para mantener diseño limpio */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Nombre</label>
                  <input type="text" name="name" className="form-control" value={form.name} onChange={handleChange} required />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Apellidos</label>
                  <input type="text" name="lastName" className="form-control" value={form.lastName} onChange={handleChange} required />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Usuario</label>
                  <input type="text" name="username" className="form-control" value={form.username} onChange={handleChange} required />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Contraseña (opcional)</label>
                  <input type="password" name="password" className="form-control" value={form.password} onChange={handleChange} />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Correo</label>
                  <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} required />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Teléfono</label>
                  <input type="tel" name="phone" className="form-control" value={form.phone} onChange={handleChange} required />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Edad</label>
                  <input type="number" name="age" className="form-control" value={form.age} onChange={handleChange} required />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Fecha de Nacimiento</label>
                  <input type="date" name="birthDate" className="form-control" value={form.birthDate} onChange={handleChange} required />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Dirección</label>
                  <input type="text" name="address" className="form-control" value={form.address} onChange={handleChange} required />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Calle</label>
                  <input type="text" name="street" className="form-control" value={form.street} onChange={handleChange} required />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn btn-primary">Actualizar Guardia</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default GuardUpdateModal
