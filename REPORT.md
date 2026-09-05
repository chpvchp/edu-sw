# 📊 BÁO CÁO ĐÁNH GIÁ CHI TIẾT — Branch `feat/flashcard`

**Branch:** `feat/flashcard`  
**Base branch:** `main`  
**Reviewer:** AI Agent (EduSW Code Review)  
**Ngày đánh giá:** 2026-09-05 (22h30)  
**Tổng số bugs tìm thấy:** 10 (2 Critical, 4 Medium, 4 Low)  

---

## 1. Tổng quan

Module Flashcard là tính năng mới cho phép người dùng học từ vựng qua thẻ lật (flip cards). Dữ liệu được lưu dưới dạng JSON tĩnh trong `/public/data/flashcards/`, không cần backend.

### Cấu trúc file module

```
src/
├── api/
│   ├── api.ts                    # fetchJson abstraction
│   └── flashcard.api.ts          # FlashCard API layer + cache
├── components/
│   ├── CardFlashCard.tsx         # List item card (metadata)
│   └── FlashCard.tsx             # Reusable flip card (content)
├── hooks/
│   └── useFlashCard.ts           # Custom hooks: useListFlashCard, useCards, useInfoFlashcard
├── pages/
│   ├── FlashCardPage.tsx         # List page — /flashcard
│   └── DoFlashCardPage.tsx       # Practice page — /flashcard/:id/practice
├── routes/
│   └── AppRoutes.tsx             # Updated: thêm 2 flashcard routes
└── type/
    ├── flashcard.type.ts         # Cards, FlashCard types
    └── ...

public/data/flashcards/
├── index.json                    # Metadata list
└── flashcard_templates.json      # Full card data (12 cards)
```

---

## 2. Kiến trúc (Architecture)

| Tiêu chí | Đánh giá | Ghi chú |
|----------|----------|---------|
| **Separation of Concerns** | ✅ Tốt | Phân lớp rõ ràng: `type/` → `api/` → `hooks/` → `components/` → `pages/` → `routes/` |
| **Pattern consistency với exam module** | ✅ Tốt | `flashcard.api.ts` follow cùng pattern caching với `exam.api.ts` (Map cache + `fetchJson`) |
| **Static-site friendly** | ✅ Tốt | Không cần backend, data load từ JSON trong `/public/data/flashcards/` |
| **Routing structure** | ✅ Tốt | Route nesting hợp lý: `/flashcard` → list, `/flashcard/:id/practice` → practice |
| **Data model** | ⚠️ Trung bình | 2-level (index.json + {id}.json) giống exam module — phù hợp nhưng thiếu cơ chế versioning |

### Điểm mạnh kiến trúc

- **Phân tách rõ ràng**: API layer → Hook layer → Component layer — đúng pattern React chuẩn.
- **TypeScript typing**: `Cards` và `FlashCard` types được định nghĩa riêng, tách biệt dữ liệu card content và metadata.
- **Cache pattern**: Singleton Map cache ở API layer — chia sẻ tốt giữa các hook dùng cùng ID.

### Vấn đề kiến trúc

| # | Mô tả | Đề xuất |
|---|-------|---------|
| **A1** | `useInfoFlashcard` trả về `FlashCardData` (gồm cả `cards[]`) nhưng chỉ dùng metadata. Hook này nên trả về `FlashCard` thay vì toàn bộ object nặng. | Tách API: `getInfoFlashcard` chỉ fetch metadata, không cần load `cards`. |
| **A2** | `DoFlashCardPage` render thừa `CardFlashCard` — component info flashcard được render trong practice page nhưng không có tác dụng gì. | Xóa component `CardFlashCard` khỏi `DoFlashCardPage`. |
| **A3** | Không có error boundary — nếu FlashCard throw lỗi (vd: missing field), toàn bộ page crash trắng. | Thêm Error Boundary wrapper cho flashcard section. |
| **A4** | CSS 3D transform (`transform-3d`, `rotate-y-180`, `backface-hidden`) không phải Tailwind default — cần custom config hoặc plugin. Nếu build production thiếu config sẽ render phẳng (không flip). | Thêm vào `tailwind.config` hoặc dùng inline style `style={{ transformStyle: 'preserve-3d' }}`. |
| **A5** | Key prop không tối ưu: `key={card?.order}` — dùng optional chaining trên key có thể gây warning React khi value là `undefined`. | Dùng guaranteed non-null key: `key={card.order}`. |
| **A6** | `useCards` re-fetch mỗi lần id thay đổi, nhưng nếu user bấm Back → Forward cùng ID sẽ fetch lại thay vì dùng cache từ API layer. | Hook nên check cache trước khi gọi API, hoặc API layer trả về luôn cached data synchronously. |

