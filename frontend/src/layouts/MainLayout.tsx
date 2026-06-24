import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";

export default function MainLayout() {
  return (
    <div className="min-h-screen font-ubuntu flex flex-col">
      <NavBar />

      <Outlet />

    </div>
  )
}