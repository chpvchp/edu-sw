# Bảng Báo Cáo Các BUGS 2026-09-02

**Branch:** `feat/flashcard`  
**Base branch:** `main`  
**Reviewer:** AI Agent (EduSW Code Review)  
**Tổng số bug tìm thấy:** 9 (1 Critical, 3 High, 3 Medium, 2 Low)

---

| STT | Mức độ | File có bug | Bug | Mô tả bug |
|---|---|---|---|---|
| 1 | 🔴 **CRITICAL** | `src/api/flashcard.api.ts` | File rỗng 0 bytes | File được tạo bởi commit `2b38ff9 chore: add new flashcard.api.ts` nhưng hoàn toàn trống (0 dòng code). Không có function nào để load dữ liệu flashcard từ JSON. Feature flashcard **không thể hoạt động** vì không có API layer. |
| 2 | 🟡 **HIGH** | `src/pages/FlashCardPage.tsx` | Hardcoded data — disconnected với data layer | Dữ liệu flashcard được hardcode trực tiếp trong component (`const data = { vocab: "Artificial Intelligence", ... }`) thay vì load từ file JSON `public/data/flashcards/flashcard_templates.json`. File JSON tồn tại nhưng **không được sử dụng**. |
| 3 | 🟡 **HIGH** | `src/type/flashcard.type.ts` | Thiếu fields so với data thực tế | Type `FlashCardType` chỉ có 5 field (`vocab`, `pos`, `ipa`, `mean`, `example`) nhưng file JSON có thêm `id_flashcard`, `created`, `updated`. Khi load dữ liệu từ JSON, các field này bị **bỏ qua** (silent ignore) — tiềm ẩn lỗi type safety. |
| 4 | 🟡 **HIGH** | `src/type/flashcard.type.ts` | Thiếu types cho data layer | Không có type cho `FlashcardIndexItem` và `FlashcardData` — cần thiết để type-check khi load index.json và templates.json từ API. |
| 5 | 🟠 **MEDIUM** | `src/components/NavBar.tsx` | Label flashcard trùng với BaiTap | Dòng `{to: "/flashcard", label: "Bài Tập", icon: PlayingCardsFan}` — label `"Bài Tập"` **TRÙNG** với label của `/bai-tap`. Người dùng không phân biệt được hai trang này trên thanh navigation. |
| 6 | 🟠 **MEDIUM** | `src/components/FlashCard.tsx` | Thiếu accessibility (a11y) | Flashcard là interactive element nhưng thiếu: `role="button"`, `tabIndex={0}`, `aria-label`, `aria-pressed`, và keyboard handler (`onKeyDown`). Không thể sử dụng bằng bàn phím, không hỗ trợ screen reader. |
| 7 | 🟠 **MEDIUM** | `src/components/FlashCard.tsx` | Typo trong state name | State được đặt tên là `fliped` (thiếu chữ 'p') — đúng ra phải là `flipped`. Lỗi chính tả này gây khó khăn cho việc đọc code và bảo trì. |
| 8 | 🔵 **LOW** | `src/pages/FlashCardPage.tsx` | Optional chaining vô nghĩa | Sử dụng `data?.vocab`, `data?.pos`... nhưng `data` là object literal (không thể null/undefined). Optional chaining ở đây **vô nghĩa**, gây hiểu nhầm rằng data có thể null. |
| 9 | 🔵 **LOW** | `src/components/FlashCard.tsx` | Thiếu JSDoc song ngữ | Component `FlashCard` không có JSDoc comment — vi phạm quy tắc dự án yêu cầu định dạng song ngữ (tiếng Anh trước, tiếng Việt sau). |

---

## Thứ tự ưu tiên sửa, gợi ý

### 🚨 P0 — Critical: Phải fix trước khi merge vào `main`

#### Bug #1: Implement `src/api/flashcard.api.ts`
Tạo API module tương tự `exam.api.ts` với các function:
```typescript
// src/api/flashcard.api.ts
import { fetchJson } from "./api";
import type { FlashcardIndexItem, FlashcardData } from "../type/flashcard.type";

const FLASHCARDS_INDEX_PATH = "/data/flashcards/index.json";

export const getFlashcardIndex = async (): Promise<FlashcardIndexItem[]> =>
  fetchJson<FlashcardIndexItem[]>(FLASHCARDS_INDEX_PATH);

export const getFlashcardsByCategory = async (id: string): Promise<FlashcardData> =>
  fetchJson<FlashcardData>(`/data/flashcards/${id}.json`);
```

---

### ⚠️ P1 — High: Nên fix trước khi release

