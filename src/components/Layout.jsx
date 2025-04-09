"use client"

import Sidebar from "./Sidebar"
import "../styles/Layout.css"
import { CirclePlus } from "lucide-react"
import { useState } from "react"

function Layout({ children, title, subtitle, onOpenForm, viewType = "houses", onSearch }) {
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
      <Sidebar />
      <main className="main-content">
        <div className="content-header">
          {/* Left section - Title only */}
          <div className="header-titles">
            <h1 className="page-title">{title || (viewType === "houses" ? "Todas las Casas" : "Residentes")}</h1>
          </div>

          {/* Middle section - Add button */}
          <div className="header-center">
            <button className="add-button" onClick={onOpenForm}>
              <CirclePlus className="add-icon" size={18} />
              {viewType === "houses" ? "Agregar Casa" : viewType === "guards" ? "Agregar Guardia" : "Agregar Residente"}
            </button>
          </div>

          {/* Right section - Search and Admin info */}
          <div className="header-right">
            <div className="admin-info">
              <span className="admin-role"></span>
            </div>
            <div className="search-container">
              <input
                type="text"
                placeholder={
                  viewType === "houses" ? "Buscar Casa" : viewType === "guards" ? "Buscar Guardia" : "Buscar Residente"
                }
                className="search-input"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>
        <div className="content-body">{children}</div>
      </main>
    </div>
  )
}

export default Layout
