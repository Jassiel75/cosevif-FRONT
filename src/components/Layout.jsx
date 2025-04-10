"use client"

import Sidebar from "./Sidebar"
import "../styles/Layout.css"
import { CirclePlus, Search } from "lucide-react"
import { useState, useEffect } from "react"

function Layout({ children, title, subtitle, onOpenForm, viewType = "houses", onSearch }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isMobile, setIsMobile] = useState(false)

  // Check if the screen is mobile size
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    // Initial check
    checkIfMobile()

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    if (onSearch) {
      onSearch(value)
    }
  }

  const getPlaceholderText = () => {
    if (viewType === "houses") return "Buscar Casa"
    if (viewType === "guards") return "Buscar Guardia"
    return "Buscar Residente"
  }

  return (
    <div className="layout-container">
      <Sidebar />

      {/* Mobile Search Bar - Only visible on mobile */}
      {isMobile && (
        <div className="mobile-search-container">
          <div className="mobile-search-wrapper">
            <Search className="mobile-search-icon" size={16} />
            <input
              type="text"
              placeholder={getPlaceholderText()}
              className="mobile-search-input"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      )}

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

          {/* Right section - Search and Admin info - Hidden on mobile */}
          <div className="header-right">
            <div className="admin-info">
              <span className="admin-role"></span>
            </div>
            {!isMobile && (
              <div className="search-container">
                <input
                  type="text"
                  placeholder={getPlaceholderText()}
                  className="search-input"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            )}
          </div>
        </div>
        <div className="content-body">{children}</div>
      </main>
    </div>
  )
}

export default Layout
