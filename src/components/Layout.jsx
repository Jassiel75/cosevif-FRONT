"use client"

import Sidebar from "./Sidebar"
import "../styles/Layout.css"
import { CirclePlus } from "lucide-react"

function Layout({ children, title, subtitle, onOpenForm }) {
  return (
    <div className="layout-container">
      <Sidebar />
      <main className="main-content">
        <div className="content-header">
          {/* Left section - Title only */}
          <div className="header-titles">
            <h1 className="page-title">{title || "Todas las Casas"}</h1>
          </div>

          {/* Middle section - Add House button */}
          <div className="header-center">
            <button className="add-button" onClick={onOpenForm}>
              <CirclePlus className="add-icon" size={18} /> Agregar Casa
            </button>
          </div>

          {/* Right section - Search and Admin info */}
          <div className="header-right">
            <div className="admin-info">
              <span className="admin-role">Admin</span>
            </div>
            <div className="search-container">
              <input type="text" placeholder="Buscar Casa" className="search-input" />
              <button className="filter-button">Filter</button>
            </div>
          </div>
        </div>
        <div className="content-body">{children}</div>
      </main>
    </div>
  )
}

export default Layout

