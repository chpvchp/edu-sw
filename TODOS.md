# ✅ TODO — Branch `feat/flashcard`

**Branch:** `feat/flashcard`  
**Base branch:** `main`  
**Tổng hợp từ:** BUGS.md + REPORT.md  
**Ngày tạo:** 2026-09-  

---

## 🚨 P0 — Critical (Blocker merge)

> Phải fix xong trước khi merge vào `main`.

| # | ID | File(s) | Mô tả | Trạng thái |
|---|----|---------|-------|------------|
| 1 | **B1** | `src/hooks/useFlashCard.ts`, `src/pages/DoFlashCardPage.tsx` | Thêm error handling cho `useInfoFlashcard` — page dùng `!flashcardInfo` để check null, nhưng nếu API fail thì hiển thị "Không thấy thông tin" thay vì "Máy chủ lỗi!" | ⬜ Pending |
| 2 | **B2** | `src/pages/DoFlashCardPage.tsx`, JSON data | Thống nhất logic navigation: `order` state (0-based) vs `card.order` trong JSON (1-based). Hiện tại `disableButtonBack = order === 0` dựa trên index mảng. | ⬜ Pending |

---

## ⚠️ P1 — High (Nên fix trước release)

> Nên hoàn thành trước khi release, không blocker merge nhưng ảnh hưởng UX/quality.

| # | ID | File(s) | Mô tả | Trạng thái |
|---|----|---------|-------|------------|
| 3 | **M1** | `src/hooks/useFlashCard.ts` | Thống nhất error type giữa các hooks: `useListFlashCard` trả `{ error: unknown }`, nhưng `useCards`/`useInfoFlashcard` trả `{ isError: boolean }`. Nên dùng chung pattern `{ error: unknown \| null }`. | ⬜ Pending |
| 4 | **M2** | `src/components/FlashCard.tsx`, `src/components/CardFlashCard.tsx`, `src/pages/DoFlashCardPage.tsx`, `src/pages/FlashCardPage.tsx` | Xóa toàn bộ `console.log` debug code còn sót (4 file). Vi phạm best practice, có thể leak info. | ⬜ Pending |
| 5 | **M3** | `src/api/flashcard.api.ts` | Thêm cache limit/TTL cho `flashCardCache`. Hiện tại Map vô hạn → memory leak risk khi user load nhiều flashcards khác nhau. Đề xuất: Max 20 entries hoặc TTL 30 phút. | ⬜ Pending |
| 6 | **M4** | `src/pages/DoFlashCardPage.tsx` | Xóa render thừa `CardFlashCard` trong practice page — component info không có tác dụng khi user đang làm bài. | ⬜ Pending |
| 7 | **P1-Perf** | `src/hooks/useFlashCard.ts`, `src/api/flashcard.api.ts` | Thêm `AbortController` vào useEffect cleanup để hủy request cũ khi navigate nhanh giữa các route. | ⬜ Pending |

---

## 🧹 P2 — Low (Cleanup và cải tiến)

> Cleanup, refactor nhỏ, enhancement không ảnh hưởng chức năng chính.

| # | ID | File(s) | Mô tả | Trạng thái |
|---|----|---------|-------|------------|
| 8 | **L1** | `src/components/FlashCard.tsx` | Xóa prop `order` khỏi destructuring — không được dùng trong UI. Hoặc dùng để hiển thị số thứ tự. | ⬜ Pending |
| 9 | **L2** | `src/components/CardFlashCard.tsx` | Bỏ `source` khỏi props hoặc uncomment + hiển thị source field (hiện bị comment dòng 25–28). | ⬜ Pending |
| 10 | **L3** | `src/pages/FlashCardPage.tsx` | Xóa optional chaining redundant: `data?.map(...)` và `card?.id_flashcard` — đã được guard bởi `if (isLoading)`, `if (error)` ở trên. Dùng `data.map((card) => ...)` trực tiếp. | ⬜ Pending |
| 11 | **L4** | `src/pages/FlashCardPage.tsx` | Xóa dead code: block comment chứa `<FlashCard>` với props sai type (dòng 47–53). | ⬜ Pending |

---

## 🏗️ Kiến trúc & Cải tiến (Architecture)

> Các vấn đề kiến trúc lớn hơn, có thể cân nhắc khi refactor.

| # | ID | Mô tả | Đề xuất | Trạng thái |
|---|----|-------|---------|------------|
| 12 | **A1** | `useInfoFlashcard` trả về `FlashCardData` (gồm cả `cards[]`) nhưng chỉ dùng metadata. | Tách API: `getInfoFlashcard` chỉ fetch metadata, không cần load `cards`. | ⬜ Pending |
| 13 | **A2** | Không có Error Boundary — nếu FlashCard throw lỗi (vd: missing field), toàn bộ page crash trắng. | Thêm Error Boundary wrapper cho flashcard section. | ⬜ Pending |
| 14 | **A5** | Key prop không tối ưu: `key={card?.order}` — optional chaining trên key có thể gây warning React khi value là `undefined`. | Dùng `key={card.order}` (guaranteed non-null). | ⬜ Pending |
| 15 | **A6** | `useCards` re-fetch mỗi lần id thay đổi, nhưng nếu user bấm Back → Forward cùng ID sẽ fetch lại thay vì dùng cache từ API layer. | Hook nên check cache trước khi gọi API, hoặc API layer trả về luôn cached data synchronously. | ⬜ Pending |

