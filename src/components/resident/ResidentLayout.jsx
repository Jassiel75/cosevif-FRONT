"use client"

import { useState, useEffect } from "react"
import ResidentSidebar from "./ResidentSidebar"
import "../../styles/Layout.css"
import { CirclePlus, Search } from "lucide-react"

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
    if (viewType === "visits") return "Buscar Visita"
    return "Buscar Trabajador"
  }

  return (
    <div className="layout-container">
      <ResidentSidebar onViewChange={onViewChange} activeView={viewType} userData={userData} />

      {/* Mobile Search Bar - Only visible on mobile */}
      {isMobile && (
        <div className="mobile-search-container">
          <div className="mobile-search-wrapper">
            <Search className="mobile-search-icon" size={18} />
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

          {/* Right section - Search and Resident info - Hidden on mobile */}
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

        {/* Mobile Add Button */}
        {/* {viewType !== "profile" && (
          <div className="d-flex d-md-none justify-content-center my-3">
            <button className="add-button mobile-add-button" onClick={onOpenForm}>
              <CirclePlus className="add-icon" size={18} />
              {viewType === "visits" ? "Agregar Visita" : "Agregar Trabajador"}
            </button>
          </div>
        )} */}

        <div className="content-body">{children}</div>
      </main>
    </div>
  )
}

export default ResidentLayout

