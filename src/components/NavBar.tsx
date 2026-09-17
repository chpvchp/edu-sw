import { BookOpen, House } from "lucide-react";
import { NavLink } from "react-router-dom";

/**
 * NavBar | thanh điều hướng.
 * Provides the small top-level route switcher for the app, keeping navigation minimal and focused on the learning flow.
 * Cung cấp thanh chuyển trang cấp cao nhất cho ứng dụng, giữ điều hướng tối giản và tập trung vào luồng học tập.
 */
export default function NavBar() {

  const listNavLink = [
    {to: "/", label: "Trang chủ", icon: House, end: true},
    {to: "/bai-tap", label: "Bài tập", icon: BookOpen},
  ]

  return (
    <header className="sticky top-0 z-20 border-b border-[#dbe7ee]/80 bg-[#f4f8fb]/90 px-4 py-3 backdrop-blur-md sm:px-6 lg:px-8">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4" aria-label="Điều hướng chính">
        <NavLink to="/" className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-[#18324b]">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#18324b] text-[#d9f2e7] shadow-sm">
            <BookOpen className="h-5 w-5" aria-hidden="true" />
          </span>
          <span>EduSW</span>
        </NavLink>

        <div className="flex items-center gap-1 rounded-2xl border border-[#dbe7ee] bg-white/80 p-1 shadow-sm">
          {listNavLink.map(({to, label, icon: Icon, end}) => (
        <NavLink 
          key={to}
          to={to}
          end={end}
          aria-label={label}
          className={({ isActive }) =>
            `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
              isActive
                ? "bg-[#18324b] text-white shadow-sm"
                : "text-[#587084] hover:bg-[#eaf4f3] hover:text-[#18324b]"
            }`
          }
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">{label}</span>
        </NavLink>
      ))}
        </div>
      </nav>
    </header>
  )
}