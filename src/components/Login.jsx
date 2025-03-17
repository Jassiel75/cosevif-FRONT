import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";  // 🔥 Importar axios
import "../App.css"; 
import logo from "../images/logos_Cosevif/LogoCosevif-removed.png";
import portada from "../images/imagenes/cosevif-portada.jpg";

function Login() {
  const navigate = useNavigate(); 

  // 🔹 Estados para manejar el email y password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/auth/login",  // 🔥 URL del backend
        { username: email, password: password },   // 📌 Enviar datos en el body
        { withCredentials: true } // 💡 Si el backend usa cookies o JWT
      );

      console.log("Login exitoso:", response.data);
      localStorage.setItem("token", response.data.token);  // 🔥 Guarda el token

      navigate("/dashboard");  // ✅ Redirige al Dashboard si el login es exitoso
    } catch (err) {
      console.error("Error en login:", err.response ? err.response.data : err);
      setError("Credenciales incorrectas. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="container">
      <div className="login-container">
        <div className="login-box">
          <div className="logo-container">
            <img src={logo} alt="Logo Cosevif" className="logo-img" />
          </div>
          <h2>Bienvenido a Cosevif</h2>
          <p>Inicia sesión con tu cuenta</p>

          {error && <p className="error">{error}</p>} {/* 🔥 Mostrar error si falla el login */}

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <input 
                type="email" 
                placeholder="Introduce tu correo electrónico" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} // 🔹 Guardar email
                required 
              />
            </div>
            <div className="input-group">
              <input 
                type="password" 
                placeholder="Escribe tu contraseña" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} // 🔹 Guardar password
                required 
              />
            </div>

            <button type="submit" className="btn-marron">
              Iniciar sesión
            </button>
          </form>

          <p className="register-link">
            ¿No tienes cuenta? <a href="#">Regístrate</a>
          </p>
        </div>

        <div className="image-container">
          <img src={portada} alt="Imagen de Cosevif" />
        </div>
      </div>
    </div>
  );
}

export default Login;