---

## 🎨 UX & Accessibility

> Cải thiện trải nghiệm người dùng và khả năng tiếp cận.

| # | ID | Mô tả | Đề xuất | Trạng thái |
|---|----|-------|---------|------------|
| 16 | **UX-1** | Không có keyboard navigation trong practice page. | Hỗ trợ phím ← → để chuyển card, Space để flip. | ⬜ Pending |
| 17 | **UX-2** | FlashCard component thiếu accessibility attributes. | Thêm `role="button"`, `tabIndex={0}`, `aria-label`, keyboard handler (Enter/Space). | ⬜ Pending |
| 18 | **UX-3** | Không có Suspense/Loading skeleton — chỉ hiện text "Đang tải đề...". | Thêm skeleton loader giống `CardExam`. | ⬜ Pending |

---

## 📊 Data & Types

> Cải thiện data layer và TypeScript types.

| # | ID | Mô tả | Đề xuất | Trạng thái |
|---|----|-------|---------|------------|
| 19 | **D1** | `Cards` type thiếu field `id` cho unique identification. | Thêm `id: string` vào type `Cards`. | ⬜ Pending |
| 20 | **D2** | Không có runtime validation (Zod, Yup, ...) — dữ liệu JSON sai format sẽ crash runtime. | Thêm Zod/Yup validation khi load JSON data. | ⬜ Pending |

---

## 📋 Checklist trước merge

### P0 — Bắt buộc
- [ ] **B1**: Thêm error handling cho `useInfoFlashcard` trong `DoFlashCardPage`
- [ ] **B2**: Thống nhất logic navigation (order/index)

### P1 — Khuyến nghị
- [ ] **M1**: Thống nhất error type giữa các hooks
- [ ] **M2**: Xóa toàn bộ `console.log`
- [ ] **M3**: Thêm cache limit/TTL cho `flashCardCache`
- [ ] **M4**: Xóa render thừa `CardFlashCard` trong practice page
- [ ] **P1-Perf**: Thêm `AbortController`

### P2 — Cleanup
- [ ] **L1–L4**: Cleanup dead code, redundant props, optional chaining

### Quality gates
- [ ] `npm run lint` → 0 warnings, 0 errors
- [ ] `tsc --noEmit` → 0 errors
- [ ] Test trên mobile (responsive grid)
- [ ] Test với flashcard có > 2 cards
- [ ] CSS flip animation hoạt động ✅ (Đã xác nhận 2026-09-03 23h30 — Chrome, Firefox, Safari)

---

## 📌 Thứ tự ưu tiên thực hiện

```
P0 → P1 → P2 → Architecture → UX → Data/Types
 │      │      │         │          │        │
 ├─ B1  ├─ M1  ├─ L1    ├─ A1      ├─ UX-1 ├─ D1
 ├─ B2  ├─ M2  ├─ L2    ├─ A2      ├─ UX-2 ├─ D2
         ├─ M3  ├─ L3    ├─ A5      ├─ UX-3 │
         ├─ M4  ├─ L4    ├─ A6      │        │
         └─P1   └───────  └────────  └────────┘
```

---

## 📝 Ghi chú

### ✅ Bugs đã được fix (so với báo cáo trước)
| # | Bug cũ | Commit fix | Ghi chú |
|---|--------|------------|---------|
| 1 | `flashcard.api.ts` file rỗng 0 bytes | `ba0d36f`, `10aacf1` | Đã implement đầy đủ `getFlashCards` + `getCard` với caching |
| 2 | Hardcoded data trong `FlashCardPage` | `81c1962`, `bb79ef3` | Đã dùng hook `useListFlashCard` để load từ JSON |
| 3 | Thiếu fields trong type `Cards` | `01e8fb6`, `1f6bb46` | Type đã có đủ: `order`, `vocab`, `pos`, `ipa`, `mean`, `example` |
| 4 | Thiếu types cho data layer | `01e8fb6`, `1f6bb46` | Đã thêm `FlashCardData` type trong `flashcard.api.ts` |
| 5 | Label NavBar trùng "Bài Tập" | `14daa75` | Đã đổi thành "FlashCard" |

### ✅ Đã xác nhận hoạt động (không phải bug)
| Bug cũ | File | Lý do bác bỏ | Bằng chứng |
|--------|------|--------------|------------|
| CSS 3D utilities không tồn tại trong Tailwind v4 | `src/components/FlashCard.tsx` | **ĐÃ KIỂM TRA THỰC TẾ** — Các class hoạt động bình thường trong Tailwind CSS v4. Animation lật thẻ hoạt động đúng, không cần custom CSS thêm. | User đã thử nghiệm trực tiếp trên browser — flip animation hoạt động mượt mà |
| num_cards sai lệch thực tế | `public/data/flashcards/flashcard_templates.json` | **ĐÃ FIX** — File JSON hiện tại có đầy đủ 12 cards (order 1→12), khớp với `num_cards: 12`. | Kiểm tra thực tế file JSON — 12 object trong mảng `cards` ✅ |
