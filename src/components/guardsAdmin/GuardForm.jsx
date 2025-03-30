"use client"

import { useState } from "react"
import axios from "axios"
import "../../styles/guardsAdmin/GuardForm.css"

function GuardForm({ onClose, onSuccess }) {
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

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({
      ...form,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    const token = localStorage.getItem("token")

    try {
      await axios.post("http://localhost:8080/admin/guards", form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      onSuccess() // Recargar la lista de guardias
      onClose() // Cerrar el modal
    } catch (error) {
      console.error("Error al registrar el guardia:", error)
      setError(error.response?.data || "Hubo un error al registrar el guardia. Por favor, inténtalo de nuevo.")
    }
  }

  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content p-3">
          <div className="modal-header">
            <h5 className="modal-title">Registrar Guardia</h5>
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
                    name="lastName"
                    className="form-control"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Nombre de Usuario</label>
                  <input
                    type="text"
                    name="username"
                    className="form-control"
                    value={form.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Contraseña</label>
                  <input
                    type="password"
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
              </div>

              <div className="row">
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
              <button type="submit" className="btn btn-danger">
                Registrar Guardia
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default GuardForm

