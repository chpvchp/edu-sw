# 📊 BÁO CÁO ĐÁNH GIÁ CHI TIẾT — Branch `feat/flashcard`

**Branch:** `feat/flashcard`  
**Base branch:** `main`  
**Reviewer:** AI Agent (EduSW Code Review)  
**Ngày đánh giá:** 2026-09-02  
**Tổng số commits so với main:** 15+  
**Lines changed:** +592 / −20

---

## 1. Tổng quan Commits

| STT | Commit | Type | Mô tả |
|-----|--------|------|-------|
| 1 | `1f6bb46` | feat(hook) | Thêm `useCards`, thay đổi type |
| 2 | `416b69c` | fix | Fix type Cards |
| 3 | `16d78a7` | refactor | Đổi từ component sang Link |
| 4 | `10aacf1` | feat(api) | Update `flashcard.api.ts` |
| 5 | `c84722c` | feat(route) | Thêm route `flashcard/:id_flashcard` → `DoFlashCardPage` |
| 6 | `81c1962` | feat(page) | Thêm `DoFlashCardPage.tsx` |
| 7 | `bd07d09` | data | Update templates |
| 8 | `14daa75` | fix | Fix name route `/flashcard` từ `Bai Tap` → `FlashCard` |
| 9 | `2409068` | component | Thêm `CardFlashCard.tsx`, update `FlashCardPage.tsx` |
| 10 | `bb79ef3` | hook | Thêm `useFlashCard.ts` |
| 11 | `ba0d36f` | api | Thêm API FlashCard |
| 12 | `01e8fb6` | type | Update type FlashCard |
| 13 | `a87fbf3` | data | Update templates data flashcard |
| 14 | `2c4c94f` | feat(ui) | Thêm `FlashCard` reusable component, update `FlashCardPage` |
| 15 | `a95cf5e` | feat | Thêm route và `FlashCardPage` |

---

## 2. Kiến trúc (Architecture)

| Tiêu chí | Đánh giá | Ghi chú |
|----------|----------|---------|
| **Separation of Concerns** | ✅ Tốt | Phân lớp rõ ràng: `type/` → `api/` → `hooks/` → `components/` → `pages/` → `routes/` |
| **Pattern consistency với exam module** | ✅ Tốt | `flashcard.api.ts` follow cùng pattern caching với `exam.api.ts` (Map cache + `fetchJson`) |
| **Static-site friendly** | ✅ Tốt | Không cần backend, data load từ JSON trong `/public/data/flashcards/` |
| **Routing structure** | ✅ Tốt | Route nesting hợp lý: `/flashcard` → list, `/flashcard/:id/practice` → practice |
| **Data model** | ⚠️ Trung bình | 2-level (index.json + {id}.json) giống exam module — phù hợp nhưng thiếu cơ chế versioning |

### Cấu trúc file mới thêm

```
src/
├── api/
│   ├── api.ts                    # fetchJson abstraction (NEW)
│   └── flashcard.api.ts          # FlashCard API layer (NEW)
├── components/
│   ├── CardFlashCard.tsx         # List item card (NEW)
│   └── FlashCard.tsx             # Reusable flip card (NEW)
├── hooks/
│   └── useFlashCard.ts           # Custom hooks (NEW)
├── pages/
│   ├── FlashCardPage.tsx         # List page (NEW)
│   └── DoFlashCardPage.tsx       # Practice page (NEW)
├── routes/
│   └── AppRoutes.tsx             # Updated: thêm 2 flashcard routes
└── type/
    └── flashcard.type.ts         # Type definitions (NEW)

public/data/flashcards/
├── index.json                    # Metadata list (NEW)
└── flashcard_templates.json      # Full card data (NEW)
```

---

## 3. Cấu trúc dữ liệu & Types

### `src/type/flashcard.type.ts`

```typescript
export type Cards = {
  order: number;
  vocab: string;
  pos: string;
  ipa: string;
  mean: string;
  example: string;
}

export type FlashCard = {
  id_flashcard: string;
  name_flashcard: string;
  language: string;
  num_cards: number;
  updated: string;
  created: string;
  source: string;
}
```

