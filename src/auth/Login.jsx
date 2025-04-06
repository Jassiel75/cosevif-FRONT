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

  // Modificar la función handleLogin para asegurar que el token se envíe correctamente
  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post("http://localhost:8080/auth/login", { email, password })

      const { token, role, name, userId } = response.data

      // Guardar el token completo sin modificaciones y el ID del usuario
      localStorage.setItem("token", token)
      localStorage.setItem("userRole", role)
      localStorage.setItem("name", name || "")
      localStorage.setItem("userId", userId || "")

      // Imprimir información para depuración
      console.log("Login exitoso:", {
        token: token.substring(0, 20) + "...",
        role,
        name,
        userId,
      })

      // Configurar el token para todas las solicitudes futuras
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`

      const userRole = role.toUpperCase()

      if (userRole === "ADMIN") {
        navigate("/dashboard")
      } else if (userRole === "RESIDENT") {
        navigate("/resident/dashboard")
      } else if (userRole === "GUARDIA") {
        navigate("/guards")
      } else {
        setError("⚠ Rol no reconocido")
      }
    } catch (err) {
      console.error("Error en login:", err.response?.data || err)
      setError("⚠ Usuario no encontrado, verifica tus datos.")
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

