import { useState } from 'react'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'
import DemoBox from '../components/DemoBox'
import Section from '../components/Section'
import Exercise, { ExQuestion } from '../components/Exercise'

const questions: ExQuestion[] = [
  {
    type: 'choice',
    question: 'React คืออะไร?',
    choices: [
      'JavaScript Framework เหมือน Angular หรือ Vue',
      'JavaScript Library สำหรับสร้าง UI',
      'ภาษา Programming ใหม่',
      'Database สำหรับ web app',
    ],
    correct: 1,
    explanation:
      'React เป็น Library (ไม่ใช่ Framework) เราเป็นคนเรียกใช้มัน มันไม่ได้บังคับ structure ทั้งหมด ต่างจาก Angular ที่เป็น Framework เต็มรูปแบบ',
  },
  {
    type: 'fill',
    question: 'เมื่อ state เปลี่ยน React จะทำการ ___ component ใหม่เพื่ออัพเดต UI',
    hint: 'คำนี้เริ่มต้นด้วย "re-"',
    correct: ['re-render', 'render', 're render'],
    explanation:
      'React จะ re-render component ทุกครั้งที่ state หรือ props เปลี่ยน แต่จะอัพเดต Real DOM เฉพาะส่วนที่เปลี่ยนเท่านั้น (ผ่าน Virtual DOM)',
  },
  {
    type: 'choice',
    question: 'Virtual DOM แตกต่างจาก Real DOM อย่างไร?',
    choices: [
      'Virtual DOM ใหญ่กว่าและช้ากว่า',
      'Virtual DOM เก็บใน memory เป็น JavaScript object ทำให้ update เร็วกว่า',
      'Virtual DOM คือ HTML file พิเศษของ React',
      'ไม่ต่างกัน ใช้แทนกันได้',
    ],
    correct: 1,
    explanation:
      'Virtual DOM คือ copy ของ DOM ที่เก็บใน JavaScript memory การ update object ใน memory เร็วกว่าการแก้ Real DOM มาก React compare Virtual DOM เก่ากับใหม่ (diffing) แล้วอัพเดต Real DOM เฉพาะที่เปลี่ยน',
  },
  {
    type: 'choice',
    question: 'Declarative Programming คืออะไร?',
    choices: [
      'บอกทุก step ที่ต้องทำ เช่น "สร้าง element → set text → append"',
      'บอกแค่ว่า UI ควรเป็นอะไร React จัดการวิธีทำให้เอง',
      'เขียน CSS ด้วย JavaScript',
      'ประกาศตัวแปรด้วย let และ const',
    ],
    correct: 1,
    explanation:
      'Declarative = บอกผลลัพธ์ที่ต้องการ ("ฉันต้องการ <p>{count}</p>") React หาวิธีทำให้เอง — ตรงข้ามกับ Imperative ที่ต้องบอกทุก step เช่น document.createElement, textContent =, appendChild',
  },
]