| Tiêu chí | Đánh giá | Ghi chú |
|----------|----------|---------|
| **Type completeness** | ⚠️ Thiếu | `Cards` type thiếu field `id` — nếu cần unique identifier cho từng card |
| **Type naming** | ✅ Tốt | `FlashCard` (metadata) vs `Cards` (content) — phân biệt rõ ràng |
| **Data validation** | ❌ Không có | Không có runtime validation (Zod, Yup, ...) — dữ liệu JSON sai format sẽ crash runtime |
| **Date type** | ⚠️ String | `updated`/`created` dùng string thay vì timestamp number — khó tính toán duration |
| **Source field** | ⚠️ Empty | Tất cả source đều `""` — chưa có cơ chế populate từ data pipeline |

### Data JSON structure

**`public/data/flashcards/index.json`:**
```json
[
  {
    "id_flashcard": "flashcard_templates",
    "name_flashcard": "Flashcard Templates",
    "language": "English",
    "num_cards": 1,
    "updated": "2026-09-02T20:45:00.000",
    "created": "2026-09-02T20:40:00.000",
    "source": ""
  }
]
```

**`public/data/flashcards/flashcard_templates.json`:**
```json
{
  "id_flashcard": "flashcard_templates",
  "name_flashcard": "Flashcard Templates",
  "num_cards": 8,
  ...
  "cards": [
    { "order": 1, "vocab": "...", "pos": "...", "ipa": "...", "mean": "...", "example": "..." },
    { "order": 2, "vocab": "...", "pos": "...", "ipa": "...", "mean": "...", "example": "..." }
  ]
}
```

| Tiêu chí | Đánh giá | Ghi chú |
|----------|----------|---------|
| **File structure** | ✅ Tốt | `index.json` (metadata list) + `{id}.json` (full data) — scalable pattern |
| **Template data** | ⚠️ Ít mẫu | Chỉ có 1 template với 2 cards — cần thêm sample data để test |
| **JSON structure** | ✅ Đúng | `{id_flashcard, name_flashcard, num_cards, updated, created, source, cards: [...]}` |
| **Card order field** | ⚠️ Không enforce | `order` field trong cards không được sort — thứ tự phụ thuộc vào JSON array order |

---

## 4. API Layer (`src/api/flashcard.api.ts`)

```typescript
import type { Cards, FlashCard } from "../type/flashcard.type";
import { fetchJson } from "./api";

const FLASHCARDS_INDEX_PATH = "/data/flashcards/index.json";
const flashCardCache = new Map<string, FlashCardData>();

type FlashCardData = FlashCard & { cards: Cards[] };

async function loadFlashcarddata(idFlashcard: string): Promise<FlashCardData> {
  const cachedFlashcard = flashCardCache.get(idFlashcard);
  if (cachedFlashcard) return cachedFlashcard;
  const flashcard = await fetchJson<FlashCardData>(`/data/flashcards/${idFlashcard}.json`);
  flashCardCache.set(idFlashcard, flashcard);
  return flashcard;
}

export const getFlashCards = async (): Promise<FlashCard[]> => fetchJson<FlashCard[]>(FLASHCARDS_INDEX_PATH);
export const getCard = async (idFlashcard: string): Promise<Cards[]> => {
  const flashcard = await loadFlashcarddata(idFlashcard);
  return flashcard.cards;
};
```

| Tiêu chí | Đánh giá | Ghi chú |
|----------|----------|---------|
| **Caching strategy** | ✅ Tốt | `Map<string, FlashCardData>` cache trong memory — giống pattern của `exam.api.ts` |
| **Cache invalidation** | ❌ Không có | Cache không bao giờ expire — nếu data thay đổi cần reload page |
| **Error handling** | ⚠️ Cơ bản | Chỉ throw Error generic từ `fetchJson`, không có HTTP status parsing chi tiết |
| **fetchJson abstraction** | ✅ Tốt | Tách riêng `api.ts` với JSDoc song ngữ — reusable |
| **Type safety** | ✅ Tốt | Generic `<T>` trên `fetchJson<T>` |
| **Cache memory leak** | ⚠️ Risk | Không có size limit — load nhiều flashcards sẽ tăng memory vô hạn |

---

## 5. Hooks (`src/hooks/useFlashCard.ts`)

```typescript
export const useListFlashCard = () => {
  const [data, setData] = useState<FlashCard[] | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  // ... useEffect with isMounted pattern
  return { data, isLoading, error };
};

export const useCards = (id_flashcard: string) => {
  const [data, setData] = useState<Cards[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  // ... useEffect with isMounted pattern + [id_flashcard] dependency
  return { data, isLoading, isError };
};
```

