"use client"

import { useState } from "react"
import "../../../styles/resident/workers/WorkerUpdateModal.css"

function WorkerUpdateModal({ worker, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: worker.name || "",
    identification: worker.identification || "",
    profession: worker.profession || "",
    company: worker.company || "",
    startDate: worker.startDate || "",
    endDate: worker.endDate || "",
    phone: worker.phone || "",
    vehicle: worker.vehicle || "",
    licensePlate: worker.licensePlate || "",
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

    // En un entorno real, usaríamos axios para enviar los datos
    // Simulamos una respuesta exitosa
    setTimeout(() => {
      onSuccess()
      onClose()
    }, 1000)

    // En un entorno real:
    /*
    const token = localStorage.getItem("token")
    try {
      await axios.put(`http://localhost:8080/resident/workers/${worker.id}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      onSuccess() // Recargar la lista de trabajadores
      onClose() // Cerrar el modal
    } catch (error) {
      console.error("Error al actualizar el trabajador:", error)
      setError(error.response?.data || "Hubo un error al actualizar el trabajador. Por favor, inténtalo de nuevo.")
    }
    */
  }

  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content p-3">
          <div className="modal-header">
            <h5 className="modal-title">Actualizar Trabajador</h5>
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
                    name="name"
                    className="form-control"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Identificación</label>
                  <input
                    type="text"
                    name="identification"
                    className="form-control"
                    value={form.identification}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Profesión</label>
                  <input
                    type="text"
                    name="profession"
                    className="form-control"
                    value={form.profession}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Empresa</label>
                  <input
                    type="text"
                    name="company"
                    className="form-control"
                    value={form.company}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Fecha de Inicio</label>
                  <input
                    type="date"
                    name="startDate"
                    className="form-control"
                    value={form.startDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Fecha de Finalización</label>
                  <input
                    type="date"
                    name="endDate"
                    className="form-control"
                    value={form.endDate}
                    onChange={handleChange}
                    required
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
                  <label className="form-label">Vehículo (opcional)</label>
                  <input
                    type="text"
                    name="vehicle"
                    className="form-control"
                    value={form.vehicle}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Placa (opcional)</label>
                  <input
                    type="text"
                    name="licensePlate"
                    className="form-control"
                    value={form.licensePlate}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Actualizar Trabajador
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default WorkerUpdateModal

