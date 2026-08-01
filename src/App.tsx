import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import ScrollToTop from "./components/ScrollToTop";

/**
 * App | Ứng dụng gốc của toàn bộ frontend.
 * This component only wires the browser router and the top-level route tree, so the app shell stays predictable and easy to reason about.
 * Thành phần này chỉ ghép BrowserRouter với cây route cấp cao nhất để giữ phần khung ứng dụng đơn giản, ổn định và dễ bảo trì.
 */
export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppRoutes />
    </BrowserRouter>
  )
}