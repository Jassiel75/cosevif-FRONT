"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import "../App.css"
import logo from "../assets/logos/LogoCosevif-removed.png"
import portada from "../assets/images/cosevif-portada.jpg"

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")

    try {
      // Primero intentamos login como RESIDENTE
      const residentRes = await axios.post("http://localhost:8080/auth/resident/login", {
        email,
        password,
      })

      const data = residentRes.data

      localStorage.setItem("token", data.token)
      localStorage.setItem("userId", data.id)
      localStorage.setItem("name", data.name)
      localStorage.setItem("surnames", data.surnames)
      localStorage.setItem("email", data.email)
      localStorage.setItem("phone", data.phone)
      localStorage.setItem("address", data.address)
      localStorage.setItem("birthDate", data.birthDate)
      localStorage.setItem("age", data.age)
      localStorage.setItem("role", "RESIDENT")

      if (data.houseId) localStorage.setItem("houseId", data.houseId)
      if (data.houseNumber) localStorage.setItem("houseNumber", data.houseNumber)
      if (data.street) localStorage.setItem("street", data.street)

      console.log("✅ Datos del RESIDENTE:", data)
      navigate("/resident/dashboard")
    } catch (err) {
      // Si falla como RESIDENT, intentamos como ADMIN
      try {
        const adminRes = await axios.post("http://localhost:8080/auth/login", {
          email,
          password,
        })

        const { token, role, id, name } = adminRes.data

        localStorage.setItem("token", token)
        localStorage.setItem("userId", id)
        localStorage.setItem("role", role)
        localStorage.setItem("name", name || "")

        console.log("✅ Acceso ADMIN:", adminRes.data)
        navigate("/dashboard")
      } catch (adminError) {
        console.error("❌ Error al iniciar sesión:", adminError.response?.data || adminError)
        setError("⚠ Usuario no encontrado, verifica tus datos.")
      }
    }
  }

  return (
    <div className="container">
      <div className="login-container">
        <div className="login-box">
          <div className="logo-container">
            <img src={logo || "/placeholder.svg"} alt="Logo Cosevif" className="logo-img" />
          </div>

          <h2>Bienvenido a Cosevif</h2>
          {error && <p className="error-message">{error}</p>}

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <input
                type="email"
                placeholder="Introduce tu correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="Escribe tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-marron">
              Iniciar sesión
            </button>
          </form>
        </div>

        <div className="image-container">
          <img src={portada || "/placeholder.svg"} alt="Imagen de Cosevif" />
        </div>
      </div>
    </div>
  )
}

export default Login
