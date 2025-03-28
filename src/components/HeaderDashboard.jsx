"use client"

import { useState } from "react"
import { FaSearch, FaBell, FaPlus } from "react-icons/fa"
import "../styles/HeaderDashboard.css"

function HeaderDashboard({ title = "Dashboard", subtitle = "Bienvenido", onOpenForm }) {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="header-dashboard">
      <div className="header-left">
        <h1 className="header-title">{title}</h1>
        <p className="header-subtitle">{subtitle}</p>
      </div>

      <div className="header-right">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button className="notification-btn">
          <FaBell />
          <span className="notification-badge">3</span>
        </button>

        {onOpenForm && (
          <button className="add-btn" onClick={onOpenForm}>
            <FaPlus />
            <span>Agregar</span>
          </button>
        )}

        <div className="user-profile">
          <img src="/src/assets/images/cosevif-32x32.png" alt="User" className="user-avatar" />
        </div>
      </div>
    </div>
  )
}

export default HeaderDashboard