| Tiêu chí | Đánh giá | Ghi chú |
|----------|----------|---------|
| **Cleanup pattern** | ✅ Tốt | `isMounted` flag + cleanup function trong useEffect — tránh setState on unmounted |
| **Loading state** | ✅ Tốt | `isLoading` boolean cho UX loading indicator |
| **Error handling inconsistency** | ❌ Lỗi | `useListFlashCard` trả `error: unknown`, nhưng `useCards` trả `isError: boolean` — **không nhất quán** |
| **Dependency array** | ✅ Đúng | `useCards` có `[id_flashcard]` dependency — reload khi id thay đổi |
| **No retry logic** | ⚠️ Thiếu | Không có retry mechanism khi fetch fail |
| **No abort controller** | ⚠️ Thiếu | Không dùng `AbortController` — nếu component unmount nhanh, fetch vẫn chạy ngầm |

---

## 6. Components

### `FlashCard.tsx` (Reusable flip card)

```tsx
export default function FlashCard({ order, vocab, pos, ipa, mean, example }: Cards) {
  const [fliped, setFlip] = useState(false);
  console.log(order);
  return (
    <div className="..." onClick={() => setFlip(!fliped)}>
      <div className={`... ${fliped ? "rotate-y-180": ""}`}>
        {/* Front: vocab + pos + ipa */}
        {/* Back: mean + example */}
      </div>
    </div>
  );
}
```

| Tiêu chí | Đánh giá | Ghi chú | Severity |
|----------|----------|---------|----------|
| **CSS Flip Animation** | ❌ **KHÔNG HOẠT ĐỘNG** | Các class `perspective-distant`, `transform-3d`, `backface-hidden`, `rotate-y-180` **không tồn tại trong Tailwind CSS v4** — flip animation sẽ không hoạt động | 🔴 Critical |
| **State management** | ✅ Đơn giản | `useState(false)` cho flip state — phù hợp | 🟢 |
| **Props destructuring** | ⚠️ Redundant | Destructure từ `Cards` type nhưng component nhận 7 params (order + 6 fields) — `order` không được dùng trong UI | 🟡 Medium |
| **Typo state name** | ⚠️ | `fliped` thay vì `flipped` — khó đọc code | 🟢 Low |
| **Console.log** | ❌ Cần xóa | Line 7: `console.log(order)` — debug code còn sót | 🟡 Medium |
| **No accessibility** | ⚠️ Thiếu | Không có `role="button"`, `tabIndex={0}`, `aria-label`, keyboard handler | 🟡 Medium |
| **No JSDoc** | ⚠️ Vi phạm rule | Component không có JSDoc song ngữ — vi phạm quy tắc dự án | 🟢 Low |

### `CardFlashCard.tsx` (List item card)

```tsx
export default function CardFlashCard({ id_flashcard, name_flashcard, language, num_cards, updated, created, source }: FlashCard) {
  const classNameInfo = "flex gap-4 justify-between text-gray-600";
  console.log(id_flashcard, source);
  return (
    <Link to={`/flashcard/${id_flashcard}/practice`} className="... hover:scale-110 hover:shadow-xl">
      {/* name, language, count, updated, created */}
    </Link>
  );
}
```

| Tiêu chí | Đánh giá | Ghi chú | Severity |
|----------|----------|---------|----------|
| **Navigation** | ✅ Tốt | Dùng `<Link to={...}>` thay vì `<a>` — SPA navigation, không reload page | 🟢 |
| **Hover effect** | ✅ Tốt | `hover:scale-110 hover:shadow-xl` — smooth transition | 🟢 |
| **Source field** | ⚠️ Commented out | Source field bị comment (line 25–28) nhưng vẫn destructured từ props | 🟢 Low |
| **Console.log** | ❌ Cần xóa | Line 8: `console.log(id_flashcard, source)` — debug code còn sót | 🟡 Medium |

---

## 7. Pages

### `FlashCardPage.tsx` (List page)

```tsx
export default function FlashCardPage() {
  const { data, isLoading, error } = useListFlashCard();
  useEffect(() => { document.title = "Flashcard | Edu SW" }, []);
  if (isLoading) return <p>Đang lấy danh sách bài tập...</p>;
  if (error) return <p>Máy chủ lỗi!</p>;
  console.log(data);
  return (
    <main className="...">
      <div className="...">Chọn các flashcard bên dưới để rèn luyện nhé :3</div>
      <div className="... lg:grid lg:grid-cols-4 ...">
        {data?.map((card: FlashCard) => (
          <CardFlashCard key={card?.id_flashcard} {...card} />
        ))}
      </div>
    </main>
  );
}
```

