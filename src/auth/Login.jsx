import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";  
import "../App.css";  // Importa App.css desde la raíz de src
import logo from "../assets/logos/LogoCosevif-removed.png";
import portada from "../assets/images/cosevif-portada.jpg";

function Login() {
  const navigate = useNavigate(); 

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/auth/login",  
        { username: email, password: password },  
        { withCredentials: true } 
      );

      console.log("Login exitoso:", response.data);
      localStorage.setItem("token", response.data.token);  

      navigate("/dashboard");  
    } catch (err) {
      console.error("Error en login:", err.response ? err.response.data : err);
      setError("⚠ Usuario no encontrado, verifica tus datos."); 
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

          {/* 🔥 Mensaje de error resaltado en rojo */}
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
          <img src={portada} alt="Imagen de Cosevif" />
        </div>
      </div>
    </div>
  );
}

export default Login;
