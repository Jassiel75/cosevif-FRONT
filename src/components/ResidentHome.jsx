import React, { useEffect, useState } from "react";

function ResidentHome() {
  const [name, setName] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    if (storedName) {
      setName(storedName);
    }
  }, []);

  return (
    <div className="container mt-5">
      <h2>¡Bienvenido residente {name}! 🏡</h2>
      <p>Aquí puedes ver tus visitas o generar un código QR.</p>
    </div>
  );
}

export default ResidentHome;