| Tiêu chí | Đánh giá | Ghi chú | Severity |
|----------|----------|---------|----------|
| **Title management** | ✅ Tốt | `document.title` trong useEffect | 🟢 |
| **Map with optional chaining** | ⚠️ Anti-pattern | `data?.map(...)` và `card?` — redundant sau guard clause | 🟡 Medium |
| **Type annotation in callback** | ⚠️ Redundant | `(card: FlashCard)` — TS có thể infer type từ `data` | 🟢 Low |
| **Console.log** | ❌ Cần xóa | Line 21: `console.log(data)` — debug code còn sót | 🟡 Medium |
| **Error message** | ⚠️ Generic | "Máy chủ lỗi!" — không hiển thị chi tiết error | 🟡 Medium |
| **Dead code** | ⚠️ Có | Lines 47–53: commented-out `<FlashCard>` với props sai type | 🟢 Low |

### `DoFlashCardPage.tsx` (Practice page)

```tsx
export default function DoFlashCardPage() {
  const { id_flashcard } = useParams();
  const idFlashcard = String(id_flashcard);
  const { data, isLoading, isError } = useCards(idFlashcard);
  const [order, setOrder] = useState(0);
  console.log(data);

  if (isLoading) return <p>Đang tải đề...</p>;
  if (isError) return <p>Máy chủ lỗi!</p>;

  function continueCard(order: number) { setOrder(order + 1); }
  function backCard(order: number) { setOrder(order - 1); }

  const card = data?.[order];
  if (!card) return <p>Không tìm thấy thẻ!</p>;

  return (
    <main className="...">
      <FlashCard {...card} />
      <div className="...">
        <button onClick={() => backCard(order)}><ArrowLeft /></button>
        <div>{order + 1} / 2</div>  {/* ← HARDCODED "2" */}
        <button onClick={() => continueCard(order)}><ArrowRight /></button>
      </div>
    </main>
  );
}
```

| Tiêu chí | Đánh giá | Ghi chú | Severity |
|----------|----------|---------|----------|
| **useParams handling** | ✅ Tốt | `String(id_flashcard)` — null-safe | 🟢 |
| **Hardcoded card count** | ❌ **BUG** | Line 59: `<p>2</p>` — số total cards được hardcode là "2" thay vì `data?.length` | 🔴 Critical |
| **No bounds checking** | ❌ **BUG** | `backCard(order)` và `continueCard(order)` không check bounds — có thể navigate đến index < 0 hoặc >= length | 🔴 Critical |
| **Progress display** | ⚠️ Sai | Hiển thị `{order + 1} / 2` — luôn hiển thị "/2" dù có bao nhiêu cards | 🔴 Critical |
| **Card access** | ⚠️ Unsafe | `data?.[order]` — có thể return undefined nếu order out of bounds | 🟡 Medium |
| **Empty div** | ⚠️ Dead code | Line 36–38: `<div className="p-5">` rỗng — không clear purpose | 🟢 Low |
| **Console.log** | ❌ Cần xóa | Line 14: `console.log(data)` — debug code còn sót | 🟡 Medium |
| **No keyboard nav** | ⚠️ Thiếu UX | Không hỗ trợ phím ← → để chuyển card, Space để flip | 🟡 Medium |

---

## 8. Routes (`src/routes/AppRoutes.tsx`)

```tsx
<Route path="flashcard" element={<FlashCardPage />} />
<Route path="flashcard/:id_flashcard/practice" element={<DoFlashCardPage />} />
```

| Tiêu chí | Đánh giá | Ghi chú |
|----------|----------|---------|
| **Route structure** | ✅ Tốt | Nested route pattern consistent với exam routes |
| **Route naming** | ✅ Tốt | `flashcard` và `flashcard/:id_flashcard/practice` — descriptive, RESTful-ish |
| **Import order** | ⚠️ Minor | Import không theo alphabetical order (nhưng không vi phạm rule) |

---

## 9. NavBar (`src/components/NavBar.tsx`)

```tsx
{to: "/flashcard", label: "FlashCard", icon: PlayingCardsFan},
```

