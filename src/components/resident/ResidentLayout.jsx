"use client"

import ResidentSidebar from "./ResidentSidebar"
import "../../styles/Layout.css"
import { CirclePlus, Search } from "lucide-react"
import { useState } from "react"

function ResidentLayout({
  children,
  title,
  subtitle,
  onOpenForm,
  viewType = "visits",
  onViewChange,
  userData,
  onSearch,
}) {
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    if (onSearch) {
      onSearch(value)
    }
  }

  return (
    <div className="layout-container">
      <ResidentSidebar onViewChange={onViewChange} activeView={viewType} userData={userData} />
      <main className="main-content">
        <div className="content-header">
          {/* Left section - Title only */}
          <div className="header-titles">
            <h1 className="page-title">
              {title ||
                (viewType === "visits"
                  ? "Mis Visitas"
                  : viewType === "workers"
                    ? "Mis Trabajadores"
                    : viewType === "profile"
                      ? "Mi Perfil"
                      : "")}
            </h1>
            {/* Removed the subtitle */}
          </div>

          {/* Middle section - Add button */}
          <div className="header-center">
            {viewType !== "profile" && (
              <button className="add-button" onClick={onOpenForm}>
                <CirclePlus className="add-icon" size={18} />
                {viewType === "visits" ? "Agregar Visita" : "Agregar Trabajador"}
              </button>
            )}
          </div>

          {/* Right section - Search and Resident info */}
          <div className="header-right">
            <div className="admin-info">
              <div className="user-profile-info">
                <span className="user-name">{userData?.name || "Usuario"}</span>
                {userData?.house && <span className="house-badge">Casa #{userData.house.houseNumber}</span>}
              </div>
            </div>
            <div className="search-container">
              {viewType !== "profile" && (
                <div className="search-input-wrapper">
                  <input
                    type="text"
                    placeholder={viewType === "visits" ? "Buscar Visita" : "Buscar Trabajador"}
                    className="search-input"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    aria-label="Buscar"
                  />
                  <span className="search-icon">
                    <Search size={16} />
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="content-body">{children}</div>
      </main>
    </div>
  )
}

export default ResidentLayout