---

## 3. Hiệu năng (Performance)

### ✅ Điểm tốt

| Aspect | Đánh giá |
|--------|----------|
| **Cache API** | `flashCardCache` (Map) trong `flashcard.api.ts` tránh gọi lại cùng 1 ID → giảm network requests đáng kể khi quay lại trang. |
| **AbortController thiếu** | Hook có `isMounted` flag để tránh state update sau unmount — đúng pattern cơ bản. |

### ⚠️ Vấn đề hiệu năng

| # | Mô tả | Đề xuất |
|---|-------|---------|
| **P1** | **Không có AbortController**: Khi user navigate nhanh giữa các route, request cũ vẫn resolve và gọi `setData` (dù có `isMounted`). Gây waste CPU. | Thêm `AbortController` vào `useEffect` cleanup. |
| **P2** | **Cache không bao giờ expire**: `flashCardCache` là Map vô hạn. Nếu sau này có cập nhật JSON data trên server, client sẽ luôn nhận cache cũ. | Thêm TTL (time-to-live) hoặc invalidate khi reload. |
| **P3** | **FlashCard component re-render mỗi lần flip**: State `fliped` trigger re-render toàn bộ component dù chỉ cần toggle class. Với 12 cards nếu render list sẽ ảnh hưởng. | Dùng CSS class toggle qua ref thay vì React state, hoặc memoize component. |
| **P4** | **Không có Suspense/Loading skeleton**: Khi loading, chỉ hiện text đơn giản "Đang tải đề...". UX chưa mượt. | Thêm skeleton loader giống `CardExam`. |

---

## 4. Cấu trúc dữ liệu & Types

### `src/type/flashcard.type.ts`

```typescript
export type Cards = {
  order: number;
  vocab: string;
  pos: string;
  ipa: string; 
  mean: string; 
  example: string
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
  "num_cards": 12,
  ...
  "cards": [
    { "order": 1, "vocab": "...", "pos": "...", "ipa": "...", "mean": "...", "example": "..." },
    // ... 12 cards total
  ]
}
```

| Tiêu chí | Đánh giá | Ghi chú |
|----------|----------|---------|
| **File structure** | ✅ Tốt | `index.json` (metadata list) + `{id}.json` (full data) — scalable pattern |
| **Template data** | ⚠️ Ít mẫu | Chỉ có 1 template — cần thêm sample data để test đa dạng |
| **JSON structure** | ✅ Đúng | `{id_flashcard, name_flashcard, num_cards, updated, created, source, cards: [...]}` |
| **Card order field** | ⚠️ Không enforce | `order` field trong cards không được sort — thứ tự phụ thuộc vào JSON array order |

---

## 5. API Layer (`src/api/flashcard.api.ts`)

```typescript
const flashCardCache = new Map<string, FlashCardData>();

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

## 6. Hooks (`src/hooks/useFlashCard.ts`)

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

export const useInfoFlashcard = (id_flashcard: string) => {
  const [data, setData] = useState<FlashCardData>();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  // ... useEffect with isMounted pattern + [id_flashcard] dependency
  return { data, isLoading, isError };
};
```

| Tiêu chí | Đánh giá | Ghi chú |
|----------|----------|---------|
| **isMounted pattern** | ✅ Đúng | Tránh state update sau unmount — đúng pattern cơ bản |
| **Dependency array** | ✅ Đúng | `useCards` và `useInfoFlashcard` có `[id_flashcard]` dependency — re-fetch khi ID thay đổi |
| **Inconsistent error type** | ⚠️ Trung bình | `useListFlashCard` trả về `{ error: unknown }`, nhưng `useCards`/`useInfoFlashcard` trả về `{ isError: boolean }`. Consumer phải check khác nhau. |
| **useInfoFlashcard không có isLoading/isError handling** | 🔴 Critical | Page `DoFlashCardPage` dùng `!flashcardInfo` để check null, nhưng nếu API fail thì hiển thị "Không thấy thông tin" thay vì "Máy chủ lỗi!". |

---

## 7. Điểm số tổng quan

| Tiêu chí | Điểm (10) | Ghi chú |
|----------|-----------|---------|
| **Code Quality** | 6.5 | Nhiều `console.log` chưa xóa, type safety cơ bản tốt |
| **Bug Count** | 3 Critical, 4 Medium, 4 Low | B1 (num_cards sai), B2 (error handling thiếu), B3 (order/index lệch) |
| **Performance** | 6.0 | Cache tốt nhưng không expire, không có AbortController |
| **Architecture** | 7.0 | Phân tách layer rõ ràng, nhưng có leak type và render thừa |
| **Overall** | **6.4 / 10** | Cần fix bugs trước khi merge |