| Tiêu chí | Đánh giá | Ghi chú |
|----------|----------|---------|
| **Label** | ✅ Đã fix | Từ commit `14daa75` — đổi từ "Bài Tập" → "FlashCard" |
| **Icon** | ✅ Tốt | Dùng `PlayingCardsFan` từ lucide-react — phù hợp ngữ nghĩa |

---

## 10. Data Layer

| Tiêu chí | Đánh giá | Ghi chú |
|----------|----------|---------|
| **File structure** | ✅ Tốt | `index.json` (metadata list) + `{id}.json` (full data) — scalable pattern |
| **Template data** | ⚠️ Ít mẫu | Chỉ có 1 template với 2 cards — cần thêm sample data để test |
| **JSON structure** | ✅ Đúng | `{id_flashcard, name_flashcard, num_cards, updated, created, source, cards: [...]}` |
| **Card order field** | ⚠️ Không enforce | `order` field trong cards không được sort — thứ tự phụ thuộc vào JSON array order |

---

## 11. Tổng hợp Bugs & Lỗi

### 🔴 Critical (Phải fix trước merge)

| # | File | Dòng | Mô tả | Cách fix |
|---|------|------|-------|----------|
| 1 | `FlashCard.tsx` | 10–26 | **CSS classes không tồn tại** — flip animation hoàn toàn không hoạt động | Thêm custom CSS vào `index.css` |
| 2 | `DoFlashCardPage.tsx` | 59 | **Hardcoded card count "2"** — hiển thị sai progress | Thay `<p>2</p>` bằng `<p>{data?.length ?? 0}</p>` |
| 3 | `DoFlashCardPage.tsx` | 19–24 | **Không bounds checking** — navigate ra ngoài array bounds | Thêm check: `if (order > 0)` và `if (order < data.length - 1)` |

### 🟡 Medium (Nên fix)

| # | File | Dòng | Mô tả | Cách fix |
|---|------|------|-------|----------|
| 4 | `useFlashCard.ts` | 8, 44 | **Inconsistent error type** — `error: unknown` vs `isError: boolean` | Thống nhất về `{ error: unknown \| null }` |
| 5 | `DoFlashCardPage.tsx` | 26 | **Unsafe array access** — `data?.[order]` có thể undefined | Thêm guard: `if (!card || !data) return ...` |
| 6 | Multiple files | Various | **Console.log còn sót** — 5 file có debug log | Xóa tất cả console.log trước production |
| 7 | `FlashCardPage.tsx` | 31–42 | **Optional chaining trên map** — redundant sau guard | Dùng `data.map(...)` trực tiếp |
| 8 | `flashcard.api.ts` | 5 | **Cache không có limit** — memory leak risk | Thêm LRU cache hoặc size limit (Max 20 entries) |

### 🟢 Low (Có thể bỏ qua / enhancement)

| # | File | Dòng | Mô tả |
|---|------|------|-------|
| 9 | `CardFlashCard.tsx` | 25–28 | Source field bị comment nhưng vẫn destructured |
| 10 | `FlashCardPage.tsx` | 47–53 | Dead code (commented FlashCard component) |
| 11 | `DoFlashCardPage.tsx` | 36–38 | Empty div không clear purpose |
| 12 | `Cards` type | — | Thiếu field `id` cho unique identification |
| 13 | `FlashCard.tsx` | 4 | `order` prop destructured nhưng không dùng trong UI |
| 14 | — | — | Không có keyboard navigation (← → Space) |

---

## 12. Performance Issues

| # | Vấn đề | Mức độ | Đề xuất |
|---|--------|--------|---------|
| 1 | **No virtualization** trên list cards | 🟡 Medium | Nếu danh sách > 50 cards, dùng `react-window` hoặc virtual scroll |
| 2 | **Cache không expire** | 🟡 Medium | Thêm TTL (time-to-live) hoặc version check |
| 3 | **Không có Suspense/Streaming** | 🟢 Low | Dùng React Suspense cho data loading |
| 4 | **FlashCard re-renders toàn bộ** khi flip | 🟢 Low | Wrap FlashCard trong `React.memo` |
| 5 | **fetch không abort** khi unmount | 🟡 Medium | Dùng `AbortController` để hủy request khi component unmount |

---

## 13. Điểm mạnh

