import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";

export default function MainLayout() {
  return (
    <div className="min-h-screen font-sans flex flex-col p-2">
      <NavBar />

      <Outlet />

    </div>
  )
}