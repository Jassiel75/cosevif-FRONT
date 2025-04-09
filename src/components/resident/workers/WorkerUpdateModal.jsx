"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { User, Calendar, MapPin, Upload, Clock } from "lucide-react"
import "../../../styles/resident/workers/WorkerUpdateModal.css"

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
      const localDateTime = new Date(parsedDate.getTime() - offset).toISOString().slice(0, 16) // formato datetime-local

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
    if (file) {
      setForm({ ...form, inePhoto: file })

      // Crear vista previa de la imagen
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
    <div className="modal-overlay">
      <div className="worker-update-modal">
        <div className="worker-update-header">
          <h3>Actualizar Trabajador</h3>
          <button type="button" className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="worker-update-body">
            {error && <div className="error-alert">{error}</div>}

            <div className="form-row">
              <div className="form-group">
                <label>
                  <User size={16} className="field-icon" />
                  Nombre Completo
                </label>
                <input
                  type="text"
                  name="workerName"
                  value={form.workerName}
                  onChange={handleChange}
                  placeholder="Nombre del trabajador"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <User size={16} className="field-icon" />
                  Edad
                </label>
                <input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  placeholder="Edad del trabajador"
                  required
                />
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
                  placeholder="Dirección del trabajador"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <Calendar size={16} className="field-icon" />
                  <Clock size={16} className="field-icon" />
                  Fecha y Hora
                </label>
                <input type="datetime-local" name="dateTime" value={form.dateTime} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-row image-upload-row">
              <div className="form-group image-upload-container">
                <label>
                  <Upload size={16} className="field-icon" />
                  Foto de Identificación (INE)
                </label>

                <div className="image-upload-area">
                  <input
                    type="file"
                    name="inePhoto"
                    id="inePhotoUpdate"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="file-input"
                  />

                  <label htmlFor="inePhotoUpdate" className="upload-label">
                    {!previewImage ? (
                      <>
                        <Upload size={32} />
                        <span>Haga clic para subir imagen</span>
                      </>
                    ) : (
                      <img src={previewImage || "/placeholder.svg"} alt="Vista previa" className="image-preview" />
                    )}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="worker-update-footer">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? "Actualizando..." : "Actualizar Trabajador"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default WorkerUpdateModal
