"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Building, MapPin, FileText, Upload, Hash } from "lucide-react"
import "../../styles/HouseUpdateModal.css"
import { API_URL } from "../../auth/IP" // Ajusta la ruta según tu estructura

function HouseUpdateModal({ house, onClose, onSuccess }) {
  const [form, setForm] = useState({
    address: house.address || "",
    street: house.street || "",
    houseNumber: house.houseNumber || "",
    description: house.description || "",
    photo: null,
  })
  const [previewImage, setPreviewImage] = useState(null)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Set preview image if house has a photo
  useEffect(() => {
    if (house.photo) {
      setPreviewImage(`data:image/jpeg;base64,${house.photo}`)
    }
  }, [house])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setForm({ ...form, photo: file })

      // Create image preview
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
    setIsSubmitting(true)

    const token = localStorage.getItem("token")
    const formData = new FormData()

    formData.append("address", form.address)
    formData.append("street", form.street)
    formData.append("houseNumber", form.houseNumber)
    formData.append("description", form.description)
    if (form.photo) {
      formData.append("photo", form.photo)
    }

    try {
      await axios.put(`${API_URL}/admin/houses/${house.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      onSuccess()
      onClose()
    } catch (error) {
      console.error("Error al actualizar la casa:", error)
      setError("Hubo un error al actualizar la casa. Por favor, inténtelo de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="house-update-modal">
        <div className="house-update-header">
          <h3>Actualizar Casa #{house.houseNumber}</h3>
          <button type="button" className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="house-update-form">
          <div className="house-update-body">
            {error && <div className="error-alert">{error}</div>}

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
                  placeholder="Dirección de la casa"
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
                  className="form-control"
                  value={form.street}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  <Hash size={16} className="field-icon" />
                  Número de Casa
                </label>
                <input
                  type="number"
                  name="houseNumber"
                  className="form-control"
                  value={form.houseNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <FileText size={16} className="field-icon" />
                  Descripción
                </label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="5"
                  value={form.description}
                  onChange={handleChange}
                  required
                  placeholder="Descripción de la casa"
                ></textarea>
              </div>
            </div>

            <div className="form-row image-upload-row">
              <div className="form-group image-upload-container">
                <label>
                  <Building size={16} className="field-icon" />
                  Imagen de la Casa
                </label>

                <div className="image-upload-area">
                  <input
                    type="file"
                    accept="image/*"
                    className="file-input"
                    id="housePhotoUpdate"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="housePhotoUpdate" className="upload-label">
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

          <div className="house-update-footer">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancelar
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
              style={{ backgroundColor: "#862d26", color: "white" }}
            >
              {isSubmitting ? "Actualizando..." : "Actualizar Casa"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default HouseUpdateModal
