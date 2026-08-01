/**
 * ConvertDate | chuyển đổi ngày giờ.
 * Formats a raw date string into a Vietnamese locale timestamp for display in exam cards and result summaries.
 * Định dạng chuỗi ngày giờ thô thành mốc thời gian theo locale Việt Nam để hiển thị trên thẻ bài tập và phần tổng kết kết quả.
 */
export const ConvertDate = (date: string) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleString("vi-VN",{
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).slice(0, 19);
};