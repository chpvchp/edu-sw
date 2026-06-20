import { NavLink } from "react-router-dom";

export default function NavBar() {

  const listNavLink = [
    {"to": "/", "label": "Trang Chủ"},
    {"to": "/bai-tap", "label": "Bài Tập"},
  ]

  const classNameActive = "px-2 font-bold border-b border-blue-400"
  const classNameNotActive = "px-2 border border-b border-white"

  return (
    <nav className="px-8 py-4 flex gap-8">
      {listNavLink.map((navlink) => (
        <NavLink 
          to={navlink.to}
          className={({ isActive }) =>
            isActive ? classNameActive : classNameNotActive
          }
        >
          {navlink.label}
        </NavLink>
      ))}


    </nav>
  )
}