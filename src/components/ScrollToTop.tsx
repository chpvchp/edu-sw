import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop | cuộn lên đầu trang.
 * Resets the viewport scroll position whenever the route changes so page transitions behave like full page navigations.
 * Đặt lại vị trí cuộn của trang mỗi khi route thay đổi để chuyển trang có cảm giác giống một lần điều hướng trọn vẹn.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}