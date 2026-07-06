import { House, BookOpen } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function NavBar() {

  const listNavLink = [
    {to: "/", label: "Trang Chủ", icon: House},
    {to: "/bai-tap", label: "Bài Tập", icon: BookOpen},
  ]

  const classNameActive = "p-2 bg-blue-600 text-white rounded-full"
  const classNameNotActive = "p-2 bg-white rounded-full"

  return (
    <nav className="p-2 flex gap-2 border border-gray-200 shadow mx-auto rounded-full">
      {listNavLink.map(({to, icon: Icon}) => (
        <NavLink 
          key={to}
          to={to}
          className={({ isActive }) =>
            isActive ? classNameActive : classNameNotActive
          }
        >
          <Icon />
        </NavLink>
      ))}


    </nav>
  )
}