import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";

export default function MainLayout() {
  return (
    <div className="font-sans flex flex-col">
      <NavBar />

      <Outlet />

    </div>
  )
}