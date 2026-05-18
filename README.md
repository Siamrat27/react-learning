# ⚛️ React + TypeScript Course

คอร์สเรียน React และ TypeScript แบบครบวงจร พร้อม Live Demo ทุกบท
สร้างด้วย Vite + React 18 + TypeScript + Tailwind CSS v4 + Axios

## 🌐 เข้าใช้งานได้เลย (ไม่ต้อง login)

**👉 https://siamrat27.github.io/react-learning/**

---

## 📚 เนื้อหาทั้งหมด (12 บท)

| # | บท | เนื้อหาหลัก |
|---|-----|------------|
| 1 | **React คืออะไร** | Virtual DOM, Declarative vs Imperative, โครงสร้างโปรเจค |
| 2 | **Components & JSX** | JSX rules, conditional rendering, list rendering, fragment |
| 3 | **TypeScript** | Types, Interface, Union, Generics, typing props & state |
| 4 | **useState Hook** | State, immutability, functional update — Todo app demo |
| 5 | **Props & Data Flow** | One-way data flow, callback props, children, lifting state |
| 6 | **useEffect Hook** | Dependency array, cleanup function, memory leak prevention |
| 7 | **Functions & Async/Await** | var/let/const, arrow function, Promise, try/catch/finally |
| 8 | **Axios & API Calls** | GET/POST/PUT/DELETE, interceptors, error handling |
| 9 | **Custom Hooks** | useFetch, useLocalStorage, useDebounce |
| 10 | **Promise.all & Patterns** | Sequential vs Parallel, allSettled, race |
| 11 | **นิยามสำคัญ** | Glossary 25+ คำ ค้นหา + filter ตาม category ได้ |
| 12 | **Tailwind CSS** | Utility classes, responsive, hover/focus, live card builder |

---

## 🚀 วิธี Setup และเริ่มใช้งาน

### สิ่งที่ต้องมีก่อน (Prerequisites)

- [Node.js](https://nodejs.org/) เวอร์ชัน **18 ขึ้นไป** (แนะนำ v20+)
- npm เวอร์ชัน **8 ขึ้นไป** (มาพร้อมกับ Node.js)
- Text editor เช่น [VS Code](https://code.visualstudio.com/)

ตรวจสอบเวอร์ชันที่มีด้วยคำสั่ง:

```bash
node --version
npm --version
```

---

### ขั้นตอนที่ 1 — Clone โปรเจค

```bash
git clone https://github.com/Siamrat27/react-learning.git
cd react-learning
```

---

### ขั้นตอนที่ 2 — ติดตั้ง Dependencies

```bash
npm install
```

> คำสั่งนี้จะดาวน์โหลด library ทั้งหมดที่โปรเจคต้องการ ใช้เวลาประมาณ 1-2 นาที

---

### ขั้นตอนที่ 3 — รัน Development Server

```bash
npm run dev
```

จากนั้นเปิด browser ไปที่ **http://localhost:5173**

---

### คำสั่งอื่นๆ ที่มีประโยชน์

```bash
# Build สำหรับ Production
npm run build

# Preview Production build
npm run preview

# ตรวจสอบ TypeScript errors
npx tsc --noEmit
```

---

## 🗂️ โครงสร้างโปรเจค

```
react-learning/
├── public/                    # Static files
├── src/
│   ├── components/            # Shared components
│   │   ├── CodeBlock.tsx      # Syntax highlighted code
│   │   ├── Callout.tsx        # Info/tip/warning boxes
│   │   ├── DemoBox.tsx        # Interactive demo wrapper
│   │   ├── Section.tsx        # Lesson section wrapper
│   │   └── Sidebar.tsx        # Navigation sidebar
│   ├── data/
│   │   └── lessons.ts         # Lesson metadata (title, tags, duration)
│   ├── lessons/               # 12 lesson components
│   │   ├── L01_WhatIsReact.tsx
│   │   ├── L02_ComponentsJSX.tsx
│   │   ├── L03_TypeScript.tsx
│   │   ├── L04_useState.tsx
│   │   ├── L05_Props.tsx
│   │   ├── L06_useEffect.tsx
│   │   ├── L07_AsyncFunctions.tsx
│   │   ├── L08_Axios.tsx
│   │   ├── L09_CustomHooks.tsx
│   │   ├── L10_PromiseAll.tsx
│   │   ├── L11_Definitions.tsx
│   │   └── L12_Tailwind.tsx
│   ├── App.tsx                # Root component + routing
│   ├── main.tsx               # Entry point
│   ├── index.css              # Global styles (Tailwind)
│   └── vite-env.d.ts          # Vite type declarations
├── index.html                 # HTML shell
├── package.json               # Dependencies & scripts
├── tsconfig.json              # TypeScript config
└── vite.config.ts             # Vite + Tailwind config
```

---

## 🛠️ Tech Stack

| เทคโนโลยี | เวอร์ชัน | ทำอะไร |
|-----------|---------|--------|
| [React](https://react.dev/) | 18 | UI Library |
| [TypeScript](https://www.typescriptlang.org/) | 5 | Type Safety |
| [Vite](https://vitejs.dev/) | 6+ | Build tool + Dev server |
| [Tailwind CSS](https://tailwindcss.com/) | 4 | Styling |
| [Axios](https://axios-http.com/) | 1 | HTTP Client |
| [react-syntax-highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter) | 15 | Code block highlighting |

---

## 💡 Features ของ Course (รวม Interactive Quiz)

- **Sidebar navigation** พร้อม progress tracker — บันทึกความคืบหน้าอัตโนมัติ
- **Code block** มี syntax highlight พร้อม copy button
- **Callout boxes** สำหรับ info, tip, warning, definition
- **Live Demo** ทุกบท — ทดลองโต้ตอบได้จริง
- **Interactive Quiz** ทุกบท — ตอบคำถามถึงผ่านบทได้ (multiple-choice + fill-in-the-blank)
- **Anatomy sections** อธิบายทุกบรรทัดของโค้ดพร้อมบอกว่า "ถ้าเอาออกจะเกิดอะไร"
- **Glossary** 25+ คำ ค้นหาได้และ filter ตาม category
- **Bottom navigation** เดินหน้า-ถอยหลังระหว่างบทได้ง่าย

---

## 📖 แนะนำการเรียน

1. เริ่มจาก**บทที่ 1** แล้วเรียนตามลำดับ — เนื้อหาต่อกัน
2. **กดทดลอง Demo** ทุกอันในแต่ละบท อย่าแค่อ่าน
3. **ลองแก้โค้ดตัวอย่าง** ใน IDE ของตัวเอง
4. **กด "เสร็จแล้ว"** ทุกบทเพื่อ track progress
5. บทที่ 11 (นิยามสำคัญ) เปิดไว้เป็น reference ได้ตลอด

---

## 🔗 Resources เพิ่มเติม

- [React Official Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Axios Docs](https://axios-http.com/docs/intro)
- [Vite Docs](https://vitejs.dev/guide/)
