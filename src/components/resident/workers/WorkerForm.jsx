"use client"

import { useState } from "react"
import axios from "axios"
import { User, Calendar, MapPin, Upload, Clock } from "lucide-react"
import "../../../styles/resident/workers/WorkerForm.css"

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
  const [previewImage, setPreviewImage] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({
      ...form,
      [name]: value,
    })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setForm({
        ...form,
        inePhoto: file,
      })

      // Crear vista previa de la imagen
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
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
    <div className="modal-overlay">
      <div className="worker-form-modal">
        <div className="worker-form-header">
          <h3>Registrar Nuevo Trabajador</h3>
          <button type="button" className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="worker-form-body">
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
                    id="inePhoto"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="file-input"
                  />

                  <label htmlFor="inePhoto" className="upload-label">
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

          <div className="worker-form-footer">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? "Registrando..." : "Registrar Trabajador"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default WorkerForm
