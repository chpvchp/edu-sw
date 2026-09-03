# ✅ Danh sách Task — Branch `feat/flashcard`

**Branch:** `feat/flashcard`  
**Ngày tạo:** 2026-09-02  
**Tổng số task:** 18 (3 P0, 5 P1, 4 P2, 6 P3)

---

## 🚨 P0 — Critical (Blocker merge vào `main`)

### [P0-1] Fix CSS flip animation cho FlashCard component
- **File:** `src/index.css`, `src/components/FlashCard.tsx`
- **Mô tả:** Các class `perspective-distant`, `transform-3d`, `backface-hidden`, `rotate-y-180` không tồn tại trong Tailwind v4 default. Animation lật thẻ không hoạt động.
- **Action:** Thêm custom CSS vào `src/index.css`:
  ```css
  .perspective-distant { perspective: 1000px; }
  .transform-3d { transform-style: preserve-3d; }
  .backface-hidden { backface-visibility: hidden; }
  .rotate-y-180 { transform: rotateY(180deg); }
  ```
- **Estimate:** 15 phút

### [P0-2] Fix hardcoded card count trong DoFlashCardPage
- **File:** `src/pages/DoFlashCardPage.tsx` (dòng 59)
- **Mô tả:** Progress hiển thị `{order + 1} / 2` — số total cards hardcode sai.
- **Action:** Thay `<p>2</p>` bằng `<p>{data?.length ?? 0}</p>`
- **Estimate:** 5 phút

### [P0-3] Thêm bounds checking cho navigation buttons
- **File:** `src/pages/DoFlashCardPage.tsx` (dòng 19–24)
- **Mô tả:** `backCard()` và `continueCard()` không check bounds → có thể navigate ra ngoài array.
- **Action:** Thêm guard conditions:
  ```tsx
  function backCard() {
    if (order > 0) setOrder(order - 1);
  }
  function continueCard() {
    if (order < (data?.length ?? 0) - 1) setOrder(order + 1);
  }
  ```
- **Estimate:** 15 phút

---

## ⚠️ P1 — High (Nên fix trước release)

### [P1-1] Thống nhất error type pattern giữa các hooks
- **File:** `src/hooks/useFlashCard.ts`
- **Mô tả:** `useListFlashCard` trả `{ error: unknown }`, `useCards` trả `{ isError: boolean }`.
- **Action:** Đổi `useCards` trả về `{ error: unknown \| null }` thay vì `isError: boolean`. Update consumer ở `DoFlashCardPage.tsx`.
- **Estimate:** 20 phút

### [P1-2] Defensive programming cho array access
- **File:** `src/pages/DoFlashCardPage.tsx` (dòng 26)
- **Mô tả:** `data?.[order]` có thể undefined nếu order out of bounds.
- **Action:** Thêm guard ngay sau fetch hook:
  ```tsx
  if (!data || data.length === 0 || order >= data.length) {
    return <p className="p-4 mx-auto">Không tìm thấy thẻ!</p>;
  }
  ```
- **Estimate:** 10 phút

### [P1-3] Xóa tất cả console.log debug code
- **Files:** `src/components/FlashCard.tsx:7`, `src/components/CardFlashCard.tsx:8`, `src/pages/FlashCardPage.tsx:21`, `src/pages/DoFlashCardPage.tsx:14`
- **Mô tả:** 5 file còn debug log — vi phạm best practice production.
- **Action:** Xóa toàn bộ `console.log(...)` trong các file trên.
- **Estimate:** 10 phút

### [P1-4] Thêm cache limit/TTL cho flashcard API
- **File:** `src/api/flashcard.api.ts` (dòng 5)
- **Mô tả:** `Map` cache không giới hạn → memory leak nếu load nhiều flashcards.
- **Action:** Implement LRU cache hoặc size limit:
  ```typescript
  const MAX_CACHE_SIZE = 20;
  const CACHE_TTL_MS = 30 * 60 * 1000; // 30 phút
  ```
- **Estimate:** 30 phút

### [P1-5] Thêm retry mechanism khi fetch fail
- **File:** `src/hooks/useFlashCard.ts`
- **Mô tả:** Không có retry khi network error → user phải reload trang.
- **Action:** Thêm retry logic (3 lần, delay tăng dần) trong cả 2 hooks.
- **Estimate:** 30 phút

---

## 📝 P2 — Medium (Cleanup và cải tiến)

