"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import "../styles/HouseForm.css"

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

  // Cargar las casas existentes al montar el componente
  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          console.error("No se encontró token de autenticación")
          return
        }

        const response = await axios.get("http://localhost:8080/admin/houses", {
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
    setForm({ ...form, photo: e.target.files[0] })
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
      await axios.post("http://localhost:8080/admin/houses", formData, {
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
    <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content p-3">
          <div className="modal-header">
            <h5 className="modal-title">Registrar Casa</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          {error && <div className="alert alert-danger mx-3 mt-3">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
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
              <div className="mb-3">
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
              <div className="mb-3">
                <label className="form-label">Número de casa</label>
                <input
                  type="number"
                  name="houseNumber"
                  className="form-control"
                  value={form.houseNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Descripción</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="2"
                  value={form.description}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label">Imagen de la casa</label>
                <input type="file" accept="image/*" className="form-control" onChange={handleFileChange} required />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-danger" disabled={isSubmitting}>
                {isSubmitting ? "Registrando..." : "Registrar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default HouseForm

