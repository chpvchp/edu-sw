/**
 * fetchJson | tải JSON.
 * Reads a JSON asset from public space and converts it into the requested type, so the app can work without any backend service.
 * Đọc một file JSON từ thư mục public và ép về kiểu dữ liệu mong muốn, giúp ứng dụng hoạt động hoàn toàn không cần backend.
 */
export async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Không thể tải dữ liệu: ${path}`);
  }

  return response.json() as Promise<T>;
}