"use client"

import ResidentSidebar from "./ResidentSidebar"
import "../../styles/Layout.css"
import { CirclePlus } from "lucide-react"

function ResidentLayout({ children, title, subtitle, onOpenForm, viewType = "visits", onViewChange, userData }) {
  return (
    <div className="layout-container">
      <ResidentSidebar onViewChange={onViewChange} activeView={viewType} userData={userData} />
      <main className="main-content">
        <div className="content-header">
          {/* Left section - Title only */}
          <div className="header-titles">
            <h1 className="page-title">{title || (viewType === "visits" ? "Mis Visitas" : "Mis Trabajadores")}</h1>
            <p className="header-subtitle">{subtitle}</p>
          </div>

          {/* Middle section - Add button */}
          <div className="header-center">
            <button className="add-button" onClick={onOpenForm}>
              <CirclePlus className="add-icon" size={18} />
              {viewType === "visits" ? "Agregar Visita" : "Agregar Trabajador"}
            </button>
          </div>

          {/* Right section - Search and Resident info */}
          <div className="header-right">
            <div className="admin-info">
              <span className="admin-role">Residente: {userData?.name || "Usuario"}</span>
              {userData?.house && <span className="admin-role"> - Casa #{userData.house.houseNumber}</span>}
            </div>
            <div className="search-container">
              <input
                type="text"
                placeholder={viewType === "visits" ? "Buscar Visita" : "Buscar Trabajador"}
                className="search-input"
              />
              <button className="filter-button">Filtrar</button>
            </div>
          </div>
        </div>
        <div className="content-body">{children}</div>
      </main>
    </div>
  )
}

export default ResidentLayout

