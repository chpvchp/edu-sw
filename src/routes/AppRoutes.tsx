import { Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import BaiTapPage from "../pages/BaiTapPage";
import InfoExamPage from "../pages/InfoExamPage";
import LamBaiPage from "../pages/LambaiPage";
import KetQuaPage from "../pages/KetQuaPage";

/**
 * AppRoutes | cây điều hướng của ứng dụng.
 * Defines the static routing map for the landing page, practice list, exam detail, exam workspace, and result review screens.
 * Định nghĩa bản đồ route tĩnh cho trang chủ, danh sách bài tập, trang chi tiết đề, trang làm bài và trang xem lại kết quả.
 */
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="bai-tap" element={<BaiTapPage />} />
        <Route path="bai-tap/:id_exam" element={<InfoExamPage />} />
        <Route path="bai-tap/:id_exam/lam-bai" element={<LamBaiPage />} />
        <Route path="bai-tap/ket-qua" element={<KetQuaPage />} />
      </Route>
    </Routes>
  )
}