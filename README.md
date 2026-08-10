# EduSW 🎓

**EduSW** is a lightweight, client-side exam practice platform built for speed and simplicity. It allows students to practice exams with various question types (Multiple Choice, True/False, Short Answer) without requiring a backend server.

Built with **React 19**, **TypeScript**, and **Vite 8**, this project focuses on performance, type safety, and a clean user experience.

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## ✨ Features

*   **📝 Diverse Question Types:** Supports Multiple Choice (4 options), True/False, and Short Answer questions.
*   **🧮 Math & Markdown Support:** Renders LaTeX equations (via KaTeX) and Markdown text seamlessly.
*   **⚡ Instant Scoring:** Fully client-side evaluation provides immediate feedback on results.
*   **📱 Responsive Design:** Optimized layout for both desktop (sidebar navigation) and mobile devices using Tailwind CSS v4.
*   **🔒 Privacy-Focused:** No data leaves the browser; all processing happens locally.
*   **🚀 Blazing Fast:** Built with Vite 8 and React 19 for a highly optimized bundle size.

---

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Core** | React 19, TypeScript ~6.0 |
| **Build Tool** | Vite 8 |
| **Styling** | Tailwind CSS v4 (via Vite plugin) |
| **Routing** | React Router v7/v8 |
| **Math Rendering** | KaTeX, rehype-katex |
| **Linting** | Oxlint |
| **Deployment** | GitHub Pages (`gh-pages`) |

---

## 📂 Project Structure

The project follows a clean architecture with separation of concerns:

```text
edu-sw/
├── public/data/exams/   # JSON data source for exams & questions
├── src/
│   ├── api/             # API layer (fetching JSON)
│   ├── components/      # Reusable UI components (Cards, Nav, etc.)
│   ├── hook/            # Custom React Hooks (useExam, useSubmit, etc.)
│   ├── layouts/         # Page layouts (MainLayout)
│   ├── pages/           # Route-based pages (Home, ExamList, Results)
│   ├── routes/          # App routing configuration
│   └── type/            # TypeScript interfaces & types
├── index.html
└── vite.config.ts
```

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18+ recommended)
*   npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/chpvchp/edu-sw.git
    cd edu-sw
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The app will be available at `http://localhost:5173`.

---

## 📚 Adding New Exams

Since this is a static application, exam data is managed via JSON files in the `public/data/exams/` directory.

### 1. Exam List (`index.json`)
Add your new exam ID to the list:
```json
[
  { "id_exam": "math-101", "name_exam": "Algebra Test", ... }
]
```

### 2. Exam Content (`{id_exam}.json`)
Create a file named `{id_exam}.json` containing the full payload:
*   **Exam Info:** Name, Subject, Class, Duration.
*   **Questions:** Array of objects with `type_question` (`four_choice`, `true_false`, `short_answer`).

---

## 📦 Deployment

The project is configured to deploy automatically to GitHub Pages.

```bash
npm run deploy
```

This script builds the app, handles the 404 redirect for SPA routing, and pushes the `dist` folder to the `gh-pages` branch.

**Live Demo:** [chpvchp.github.io/edu-sw](https://chpvchp.github.io/edu-sw)

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Cao Hoang Phuc**
*   GitHub: [@chpvchp](https://github.com/chpvchp)
*   HuggingFace: [@chpvchp](https://huggingface.co/chpvchp)