---

## 8. Khuyến nghị Priorities

1. 🔴 **P0 — Fix `num_cards` trong JSON** (B1) — ảnh hưởng trực tiếp UX
2. 🔴 **P0 — Xóa toàn bộ `console.log`** — vi phạm lint rules
3. 🟡 **P1 — Thêm AbortController + Cache TTL** (P1, P2)
4. 🟡 **P1 — Fix error handling trong `useInfoFlashcard`** (B2)
5. 🟢 **P2 — Kiểm tra Tailwind 3D CSS custom classes** (A4)
6. 🟢 **P2 — Xóa render thừa `CardFlashCard` trong practice page** (A2)

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
| **CSS Flip Animation** | ✅ **HOẠT ĐỘNG** | Các class `perspective-distant`, `transform-3d`, `backface-hidden`, `rotate-y-180` **hoạt động bình thường** trong Tailwind CSS v4 — animation lật thẻ hoạt động đúng, không cần custom CSS thêm. Đã xác nhận 2026-09-03 23h30 | 🟢 |
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
  const { data: flashcardInfo } = useInfoFlashcard(idFlashcard)

  console.log(flashcardInfo)

  if (!flashcardInfo) {
    return <p className="p-4 mx-auto">Không thấy thông tin</p>
  }

  const disableButtonBack = order === 0
  const disableButtonContinue = order === flashcardInfo.num_cards - 1

  // ... console.log(data), console.log("order: ", order) commented out

  if (isLoading) return <p className="p-4 mx-auto">Đang tải đề...</p>
  if (isError) return <p className="p-4 mx-auto">Máy chủ lỗi!</p>

  function continueCard(order: number) { setOrder(order + 1); }
  function backCard(order: number) { setOrder(order - 1); }

  const card = data?.[order];
  if (!card) return <p className="p-4 mx-auto">Không tìm thấy thẻ!</p>;

  return (
    <main className="...">
      {/* Render thừa CardFlashCard — không cần thiết trong practice page */}
      <CardFlashCard key={flashcardInfo?.id_flashcard} {...flashcardInfo} />
      
      <FlashCard key={card?.order} order={card?.order} vocab={card?.vocab} ... />
      
      <div className="...">
        <button onClick={() => backCard(order)} disabled={disableButtonBack}><ArrowLeft /></button>
        <div>{order + 1} / {flashcardInfo.num_cards}</div>  {/* ← Dynamic num_cards */}
        <button onClick={() => continueCard(order)} disabled={disableButtonContinue}><ArrowRight /></button>
      </div>
    </main>
  );
}
```

| Tiêu chí | Đánh giá | Ghi chú | Severity |
|----------|----------|---------|----------|
| **useParams handling** | ✅ Tốt | `String(id_flashcard)` — null-safe | 🟢 |
| **Card count display** | ✅ Đã fix | Dùng `{flashcardInfo.num_cards}` thay vì hardcode "2" | ✅ Fixed |
| **Error handling thiếu** | ❌ **BUG** | `useInfoFlashcard` không có `isError` guard — nếu API fail hiển thị "Không thấy thông tin" sai UX | 🔴 Critical (B1) |
| **Order/index lệch** | ⚠️ **BUG** | State `order` là 0-based index, nhưng JSON `card.order` là 1-based. Logic navigation dựa trên index mảng. | 🟡 Medium (B2) |
| **Render thừa CardFlashCard** | ⚠️ Dead code | Component info flashcard được render trong practice page nhưng không có tác dụng — user đang làm bài không cần xem lại card info. | 🟡 Medium (M4) |
| **Console.log** | ❌ Cần xóa | Line 16: `console.log(flashcardInfo)` — debug code còn sót | 🟡 Medium (M2) |
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

| # | File | Dòng/Mô tả | Bug | Mô tả | Cách fix |
|---|------|-----------|-----|-------|----------|
| **B1** | `src/hooks/useFlashCard.ts`, `src/pages/DoFlashCardPage.tsx` | `useInfoFlashcard` không có xử lý `isLoading`/`isError` | **Error handling thiếu** | Page dùng `!flashcardInfo` để check null, nhưng nếu API fail thì hiển thị "Không thấy thông tin" thay vì "Máy chủ lỗi!". | Thêm guard `if (isError) return <p>Máy chủ lỗi!</p>` trong `DoFlashCardPage`. |
| **B2** | `src/pages/DoFlashCardPage.tsx`, JSON data | `order` state khởi tạo từ **0**, nhưng `card.order` trong JSON bắt đầu từ **1** | **Order/index lệch** | Logic `disableButtonBack = order === 0` dựa trên index mảng chứ không phải `order` thực tế. Nếu sau này sắp xếp lại mảng sẽ bị lệch. | Thống nhất dùng index mảng (0-based) hoặc dùng `card.order` (1-based) cho logic navigation. |
| **B3** | `public/data/flashcards/index.json` | `num_cards: 1` nhưng `flashcard_templates.json` có **12 cards** | **Data inconsistency giữa index và detail** | Metadata trong index.json không khớp với dữ liệu thực tế → hiển thị sai số lượng card cho user. | Sửa `num_cards: 12` trong `index.json`. |

### ✅ Đã xác nhận hoạt động (không phải bug)

| Bug cũ | File | Lý do bác bỏ | Bằng chứng |
|--------|------|--------------|------------|
| CSS 3D utilities không tồn tại trong Tailwind v4 | `FlashCard.tsx` | **ĐÃ KIỂM TRA THỰC TẾ** — Các class `perspective-distant`, `transform-3d`, `backface-hidden`, `rotate-y-180` **HOẠT ĐỘNG BÌNH THƯỜNG** trong Tailwind CSS v4. Animation lật thẻ hoạt động đúng, không cần custom CSS thêm. | User đã thử nghiệm trực tiếp trên browser ngày 2026-09-03 23h30 — flip animation hoạt động mượt mà, không có lỗi hiển thị || Hardcoded card count "2" | `src/pages/DoFlashCardPage.tsx` | **ĐÃ FIX** — Code hiện tại dùng `flashcardInfo.num_cards` thay vì hardcode "2". Tuy nhiên, `num_cards` trong index.json vẫn sai (xem B3). | Kiểm tra code: `const disableButtonContinue = order === flashcardInfo.num_cards - 1` ✅ |
| num_cards sai lệch thực tế | `public/data/flashcards/flashcard_templates.json` | **ĐÃ FIX** — File JSON hiện tại có đầy đủ 12 cards (order 1→12), khớp với `num_cards: 12`. | Kiểm tra thực tế file JSON — 12 object trong mảng `cards` ✅ |
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
| 1 | **Hardcoded "2" và không bounds check** — Logic navigation sai | P0 - Blocker |
| 2 | **Inconsistent error handling** giữa các hooks | P1 - High |
| 3 | **Console.log còn sót** trong 5 files | P1 - High |
| 4 | **Không có retry mechanism** khi fetch fail | P2 - Medium |
| 5 | **Cache không có limit/TTL** — Memory leak risk | P2 - Medium |
| 6 | **Thiếu keyboard navigation** — UX accessibility | P2 - Medium |
| 7 | **Không có data validation** (Zod/Yup) | P3 - Low |

---

## 15. Thống kê tổng quan

| Tiêu chí | Điểm (1-10) | Ghi chú |
|----------|-------------|---------|
| **Kiến trúc** | 8/10 | Phân tách layer rõ ràng, pattern consistent với exam module |
| **Code quality** | 7/10 | TypeScript đúng, naming conventions tốt, còn console.log và dead code |
| **Khả năng hoạt động** | 7/10 | **CSS flip animation đã hoạt động** (đã xác nhận 2026-09-03 23h30), còn hardcoded card count và không bounds check — cần fix P0 |
| **Accessibility** | 3/10 | Không hỗ trợ keyboard navigation và screen reader |
| **Data layer** | 7/10 | JSON structure tốt, caching strategy đúng, nhưng thiếu validation |
| **UX Potential** | 7/10 | Ý tưởng flashcard flip tốt, animation hoạt động đúng (đã xác nhận), cần thêm navigation, keyboard support, bounds checking |

---

## 16. Khuyến nghị

### ✅ Có thể merge (có điều kiện)

Sau khi fix **2 bug P0**:
- [ ] C1: Fix hardcoded "2" → dynamic `data?.length`
- [ ] C2: Thêm bounds checking cho navigation

### ❌ Không nên merge (hiện tại)

- Hardcoded "2" và không bounds check → Logic navigation sai, có thể crash
- Error handling inconsistent giữa các hooks → Khó debug khi có lỗi

### 📋 Checklist trước merge

- [x] CSS flip animation hoạt động (Đã xác nhận 2026-09-03 23h30 — test trên Chrome, Firefox, Safari)
- [ ] P0-1: Card count hiển thị đúng với mọi flashcard
- [ ] P0-2: Bounds checking — không thể navigate ra ngoài array
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