export default function L01_WhatIsReact({ onPass }: { onPass?: () => void }) {
  const [count, setCount] = useState(0)
  const [renderLog, setRenderLog] = useState<string[]>(['🟢 Component เริ่มต้น'])

  const increment = () => {
    setCount((c) => c + 1)
    setRenderLog((prev) => [...prev, `🔄 Re-render ครั้งที่ ${prev.length}: count = ${count + 1}`])
  }

  return (
    <div>
      <Section title="React คืออะไร?">
        <p>
          <strong>React</strong> คือ <strong>JavaScript Library</strong> (ไม่ใช่ Framework!) ที่ Facebook สร้างขึ้นในปี 2013
          เอาไว้สำหรับสร้าง <strong>User Interface (UI)</strong> หรือหน้าเว็บที่ผู้ใช้เห็นและโต้ตอบด้วย
        </p>
        <Callout type="definition" title="Library vs Framework — ต่างกันยังไง?">
          <strong>Library</strong> = เครื่องมือที่เราเรียกใช้เอง เราควบคุม flow<br />
          <code>myCode → calls → React</code><br /><br />
          <strong>Framework</strong> = โครงสร้างที่ควบคุม flow เอง มันเรียกโค้ดเรา<br />
          <code>Angular → calls → myCode</code><br /><br />
          React เป็น Library → เราเลือกใช้เมื่อไหร่ก็ได้ ไม่ได้บังคับ structure ทั้งหมด
          ดังนั้น React จึงจับคู่กับ library อื่นๆ ได้ง่าย เช่น React Router, Axios, Zustand
        </Callout>
        <p>
          ก่อน React นักพัฒนาต้องจัดการ DOM ด้วยมือผ่าน <code>document.getElementById</code>,
          <code>innerHTML</code> ซึ่งยุ่งยากมากเมื่อ UI ซับซ้อนขึ้น React แก้ปัญหานี้ด้วย
          <strong> Component</strong> และ <strong>Virtual DOM</strong>
        </p>
      </Section>

      <Section title="ทำไมต้องใช้ React?">
        <div className="grid grid-cols-1 gap-3">
          {[
            { icon: '🧩', title: 'Component-Based', desc: 'แบ่ง UI เป็นชิ้นเล็กๆ ที่นำกลับมาใช้ใหม่ได้ เช่น Button, Card, Header' },
            { icon: '⚡', title: 'Virtual DOM', desc: 'อัพเดต UI เฉพาะส่วนที่เปลี่ยน ไม่ render ทั้งหน้า ทำให้เร็วกว่า' },
            { icon: '📦', title: 'Ecosystem ใหญ่', desc: 'มี Library เสริมมากมาย: React Router, Redux, React Query, Next.js' },
            { icon: '🏢', title: 'ใช้ในองค์กรใหญ่', desc: 'Facebook, Netflix, Airbnb, Shopee, LINE ล้วนใช้ React' },
          ].map((item) => (
            <div key={item.title} className="flex gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <div className="font-semibold text-slate-800 text-sm">{item.title}</div>
                <div className="text-slate-500 text-sm">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="🔬 กายวิภาค React Component แรก — ทุก line มีความหมาย">
        <p>มาดู Component ที่ง่ายที่สุดแล้วแยกแต่ละส่วนให้เข้าใจ:</p>
        <CodeBlock
          language="tsx"
          filename="src/components/Greeting.tsx"
          code={`// ① import — นำ React เข้ามาใช้ (ใน React 17+ ไม่ต้อง import React แล้ว)
import { useState } from 'react'

// ② Function Component — ชื่อต้องขึ้นต้นด้วยตัวพิมพ์ใหญ่
//    รับ props เป็น parameter (อธิบายใน Lesson 5)
function Greeting({ name }: { name: string }) {

  // ③ Hook — useState เก็บค่าที่ต้องการให้ UI อัพเดตเมื่อเปลี่ยน
  const [liked, setLiked] = useState(false)

  // ④ Return JSX — คือ UI ที่ต้องการแสดง
  //    ต้องมี root element เดียว (ใช้ <> </> ถ้าไม่อยากเพิ่ม div)
  return (
    <div>
      {/* ⑤ Expression {} — แทรก JavaScript ใน JSX */}
      <p>สวัสดี {name}!</p>

      {/* ⑥ Event Handler — onClick รับ function */}
      <button onClick={() => setLiked(!liked)}>
        {liked ? '❤️ ถูกใจแล้ว' : '🤍 ถูกใจ'}
      </button>
    </div>
  )
}

// ⑦ Export — ส่ง component ออกให้ไฟล์อื่น import ได้
export default Greeting`}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {[
            { num: '①', title: 'import', detail: 'นำ Hook หรือ library เข้ามาใช้ ต้องอยู่บนสุดของไฟล์เสมอ' },
            { num: '②', title: 'Function Component', detail: 'function ปกติที่ return JSX — ชื่อต้องขึ้นต้นด้วยตัวใหญ่' },
            { num: '③', title: 'useState Hook', detail: 'เก็บค่าที่ต้องการให้ UI อัพเดตเมื่อเปลี่ยน' },
            { num: '④', title: 'return JSX', detail: 'บอกว่า Component นี้จะแสดง UI แบบไหน' },
            { num: '⑤', title: '{} Expression', detail: 'แทรก JavaScript expression ใดๆ ลงใน JSX' },
            { num: '⑥', title: 'Event Handler', detail: 'function ที่ทำงานเมื่อ user โต้ตอบ' },
            { num: '⑦', title: 'export default', detail: 'ส่ง component ออกให้ไฟล์อื่น import ได้' },
          ].map((item) => (
            <div key={item.num} className="flex gap-2 p-2 bg-indigo-50 rounded-lg border border-indigo-100">
              <span className="text-indigo-600 font-bold text-sm w-6 flex-shrink-0">{item.num}</span>
              <div>
                <div className="font-semibold text-indigo-800 text-xs">{item.title}</div>
                <div className="text-indigo-600 text-xs">{item.detail}</div>
              </div>
            </div>
          ))}
        </div>

        <Callout type="warning" title="ถ้าลืม export default จะเกิดอะไร?">
          ไฟล์อื่นจะ import ไม่ได้ → ได้ <code>undefined</code> มาแทน → component ไม่แสดงผล
          หรือ error <code>Element type is invalid</code>
        </Callout>
        <Callout type="warning" title="ถ้าตั้งชื่อ component ด้วยตัวเล็ก จะเกิดอะไร?">
          React จะคิดว่าเป็น HTML element ธรรมดา เช่น <code>&lt;greeting&gt;</code> ไม่ใช่ Component
          ทำให้ไม่ render อะไรออกมา หรือ error <code>Unknown prop</code>
        </Callout>
      </Section>

      <Section title="Virtual DOM คืออะไร?">
        <p>
          <strong>DOM (Document Object Model)</strong> คือโครงสร้างของ HTML ที่ browser สร้างขึ้น
          การแก้ไข Real DOM ช้ามากเพราะต้อง recalculate layout ใหม่ทั้งหมด
        </p>
        <p>
          React แก้ปัญหานี้ด้วย <strong>Virtual DOM</strong> — เป็นสำเนา DOM ที่เก็บใน memory (JavaScript object)
          เมื่อ state เปลี่ยน React จะ:
        </p>
        <div className="flex flex-col gap-2 my-4">
          {[
            'สร้าง Virtual DOM ใหม่',
            'เปรียบเทียบกับ Virtual DOM เก่า (Diffing)',
            'หาส่วนที่ต่างกัน (Reconciliation)',
            'อัพเดต Real DOM เฉพาะส่วนที่เปลี่ยน (Patching)',
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-3 p-2 bg-indigo-50 rounded-lg">
              <span className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                {i + 1}
              </span>
              <span className="text-slate-700 text-sm">{step}</span>
            </div>
          ))}
        </div>
        <CodeBlock
          language="text"
          filename="เปรียบเทียบ"
          code={`Vanilla JS (แก้ Real DOM ตรง):
document.getElementById('count').innerHTML = newCount
→ browser repaint ทั้งหน้า (ช้า)

React (ผ่าน Virtual DOM):
setCount(newCount)
→ React diff → update เฉพาะ <span> ที่เปลี่ยน (เร็ว)`}
        />
      </Section>

      <Section title="แนวคิด Declarative vs Imperative">
        <p>
          React ใช้แนวคิด <strong>Declarative</strong> — เราบอกว่า UI <em>ควรเป็นอะไร</em>
          ไม่ใช่บอกว่า <em>ต้องทำอะไรบ้าง step by step</em>
        </p>
        <CodeBlock
          language="javascript"
          filename="Imperative vs Declarative"
          code={`// ❌ Imperative (Vanilla JS) — บอกวิธีทำทุก step
const btn = document.getElementById('btn')
const counter = document.getElementById('counter')
let count = 0
btn.addEventListener('click', () => {
  count++
  counter.textContent = count.toString()
})

// ✅ Declarative (React) — บอกแค่ว่า UI ควรเป็นอะไร
function Counter() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>เพิ่ม</button>
    </div>
  )
}`}
        />
        <Callout type="tip" title="จำง่ายๆ">
          Declarative = "ฉันอยากได้กาแฟ" (บอกผลลัพธ์)<br />
          Imperative = "ต้มน้ำ → ใส่กาแฟ → เติมน้ำตาล → คน" (บอกทุก step)
        </Callout>
      </Section>

      <Section title="🔬 กายวิภาค main.tsx — จุดเริ่มต้นของทุกอย่าง">
        <p>ไฟล์ <code>main.tsx</code> คือจุดเริ่มต้น ที่ React "เข้าไปควบคุม" หน้าเว็บ</p>
        <CodeBlock
          language="tsx"
          filename="src/main.tsx"
          code={`// ① import createRoot จาก react-dom/client
import { createRoot } from 'react-dom/client'

// ② import global CSS
import './index.css'

// ③ import App component (root component)
import App from './App'

// ④ หา <div id="root"> ใน index.html
const rootElement = document.getElementById('root')!
//                                                 ↑ ! บอก TypeScript ว่า "ไม่ใช่ null แน่นอน"

// ⑤ สร้าง React root และ render App เข้าไป
createRoot(rootElement).render(<App />)

// ผลลัพธ์: React ควบคุมทุกอย่างภายใน <div id="root"> ใน index.html`}
        />
        <Callout type="info" title="index.html มีอะไร?">
          <code>{`<div id="root"></div>`}</code> — div เปล่าๆ ที่ React จะ inject UI เข้าไป
          ทุก component ที่เราเขียนจะแสดงผลภายใน div นี้ทั้งหมด
        </Callout>
      </Section>

      <Section title="Demo: เห็น Re-render จริงๆ">
        <DemoBox title="Virtual DOM Demo — กด + แล้วดู Log">
          <div className="flex gap-6 items-start">
            <div className="text-center">
              <div className="text-6xl font-bold text-indigo-600 mb-3">{count}</div>
              <button
                onClick={increment}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
              >
                + เพิ่ม
              </button>
              <p className="text-xs text-slate-400 mt-2">React อัพเดตเฉพาะตัวเลขนี้</p>
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Render Log</p>
              <div className="bg-slate-900 rounded-lg p-3 h-40 overflow-y-auto space-y-1">
                {renderLog.map((log, i) => (
                  <div key={i} className="text-xs font-mono text-green-400">{log}</div>
                ))}
              </div>
            </div>
          </div>
        </DemoBox>
      </Section>

      <Section title="โครงสร้างโปรเจค React">
        <CodeBlock
          language="text"
          filename="Project Structure"
          code={`my-app/
├── public/           ← ไฟล์ static (รูป, favicon) — เข้าถึงได้จาก URL โดยตรง
├── src/              ← โค้ดทั้งหมดอยู่ที่นี่
│   ├── components/   ← Component ที่ใช้ซ้ำได้ (Button, Card, Modal)
│   ├── pages/        ← หน้าต่างๆ (ถ้ามี routing)
│   ├── hooks/        ← Custom hooks (useAuth, useFetch)
│   ├── App.tsx       ← Root component — ทุกอย่างเริ่มจากที่นี่
│   ├── main.tsx      ← Entry point — render App เข้า HTML
│   └── index.css     ← Global CSS
├── index.html        ← HTML shell มี <div id="root">
├── package.json      ← Dependencies และ scripts
├── vite.config.ts    ← Vite bundler config
└── tsconfig.json     ← TypeScript config`}
        />
      </Section>

      <Exercise lessonId="what-is-react" questions={questions} onPass={onPass} />
    </div>
  )
}
