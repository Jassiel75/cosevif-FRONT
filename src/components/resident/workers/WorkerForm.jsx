"use client"

import { useState } from "react"
import "../../../styles/resident/workers/WorkerForm.css"
import axios from "axios"

function WorkerForm({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    workerName: "",
    age: "",
    address: "",
    dateTime: "",
    inePhoto: null,
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({
      ...form,
      [name]: value,
    })
  }

  const handleFileChange = (e) => {
    setForm({
      ...form,
      inePhoto: e.target.files[0],
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const token = localStorage.getItem("token")

    const formData = new FormData()
    formData.append("workerName", form.workerName)
    formData.append("age", form.age)
    formData.append("address", form.address)

    // Convertir la fecha al formato ISO (con hora 00:00:00 por defecto)
    const date = new Date(form.dateTime)
    const offset = date.getTimezoneOffset() * 60000
    const localISOTime = new Date(date.getTime() - offset).toISOString().slice(0, 19)
    formData.append("dateTime", localISOTime)

    if (form.inePhoto) {
      formData.append("inePhoto", form.inePhoto)
    }

    try {
      await axios.post("http://localhost:8080/resident/workerVisits", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      onSuccess()
      onClose()
    } catch (error) {
      console.error("Error al registrar el trabajador:", error)
      setError(error.response?.data || "Hubo un error al registrar el trabajador. Intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content p-3">
          <div className="modal-header">
            <h5 className="modal-title">Registrar Trabajador</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          {error && <div className="alert alert-danger mx-3 mt-3">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Nombre Completo</label>
                  <input
                    type="text"
                    name="workerName"
                    className="form-control"
                    value={form.workerName}
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
  <label className="form-label">Fecha y Hora</label>
  <input
    type="datetime-local"
    name="dateTime"
    className="form-control"
    value={form.dateTime}
    onChange={handleChange}
    required
  />
</div>

              </div>

              <div className="row">
                <div className="col-md-12 mb-3">
                  <label className="form-label">Foto de Identificación (INE)</label>
                  <input
                    type="file"
                    name="inePhoto"
                    className="form-control"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-danger" disabled={loading}>
                {loading ? "Registrando..." : "Registrar Trabajador"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default WorkerForm
