import "../styles/NavItem.css"

function NavItem({ icon, label, active = false, expanded, to }) {
  return (
    <a href={to} className={`nav-item ${active ? "active" : ""}`}>
      <span className="nav-icon">{icon}</span>
      <span className={`nav-label ${expanded ? "visible" : "hidden"}`}>{label}</span>
    </a>
  )
}

export default NavItem