### [P2-1] Fix typo `fliped` → `flipped`
- **File:** `src/components/FlashCard.tsx` (dòng 5, 13)
- **Mô tả:** State name thiếu chữ 'p' — gây khó đọc code.
- **Action:** Đổi `fliped` → `flipped`, `setFlip` → `setFlipped`.
- **Estimate:** 5 phút

### [P2-2] Xóa dead code trong FlashCardPage
- **File:** `src/pages/FlashCardPage.tsx` (dòng 47–53)
- **Mô tả:** Block comment chứa `<FlashCard>` với props sai type — dead code gây nhiễu.
- **Action:** Xóa hoàn toàn block dead code.
- **Estimate:** 5 phút

### [P2-3] Cleanup redundant optional chaining
- **File:** `src/pages/FlashCardPage.tsx` (dòng 31–42)
- **Mô tả:** `data?.map(...)` và `card?.id_flashcard` — data đã được guard bởi isLoading/error check.
- **Action:** Đổi thành `data.map((card) => ...)` và `card.id_flashcard`.
- **Estimate:** 5 phút

### [P2-4] Xóa empty div trong DoFlashCardPage
- **File:** `src/pages/DoFlashCardPage.tsx` (dòng 36–38)
- **Mô tả:** `<div className="p-5">` rỗng, không clear purpose.
- **Action:** Xóa hoặc thêm placeholder content.
- **Estimate:** 5 phút

---

## 🧹 P3 — Low (Enhancement và best practice)

### [P3-1] Thêm keyboard navigation cho FlashCard
- **File:** `src/components/FlashCard.tsx`
- **Mô tả:** Flashcard là interactive element nhưng không hỗ trợ bàn phím.
- **Action:** Thêm `role="button"`, `tabIndex={0}`, `onKeyDown` handler.
- **Estimate:** 20 phút

### [P3-2] Thêm keyboard navigation cho DoFlashCardPage
- **File:** `src/pages/DoFlashCardPage.tsx`
- **Mô tả:** Không hỗ trợ phím ← → để chuyển card, Space để flip.
- **Action:** Thêm global `useEffect` listener cho arrow keys và spacebar.
- **Estimate:** 20 phút

### [P3-3] Wrap FlashCard component với React.memo
- **File:** `src/components/FlashCard.tsx`
- **Mô tả:** Component re-render toàn bộ mỗi khi flip — có thể optimize.
- **Action:** Export `React.memo(FlashCard)` để tránh re-render không cần thiết.
- **Estimate:** 10 phút

### [P3-4] Thêm AbortController cho fetch trong hooks
- **File:** `src/hooks/useFlashCard.ts`
- **Mô tả:** Fetch không abort khi component unmount → waste network.
- **Action:** Thêm `AbortController` trong useEffect cleanup.
- **Estimate:** 20 phút

### [P3-5] Bổ sung field `id` vào type `Cards`
- **File:** `src/type/flashcard.type.ts`
- **Mô tả:** Không có unique identifier cho từng card — khó cho future features (bookmark, progress tracking).
- **Action:** Thêm `id?: string` vào type `Cards`.
- **Estimate:** 5 phút

### [P3-6] Thêm sample data để test đa dạng
- **File:** `public/data/flashcards/`
- **Mô tả:** Chỉ có 1 template với 2 cards — chưa đủ để test edge cases.
- **Action:** Tạo thêm 2–3 flashcard templates với số lượng cards khác nhau (5, 10, 20).
- **Estimate:** 30 phút

---

## 📊 Tổng hợp estimate

| Priority | Số task | Tổng estimate |
|----------|---------|---------------|
| 🚨 P0 | 3 | ~35 phút |
| ⚠️ P1 | 5 | ~1h 45 phút |
| 📝 P2 | 4 | ~20 phút |
| 🧹 P3 | 6 | ~1h 25 phút |
| **Tổng** | **18** | **~4h 25 phút** |

---

## 📋 Checklist trước merge

- [ ] P0-1: CSS flip animation hoạt động
- [ ] P0-2: Card count hiển thị đúng
- [ ] P0-3: Bounds checking hoạt động
- [ ] P1-3: Không còn console.log
- [ ] `npm run lint` → 0 warnings, 0 errors
- [ ] `tsc --noEmit` → 0 errors
- [ ] Test trên mobile (responsive)
- [ ] Test với flashcard có > 2 cards
