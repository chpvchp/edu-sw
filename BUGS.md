# 🐛 Bảng Báo Cáo Bugs — Branch `feat/flashcard`

**Branch:** `feat/flashcard`  
**Base branch:** `main`  
**Reviewer:** AI Agent (EduSW Code Review)  
**Ngày đánh giá:** 2026-09-05 (22h30)  
**Tổng số bug tìm thấy:** 10 (2 Critical, 4 Medium, 4 Low)

---

## 🔴 Critical — Phải fix trước khi merge vào `main`

| # | File | Dòng/Mô tả | Bug | Mô tả | Cách fix |
|---|------|-----------|-----|-------|----------|
| **B1** | `src/hooks/useFlashCard.ts`, `src/pages/DoFlashCardPage.tsx` | `useInfoFlashcard` không có xử lý `isLoading`/`isError` | **Error handling thiếu** | Page dùng `!flashcardInfo` để check null, nhưng nếu API fail thì `data` vẫn là `undefined` → hiển thị "Không thấy thông tin" thay vì "Máy chủ lỗi!". | Thêm guard `if (isError) return <p>Máy chủ lỗi!</p>` trong `DoFlashCardPage`. |
| **B2** | `src/pages/DoFlashCardPage.tsx`, JSON data | `order` state khởi tạo từ **0**, nhưng `card.order` trong JSON bắt đầu từ **1** | **Order/index lệch** | Logic `disableButtonBack = order === 0` dựa trên index mảng chứ không phải `order` thực tế. Nếu sau này sắp xếp lại mảng sẽ bị lệch. | Thống nhất dùng index mảng (0-based) hoặc dùng `card.order` (1-based) cho logic navigation. |

---

## 🟡 Medium — Nên fix trước khi release

| # | File | Dòng/Mô tả | Bug | Mô tả | Cách fix |
|---|------|-----------|-----|-------|----------|
| **M1** | `src/hooks/useFlashCard.ts` | 8, 44 | **Inconsistent error type giữa hooks** | `useListFlashCard` trả về `{ error: unknown }`, nhưng `useCards`/`useInfoFlashcard` trả về `{ isError: boolean }`. Consumer phải check khác nhau cho mỗi hook. | Thống nhất pattern: cả 2 hooks đều trả `{ error: unknown \| null }`. |
| **M2** | Multiple files | Various | **Console.log debug code còn sót** (4 file) | `FlashCard.tsx:7`, `CardFlashCard.tsx:8`, `DoFlashCardPage.tsx:16`, `FlashCardPage.tsx:21` — debug log vẫn còn trong production code. Vi phạm best practice, có thể leak info. | Xóa tất cả `console.log` trước khi merge/production. |
| **M3** | `src/api/flashcard.api.ts` | 5 | **Cache không có limit/TTL** | `flashCardCache = new Map()` — cache không bao giờ expire, không có size limit. Nếu user load nhiều flashcards khác nhau, memory sẽ tăng vô hạn trong session. | Thêm LRU cache hoặc size limit (ví dụ: Max 20 entries, hoặc TTL 30 phút). |
| **M4** | `src/pages/DoFlashCardPage.tsx` | 59–68 | **Render thừa CardFlashCard trong practice page** | Component info flashcard được render trong practice page nhưng không có tác dụng gì — user đang làm bài không cần xem lại card info. | Xóa component `CardFlashCard` khỏi `DoFlashCardPage`. |

---

## 🔵 Low — Cleanup và cải tiến nhỏ