| ✅ | Mô tả |
|----|-------|
| 1 | **Kiến trúc nhất quán** — Follow đúng pattern của exam module, dễ maintain |
| 2 | **TypeScript strict** — `npm run lint` và `tsc --noEmit` đều 0 errors |
| 3 | **Caching strategy** — Map cache trong API layer giảm network requests |
| 4 | **JSDoc song ngữ** — English + Vietnamese, rất tốt cho documentation |
| 5 | **Conventional Commits** — Commit message rõ ràng, có scope (feat, fix, refactor, chore) |
| 6 | **Responsive design** — Tailwind classes với `lg:` breakpoint cho mobile/desktop |
| 7 | **SPA Navigation** — Dùng `<Link>` từ react-router-dom, không reload page |

---

## 14. Điểm cần cải thiện

| ⚠️ | Mô tả | Priority |
|----|-------|----------|
| 1 | **CSS flip animation broken** — Classes Tailwind không tồn tại | P0 - Blocker |
| 2 | **Hardcoded "2" và không bounds check** — Logic navigation sai | P0 - Blocker |
| 3 | **Inconsistent error handling** giữa các hooks | P1 - High |
| 4 | **Console.log còn sót** trong 5 files | P1 - High |
| 5 | **Không có retry mechanism** khi fetch fail | P2 - Medium |
| 6 | **Cache không có limit/TTL** — Memory leak risk | P2 - Medium |
| 7 | **Thiếu keyboard navigation** — UX accessibility | P2 - Medium |
| 8 | **Không có data validation** (Zod/Yup) | P3 - Low |

---

## 15. Thống kê tổng quan

| Tiêu chí | Điểm (1-10) | Ghi chú |
|----------|-------------|---------|
| **Kiến trúc** | 8/10 | Phân tách layer rõ ràng, pattern consistent với exam module |
| **Code quality** | 7/10 | TypeScript đúng, naming conventions tốt, còn console.log và dead code |
| **Khả năng hoạt động** | 5/10 | **CSS flip animation không hoạt động**, hardcoded card count, không bounds check — cần fix P0 |
| **Accessibility** | 3/10 | Không hỗ trợ keyboard navigation và screen reader |
| **Data layer** | 7/10 | JSON structure tốt, caching strategy đúng, nhưng thiếu validation |
| **UX Potential** | 6/10 | Ý tưởng flashcard flip tốt, cần thêm navigation, keyboard support, bounds checking |

---

## 16. Khuyến nghị

### ✅ Có thể merge (có điều kiện)

Sau khi fix **3 bug P0**:
- [ ] C1: Thêm custom CSS cho flip animation
- [ ] C2: Fix hardcoded "2" → dynamic `data?.length`
- [ ] C3: Thêm bounds checking cho navigation

### ❌ Không nên merge (hiện tại)

- CSS flip animation không hoạt động → UX bị phá vỡ hoàn toàn
- Hardcoded "2" và không bounds check → Logic navigation sai, có thể crash
- Error handling inconsistent giữa các hooks → Khó debug khi có lỗi

### 📋 Checklist trước merge

- [ ] P0-1: CSS flip animation hoạt động (test trên Chrome, Firefox, Safari)
- [ ] P0-2: Card count hiển thị đúng với mọi flashcard
- [ ] P0-3: Bounds checking — không thể navigate ra ngoài array
- [ ] P1-3: Không còn console.log trong production code
- [ ] `npm run lint` → 0 warnings, 0 errors
- [ ] `tsc --noEmit` → 0 errors
- [ ] Test trên mobile (responsive grid)
- [ ] Test với flashcard có > 2 cards

---

## 17. Files tham chiếu

| File | Đường dẫn |
|------|-----------|
| Types | `src/type/flashcard.type.ts` |
| API | `src/api/flashcard.api.ts`, `src/api/api.ts` |
| Hooks | `src/hooks/useFlashCard.ts`, `src/hooks/useConvert.ts` |
| Components | `src/components/FlashCard.tsx`, `src/components/CardFlashCard.tsx` |
| Pages | `src/pages/FlashCardPage.tsx`, `src/pages/DoFlashCardPage.tsx` |
| Routes | `src/routes/AppRoutes.tsx` |
| Nav | `src/components/NavBar.tsx` |
| Data | `public/data/flashcards/index.json`, `public/data/flashcards/flashcard_templates.json` |
| CSS | `src/index.css` |
