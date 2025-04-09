"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Building, MapPin, FileText, Upload, Hash } from "lucide-react"
import "../styles/HouseForm.css"
import { API_URL } from "../auth/IP"

function HouseForm({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    address: "",
    street: "",
    houseNumber: "",
    description: "",
    photo: null,
  })
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [existingHouses, setExistingHouses] = useState([])
  const [previewImage, setPreviewImage] = useState(null)

  // Cargar las casas existentes al montar el componente
  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          console.error("No se encontró token de autenticación")
          return
        }

        const response = await axios.get(`${API_URL}/admin/houses`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        console.log("Casas existentes cargadas:", response.data)
        setExistingHouses(response.data || [])
      } catch (err) {
        console.error("Error al obtener las casas:", err)
        setExistingHouses([])
      }
    }

    fetchHouses()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    // Limpiar el error cuando el usuario cambia el número de casa
    if (name === "houseNumber") {
      setError("")
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setForm({ ...form, photo: file })

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

    // Convertir a string para comparación consistente
    const houseNumberStr = form.houseNumber.toString().trim()

    // Verificar si ya existe una casa con ese número
    const houseExists = existingHouses.some((house) => house.houseNumber.toString().trim() === houseNumberStr)

    if (houseExists) {
      setError(`Ya existe una casa con el número ${houseNumberStr}. Por favor, utilice otro número.`)
      return // Detener la ejecución si el número ya existe
    }

    setIsSubmitting(true)
    const token = localStorage.getItem("token")
    const formData = new FormData()

    formData.append("address", form.address)
    formData.append("street", form.street)
    formData.append("houseNumber", houseNumberStr)
    formData.append("description", form.description)
    formData.append("photo", form.photo)

    try {
      await axios.post(`${API_URL}/admin/houses`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      onSuccess() // Para recargar lista
      onClose() // Para cerrar el modal
    } catch (error) {
      console.error("Error al registrar la casa:", error)
      if (error.response?.data?.includes("house number already exists")) {
        setError("Ya existe una casa con este número. Por favor, utilice otro número.")
      } else {
        setError("Hubo un error al registrar la casa. Por favor, inténtelo de nuevo.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="house-form-modal">
        <div className="house-form-header">
          <h3>Registrar Nueva Casa</h3>
          <button type="button" className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="house-form-body">
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
                  value={form.street}
                  onChange={handleChange}
                  placeholder="Nombre de la calle"
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
                  value={form.houseNumber}
                  onChange={handleChange}
                  placeholder="Número de la casa"
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
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Descripción de la casa"
                  required
                  rows="3"
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
                    name="photo"
                    id="housePhoto"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="file-input"
                    required
                  />

                  <label htmlFor="housePhoto" className="upload-label">
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

          <div className="house-form-footer">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? "Registrando..." : "Registrar Casa"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default HouseForm
