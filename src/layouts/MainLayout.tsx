import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";

/**
 * MainLayout | bố cục chính.
 * Wraps every routed page with the shared navigation shell and a consistent page container.
 * Bao bọc mọi trang theo route bằng khung điều hướng dùng chung và một container thống nhất.
 */
export default function MainLayout() {
  return (
    <div className="min-h-screen font-sans flex flex-col p-2">
      <NavBar />

      <Outlet />

    </div>
  )
}