| # | File | Dòng/Mô tả | Bug | Mô tả | Cách fix |
|---|------|-----------|-----|-------|----------|
| **L1** | `src/components/FlashCard.tsx` | 4, 7 | **`order` prop không được dùng trong UI** | Component destruct `order` từ props nhưng chỉ hiển thị `vocab`, `pos`, `ipa`, `mean`, `example`. Field `order` thừa. | Xóa `order` khỏi destructuring props hoặc dùng để hiển thị số thứ tự. |
| **L2** | `src/components/CardFlashCard.tsx` | 6, 25–28 | **Source field bị comment nhưng vẫn destructured** | Props nhận `source` nhưng field này bị comment ở dòng 25–28. Gây nhầm lẫn cho developer khác. | Bỏ `source` khỏi props hoặc uncomment + hiển thị source. |
| **L3** | `src/pages/FlashCardPage.tsx` | 31–42 | **Optional chaining redundant trên map** | `data?.map(...)` và `card?.id_flashcard` — `data` đã được guard bởi `if (isLoading)`, `if (error)` ở trên. Optional chaining không cần thiết. | Dùng `data.map((card) => ...)` trực tiếp, bỏ `?.` redundant. |
| **L4** | `src/pages/FlashCardPage.tsx` | 47–53 | **Dead code (commented FlashCard component)** | Block comment chứa `<FlashCard>` với props sai type (`data?.vocab` là string undefined). Gây nhiễu, dễ gây hiểu nhầm. | Xóa hoàn toàn block dead code. |

---

## 📊 Thống kê tổng quan

| Mức độ | Số lượng | Tỷ lệ |
|--------|----------|-------|
| 🔴 Critical | 2 | 20.0% |
| 🟡 Medium | 4 | 40.0% |
| 🔵 Low | 4 | 40.0% |
| **Tổng** | **10** | **100%** |

---

## ✅ Đã xác nhận hoạt động (không phải bug)

| Bug cũ | File | Lý do bác bỏ | Bằng chứng |
|--------|------|--------------|------------|
| CSS 3D utilities không tồn tại trong Tailwind v4 | `src/components/FlashCard.tsx` | **ĐÃ KIỂM TRA THỰC TẾ** — Các class `perspective-distant`, `transform-3d`, `backface-hidden`, `rotate-y-180` **HOẠT ĐỘNG BÌNH THƯỜNG** trong Tailwind CSS v4. Animation lật thẻ hoạt động đúng, không cần custom CSS thêm. | User đã thử nghiệm trực tiếp trên browser — flip animation hoạt động mượt mà, không có lỗi hiển thị |
| num_cards sai lệch thực tế | `public/data/flashcards/flashcard_templates.json` | **ĐÃ FIX** — File JSON hiện tại có đầy đủ 12 cards (order 1→12), khớp với `num_cards: 12`. Bug đã được tự động fix khi dữ liệu được cập nhật. | Kiểm tra thực tế file JSON — 12 object trong mảng `cards` ✅ |

---

## ✅ Bugs đã được fix (so với báo cáo trước)

| # | Bug cũ | Commit fix | Ghi chú |
|---|--------|------------|---------|
| 1 | `flashcard.api.ts` file rỗng 0 bytes | `ba0d36f`, `10aacf1` | Đã implement đầy đủ `getFlashCards` + `getCard` với caching |
| 2 | Hardcoded data trong `FlashCardPage` | `81c1962`, `bb79ef3` | Đã dùng hook `useListFlashCard` để load từ JSON |
| 3 | Thiếu fields trong type `Cards` | `01e8fb6`, `1f6bb46` | Type đã có đủ: `order`, `vocab`, `pos`, `ipa`, `mean`, `example` |
| 4 | Thiếu types cho data layer | `01e8fb6`, `1f6bb46` | Đã thêm `FlashCardData` type trong `flashcard.api.ts` |
| 5 | Label NavBar trùng "Bài Tập" | `14daa75` | Đã đổi thành "FlashCard" |
| 6 | num_cards sai lệch thực tế (B1) | — | JSON đã có đầy đủ 12 cards, khớp với `num_cards: 12`. Đã xóa khỏi danh sách bug. |

---

## 📌 Thứ tự ưu tiên sửa

### 🚨 P0 — Critical (Blocker merge)
1. **B1**: Thêm error handling cho `useInfoFlashcard` trong `DoFlashCardPage`
2. **P0b**: Xóa toàn bộ `console.log` — vi phạm lint rules

### ⚠️ P1 — High (Nên fix trước release)
3. **M1**: Thống nhất error type giữa các hooks
4. **M2**: Thêm cache limit/TTL cho `flashCardCache`
5. **M3**: Xóa render thừa `CardFlashCard` trong practice page

### 🧹 P2 — Low (Cleanup)
6. **L1–L4**: Cleanup dead code, redundant props, optional chaining