#### Bug #2: Load data từ JSON trong `FlashCardPage.tsx`
Thay vì hardcoded, dùng `useEffect` + API:
```typescript
import { useEffect, useState } from "react";
import FlashCard from "../components/FlashCard";
import type { FlashCardType } from "../type/flashcard.type";
import { getFlashcardsByCategory } from "../api/flashcard.api";

export default function FlashCardPage() {
  const [cards, setCards] = useState<FlashCardType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    getFlashcardsByCategory("flashcard_templates")
      .then(data => setCards(data.cards))
      .catch(err => console.error("Failed to load flashcards:", err));
  }, []);

  if (cards.length === 0) return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;

  return (
    <main className="min-h-screen flex-1 flex flex-col justify-center items-center p-4">
      <FlashCard {...cards[currentIndex]} />
      {/* Navigation buttons */}
    </main>
  );
}
```

#### Bug #3: Bổ sung fields vào `FlashCardType`
```typescript
export type FlashCardType = {
  id_flashcard?: string;
  vocab: string;
  pos: string;
  ipa: string;
  mean: string;
  example: string;
}

export type FlashcardIndexItem = {
  id_flashcard: string;
  name_exam: string;
  updated: string;
  created: string;
}

export type FlashcardData = {
  id_flashcard: string;
  name_exam: string;
  updated: string;
  created: string;
  cards: FlashCardType[];
}
```

---

### 📝 P2 — Medium: Fix trong sprint tiếp theo

#### Bug #5: Sửa label NavBar
```diff
- {to: "/flashcard", label: "Bài Tập", icon: PlayingCardsFan},
+ {to: "/flashcard", label: "Flashcard", icon: PlayingCardsFan},
```

#### Bug #6: Thêm accessibility
```tsx
<div
  className="..."
  role="button"
  tabIndex={0}
  aria-label={`Flashcard: ${vocab}. Press space to flip.`}
  aria-pressed={flipped}
  onClick={() => setFlip(!flipped)}
  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setFlip(!flipped); } }}
>
```

#### Bug #7: Fix typo
```diff
- const [fliped, setFlip] = useState(false);
+ const [flipped, setFlipped] = useState(false);
  // ...
- ${fliped ? "rotate-y-180": ""}
+ ${flipped ? "rotate-y-180": ""}
```

---

### 🧹 P3 — Low: Cleanup và cải tiến nhỏ

#### Bug #8: Xóa optional chaining vô nghĩa
```diff
- vocab={data?.vocab}
- pos={data?.pos}
+ vocab={data.vocab}
+ pos={data.pos}
```

#### Bug #9: Thêm JSDoc cho FlashCard component
```tsx
/**
 * FlashCard | thẻ từ vựng lật được.
 * Displays a vocabulary word on the front and its meaning on the back, with a 3D flip animation on click.
 * Hiển thị từ vựng ở mặt trước và nghĩa ở mặt sau, có hiệu ứng lật 3D khi click.
 */
export default function FlashCard({ vocab, pos, ipa, mean, example }: FlashCardType) { ... }
```

---

## Thống kê tổng quan

| Mức độ | Số lượng | Tỷ lệ |
|---|---|---|
| 🔴 Critical | 1 | 11.1% |
| 🟡 High | 3 | 33.3% |
| 🟠 Medium | 3 | 33.3% |
| 🔵 Low | 2 | 22.2% |
| **Tổng** | **9** | **100%** |

---

## ✅ Đã bác bỏ (không phải bug)

| STT cũ | File | Lý do bác bỏ | Bằng chứng |
|---|---|---|---|
| 2 | `src/components/FlashCard.tsx` | CSS 3D utilities **TỒN TẠI** trong Tailwind v4 | Build output xác nhận: `.perspective-distant{perspective:var(--perspective-distant)}`, `.transform-3d{transform-style:preserve-3d}`, `.backface-hidden{backface-visibility:hidden}`, `.rotate-y-180{--tw-rotate-y:rotateY(180deg);transform:...}` — tất cả đều được generate đúng trong `dist/assets/*.css` |
| 3 | `src/components/FlashCard.tsx` | `aspect-2/1` **TỒN TẠI** trong Tailwind v4 | Build output xác nhận: `.aspect-2\/1,.aspect-\[2\/1\]{aspect-ratio:2}` — được generate đúng, hoạt động bình thường |

---

## Đánh giá tổng thể

| Tiêu chí | Điểm (1-10) | Ghi chú |
|---|---|---|
| Kiến trúc | 6/10 | Phân tách layer rõ ràng nhưng API layer chưa implement |
| Code quality | 7/10 | TypeScript đúng, naming conventions tốt, CSS utilities Tailwind v4 hoạt động đúng |
| Khả năng hoạt động | 3/10 | **Không thể chạy** — API rỗng = feature broken (CSS 3D đã OK) |
| Accessibility | 3/10 | Không hỗ trợ keyboard navigation và screen reader |
| Data layer | 4/10 | JSON data tồn tại nhưng không được load bởi component |
| UX Potential | 7/10 | Ý tưởng flashcard flip tốt, animation 3D hoạt động đúng, cần thêm navigation giữa các cards |

**Khuyến nghị:** Không merge vào `main` cho đến khi fix ít nhất 2 bug P0 (implement API + load data từ JSON).
