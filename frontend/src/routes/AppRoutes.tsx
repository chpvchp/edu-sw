import { Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import BaiTapPage from "../pages/BaiTapPage";
import InfoExamPage from "../pages/InfoExamPage";
import LamBaiPage from "../pages/LambaiPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="bai-tap" element={<BaiTapPage />} />
        <Route path="bai-tap/:id_exam" element={<InfoExamPage />} />
        <Route path="bai-tap/:id_exam/lam-bai" element={<LamBaiPage />} />
      </Route>
    </Routes>
  )
}