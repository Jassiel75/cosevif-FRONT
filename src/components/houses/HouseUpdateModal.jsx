import React, { useState } from "react";
import axios from "axios";
import "../../styles/HouseUpdateModal.css";

function HouseUpdateModal({ house, onClose, onSuccess }) {
  const [form, setForm] = useState({
    address: house.address || "",
    street: house.street || "",
    houseNumber: house.houseNumber || "",
    description: house.description || "",
    photo: null, 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, photo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const formData = new FormData();

    formData.append("address", form.address);
    formData.append("street", form.street);
    formData.append("houseNumber", form.houseNumber);
    formData.append("description", form.description);
    if (form.photo) {
      formData.append("photo", form.photo); 
    }

    try {
      await axios.put(`http://localhost:8080/admin/houses/${house.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      onSuccess(); 
      onClose();   
    } catch (error) {
      console.error("Error al actualizar la casa:", error);
      alert("Hubo un error al actualizar la casa.");
    }
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content p-4">
          <div className="modal-header">
            <h5 className="modal-title">Actualizar Casa #{house.houseNumber}</h5>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Dirección</label>
                <input type="text" name="address" className="form-control" value={form.address} onChange={handleChange} required />
              </div>
              <div className="mb-4">
                <label className="form-label">Calle</label>
                <input type="text" name="street" className="form-control" value={form.street} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Número de Casa</label>
                <input type="number" name="houseNumber" className="form-control" value={form.houseNumber} onChange={handleChange} required />
              </div>
              <div className="mb-4">
                <label className="form-label">Descripción</label>
                <textarea name="description" className="form-control" rows="2" value={form.description} onChange={handleChange} required></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label">Imagen de la Casa</label>
                <input type="file" accept="image/*" className="form-control" onChange={handleFileChange} />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn btn-primary">Actualizar Casa</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default HouseUpdateModal;
