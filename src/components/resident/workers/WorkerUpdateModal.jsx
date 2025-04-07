"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import "../../../styles/resident/workers/WorkerForm.css"

function WorkerUpdateModal({ worker, onClose, onSuccess }) {
  const [form, setForm] = useState({
    workerName: "",
    age: "",
    address: "",
    dateTime: "",
    inePhoto: null,
  })

  const [previewImage, setPreviewImage] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Cargar los datos del trabajador
  useEffect(() => {
    if (worker) {
      const parsedDate = new Date(worker.dateTime)
      const offset = parsedDate.getTimezoneOffset() * 60000
      const localDateTime = new Date(parsedDate.getTime() - offset)
        .toISOString()
        .slice(0, 16) // formato datetime-local

      setForm({
        workerName: worker.workerName || "",
        age: worker.age || "",
        address: worker.address || "",
        dateTime: localDateTime,
        inePhoto: null,
      })

      if (worker.inePhoto) {
        setPreviewImage(`data:image/jpeg;base64,${worker.inePhoto}`)
      }
    }
  }, [worker])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setForm({ ...form, inePhoto: file })

    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setPreviewImage(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const token = localStorage.getItem("token")

    const parsedDate = new Date(form.dateTime)
    const offset = parsedDate.getTimezoneOffset() * 60000
    const localISODate = new Date(parsedDate.getTime() - offset).toISOString().slice(0, 19)

    const formData = new FormData()
    formData.append("workerName", form.workerName)
    formData.append("age", form.age)
    formData.append("address", form.address)
    formData.append("dateTime", localISODate)
    if (form.inePhoto) {
      formData.append("inePhoto", form.inePhoto)
    }

    try {
      await axios.put(`http://localhost:8080/resident/workerVisits/${worker.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      onSuccess()
      onClose()
    } catch (error) {
      console.error("Error al actualizar el trabajador:", error)
      setError(error.response?.data || "Hubo un error al actualizar el trabajador.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content p-3">
          <div className="modal-header">
            <h5 className="modal-title">Actualizar Trabajador</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          {error && <div className="alert alert-danger mx-3 mt-2">{error}</div>}

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

              <div className="mb-3">
                <label className="form-label">Foto INE (opcional)</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {previewImage && (
                  <div className="mt-2 text-center">
                    <img src={previewImage} alt="INE previa" style={{ maxHeight: "150px", border: "1px solid #ccc" }} />
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Actualizando..." : "Actualizar Trabajador"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default WorkerUpdateModal
