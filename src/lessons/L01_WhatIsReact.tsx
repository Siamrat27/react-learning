import { useState } from 'react'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'
import DemoBox from '../components/DemoBox'
import Section from '../components/Section'

export default function L01_WhatIsReact() {
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
          เอาไว้สำหรับสร้าง <strong>User Interface (UI)</strong> หรือ หน้าเว็บที่ผู้ใช้เห็นและโต้ตอบด้วย
        </p>
        <Callout type="definition" title="Library vs Framework">
          <strong>Library</strong> = เครื่องมือที่เราเรียกใช้เอง เราควบคุม flow <br/>
          <strong>Framework</strong> = โครงสร้างที่ควบคุม flow เอง มันเรียกโค้ดเรา <br/>
          React เป็น Library → เราเลือกใช้เมื่อไหร่ก็ได้ ไม่ได้บังคับ structure
        </Callout>
        <p>
          ก่อน React นักพัฒนาต้องจัดการ DOM ด้วยมือผ่าน <code>document.getElementById</code>,
          <code>innerHTML</code> ซึ่งยุ่งยากมากเมื่อ UI ซับซ้อนขึ้น React แก้ปัญหานี้ด้วยแนวคิด
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
          Declarative = "ฉันอยากได้กาแฟ" (บอกผลลัพธ์)<br/>
          Imperative = "ต้มน้ำ → ใส่กาแฟ → เติมน้ำตาล → คน" (บอกทุก step)
        </Callout>
      </Section>

      <Section title="Demo: เห็น Re-render จริงๆ">
        <p>กดปุ่มแล้วดูว่า React re-render component เมื่อ state เปลี่ยน</p>
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
├── public/           ← ไฟล์ static (รูป, favicon)
├── src/              ← โค้ดทั้งหมดอยู่ที่นี่
│   ├── components/   ← Component ที่ใช้ซ้ำได้
│   ├── pages/        ← หน้าต่างๆ (ถ้ามี routing)
│   ├── hooks/        ← Custom hooks
│   ├── App.tsx       ← Root component
│   ├── main.tsx      ← Entry point (render App เข้า HTML)
│   └── index.css     ← Global CSS
├── index.html        ← HTML shell มี <div id="root">
├── package.json      ← Dependencies และ scripts
├── vite.config.ts    ← Vite bundler config
└── tsconfig.json     ← TypeScript config`}
        />
        <Callout type="info" title="main.tsx ทำอะไร?">
          <code>createRoot(document.getElementById('root')!).render(&lt;App /&gt;)</code> คือการเอา
          App component ไป "render" ลงใน <code>&lt;div id="root"&gt;</code> ใน index.html
          ทำให้ React ควบคุมทุกอย่างใน div นั้น
        </Callout>
      </Section>
    </div>
  )
}
