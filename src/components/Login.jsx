import React from "react";
import { useNavigate } from "react-router-dom"; // 🔥 Asegúrate de importarlo bien
import "../App.css"; 
import logo from "../images/logos_Cosevif/LogoCosevif-removed.png";
import portada from "../images/imagenes/cosevif-portada.jpg";

function Login() {
  const navigate = useNavigate(); // 🔥 Asegura que está bien definido

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Redirigiendo al Dashboard..."); // 👀 Verifica si el evento se ejecuta
    navigate("/dashboard"); // 🔥 Redirige al Dashboard
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

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <input type="email" placeholder="Introduce tu correo electrónico" required />
            </div>
            <div className="input-group">
              <input type="password" placeholder="Escribe tu contraseña" required />
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
  