import React from "react";
import "../../styles/Dashboard.css";

const Header = () => {
  return (
    <div className="header">
      <input type="text" placeholder="Buscar Casa..." className="search-bar" />
      <div className="user-info">
        <p>🔔</p>
        <p>👤 Daniel Villasana (Admin)</p>
      </div>
    </div>
  );
};

export default Header;
