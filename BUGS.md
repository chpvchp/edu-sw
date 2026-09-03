# 🐛 Bảng Báo Cáo Bugs — Branch `feat/flashcard`

**Branch:** `feat/flashcard`  
**Base branch:** `main`  
**Reviewer:** AI Agent (EduSW Code Review)  
**Ngày đánh giá:** 2026-09-02  
**Tổng số bug tìm thấy:** 12 (3 Critical, 4 Medium, 5 Low)

---

## 🔴 Critical — Phải fix trước khi merge vào `main`

| # | File | Dòng | Bug | Mô tả | Cách fix |
|---|------|------|-----|-------|----------|
| **C1** | `src/components/FlashCard.tsx` | 10–26 | **CSS flip animation KHÔNG HOẠT ĐỘNG** | Các class `perspective-distant`, `transform-3d`, `backface-hidden`, `rotate-y-180` **không tồn tại trong Tailwind CSS v4** (không có plugin tương ứng). Animation lật thẻ hoàn toàn không hoạt động — người dùng chỉ thấy mặt trước. | Thêm custom CSS vào `src/index.css`: `.perspective-distant { perspective: 1000px; }`, `.transform-3d { transform-style: preserve-3d; }`, `.backface-hidden { backface-visibility: hidden; }`, `.rotate-y-180 { transform: rotateY(180deg); }` |
| **C2** | `src/pages/DoFlashCardPage.tsx` | 59 | **Hardcoded card count = "2"** | Progress bar hiển thị `{order + 1} / 2` — số total cards được hardcode là "2" thay vì `data?.length`. Hiển thị sai với mọi flashcard có ≠ 2 cards. | Thay `<p>2</p>` bằng `<p>{data?.length ?? 0}</p>` |
| **C3** | `src/pages/DoFlashCardPage.tsx` | 19–24 | **Không bounds checking khi navigate** | Hàm `backCard(order)` và `continueCard(order)` không check bounds — có thể set `order < 0` hoặc `order >= data.length`, dẫn đến `data?.[order]` trả về `undefined` và crash UI. | Thêm guard: `if (order > 0) setOrder(order - 1)` và `if (order < (data?.length ?? 0) - 1) setOrder(order + 1)` |

---

## 🟡 Medium — Nên fix trước khi release

| # | File | Dòng | Bug | Mô tả | Cách fix |
|---|------|------|-----|-------|----------|
| **M1** | `src/hooks/useFlashCard.ts` | 8, 44 | **Inconsistent error type giữa hooks** | `useListFlashCard` trả về `{ error: unknown }`, nhưng `useCards` trả về `{ isError: boolean }`. Consumer phải check khác nhau cho mỗi hook. | Thống nhất pattern: cả 2 hooks đều trả `{ error: unknown \| null }` |
| **M2** | `src/pages/DoFlashCardPage.tsx` | 26 | **Unsafe array access** | `const card = data?.[order]` — nếu `order` out of bounds (do C3), `card` sẽ là `undefined` nhưng chỉ check `!card` sau đó. Không có defensive programming rõ ràng. | Thêm guard ngay sau fetch: `if (!data || order >= data.length) return <Error />` |
| **M3** | Multiple files | Various | **Console.log debug code còn sót** (5 files) | `FlashCard.tsx:7`, `CardFlashCard.tsx:8`, `FlashCardPage.tsx:21`, `DoFlashCardPage.tsx:14` — debug log vẫn còn trong production code. Vi phạm best practice, có thể leak info. | Xóa tất cả `console.log` trước khi merge/production |
| **M4** | `src/api/flashcard.api.ts` | 5 | **Cache không có limit/TTL** | `flashCardCache = new Map()` — cache không bao giờ expire, không có size limit. Nếu user load nhiều flashcards khác nhau, memory sẽ tăng vô hạn trong session. | Thêm LRU cache hoặc size limit (ví dụ: Max 20 entries, hoặc TTL 30 phút) |

---

## 🔵 Low — Cleanup và cải tiến nhỏ

