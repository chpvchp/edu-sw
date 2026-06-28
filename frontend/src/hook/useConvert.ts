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