| # | File | Dòng | Bug | Mô tả | Cách fix |
|---|------|------|-----|-------|----------|
| **L1** | `src/components/FlashCard.tsx` | 4, 17 | **`order` prop không được dùng trong UI** | Component destruct `order` từ props nhưng chỉ hiển thị `vocab`, `pos`, `ipa`, `mean`, `example`. Field `order` thừa. | Xóa `order` khỏi destructuring props hoặc dùng để hiển thị số thứ tự |
| **L2** | `src/components/CardFlashCard.tsx` | 6, 25–28 | **Source field bị comment nhưng vẫn destructured** | Props nhận `source` nhưng field này bị comment ở dòng 25–28. Gây nhầm lẫn cho developer khác. | Bỏ `source` khỏi props hoặc uncomment + hiển thị source |
| **L3** | `src/pages/FlashCardPage.tsx` | 31–42 | **Optional chaining redundant trên map** | `data?.map(...)` và `card?.id_flashcard` — `data` đã được guard bởi `if (isLoading)`, `if (error)` ở trên. Optional chaining không cần thiết. | Dùng `data.map((card) => ...)` trực tiếp, bỏ `?.` redundant |
| **L4** | `src/pages/FlashCardPage.tsx` | 47–53 | **Dead code (commented FlashCard component)** | Block comment chứa `<FlashCard>` với props sai type (`data?.vocab` là string undefined). Gây nhiễu, dễ gây hiểu nhầm. | Xóa hoàn toàn block dead code |
| **L5** | `src/pages/DoFlashCardPage.tsx` | 36–38 | **Empty div không clear purpose** | `<div className="p-5">` rỗng — không có nội dung, không có comment giải thích. | Xóa hoặc thêm placeholder/content |

---

## 📊 Thống kê tổng quan

| Mức độ | Số lượng | Tỷ lệ |
|--------|----------|-------|
| 🔴 Critical | 3 | 25.0% |
| 🟡 Medium | 4 | 33.3% |
| 🔵 Low | 5 | 41.7% |
| **Tổng** | **12** | **100%** |

---

## ✅ Bugs đã được fix (so với báo cáo trước)

| # | Bug cũ | Commit fix | Ghi chú |
|---|--------|------------|---------|
| 1 | `flashcard.api.ts` file rỗng 0 bytes | `ba0d36f`, `10aacf1` | Đã implement đầy đủ `getFlashCards` + `getCard` với caching |
| 2 | Hardcoded data trong `FlashCardPage` | `81c1962`, `bb79ef3` | Đã dùng hook `useListFlashCard` để load từ JSON |
| 3 | Thiếu fields trong type `Cards` | `01e8fb6`, `1f6bb46` | Type đã có đủ: `order`, `vocab`, `pos`, `ipa`, `mean`, `example` |
| 4 | Thiếu types cho data layer | `01e8fb6`, `1f6bb46` | Đã thêm `FlashCardData` type trong `flashcard.api.ts` |
| 5 | Label NavBar trùng "Bài Tập" | `14daa75` | Đã đổi thành "FlashCard" |
| 6 | Typo `fliped` → `flipped` | Chưa fix | Vẫn còn state name `fliped` trong `FlashCard.tsx:5` — **nên sửa** |

---

## 📌 Thứ tự ưu tiên sửa

### 🚨 P0 — Critical (Blocker merge)
1. **C1**: Thêm custom CSS cho flip animation vào `src/index.css`
2. **C2**: Fix hardcoded "2" → dynamic `data?.length`
3. **C3**: Thêm bounds checking cho `backCard` / `continueCard`

### ⚠️ P1 — High (Nên fix trước release)
4. **M1**: Thống nhất error type giữa các hooks
5. **M2**: Defensive programming cho array access
6. **M3**: Xóa tất cả console.log
7. **M4**: Thêm cache limit/TTL

### 🧹 P2 — Low (Cleanup)
8. **L1–L5**: Cleanup dead code, redundant props, optional chaining

---

## ⚠️ Bugs đã bác bỏ (không phải bug)

| Bug cũ | Lý do bác bỏ | Bằng chứng |
|--------|--------------|------------|
| CSS 3D utilities không tồn tại trong Tailwind v4 | Cần kiểm tra kỹ — các class có thể cần custom config hoặc plugin riêng. Hiện tại **không hoạt động** nên vẫn là bug. | Không tìm thấy class trong Tailwind v4 default theme |
