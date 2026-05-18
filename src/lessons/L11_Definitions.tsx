import { useState } from 'react'
import Section from '../components/Section'
import Callout from '../components/Callout'
import Exercise, { ExQuestion } from '../components/Exercise'

interface TermDef {
  term: string
  termEn: string
  category: string
  definition: string
  example?: string
  analogy?: string
}

const glossary: TermDef[] = [
  {
    term: 'Dependency', termEn: 'Dependency',
    category: 'Project',
    definition: 'Software ภายนอกที่โปรเจคเราต้องพึ่งพา เช่น axios, react-router เก็บไว้ใน package.json',
    example: 'npm install axios → axios เป็น dependency ของโปรเจค',
    analogy: 'เหมือนวัตถุดิบที่ร้านอาหารต้องสั่งจากซัพพลายเออร์',
  },
  {
    term: 'Container Component', termEn: 'Container / Smart Component',
    category: 'React',
    definition: 'Component ที่จัดการ state, logic, และการ fetch data แล้วส่งผ่าน props ให้ Presentational Component แสดงผล',
    example: 'UserListContainer fetch users แล้วส่งให้ UserList แสดง',
    analogy: 'เหมือนหัวหน้าครัวที่จัดการวัตถุดิบ → ส่งต่อให้คนทำอาหาร',
  },
  {
    term: 'Presentational Component', termEn: 'Dumb / Presentational Component',
    category: 'React',
    definition: 'Component ที่รับ props แล้วแสดงผลอย่างเดียว ไม่มี state ของตัวเอง ทำให้ reuse ได้ง่าย',
    example: 'Button, Card, Avatar — รับ props และ render เท่านั้น',
  },
  {
    term: 'State', termEn: 'State',
    category: 'React',
    definition: 'ข้อมูลใน component ที่เมื่อเปลี่ยนแปลงแล้วทำให้ UI re-render จัดการด้วย useState หรือ state management library',
    example: 'จำนวนสินค้าในตะกร้า, ข้อความใน input, สถานะ loading',
    analogy: 'เหมือน "หน่วยความจำ" ของ component ณ ขณะนั้น',
  },
  {
    term: 'Props', termEn: 'Props (Properties)',
    category: 'React',
    definition: 'ข้อมูลที่ส่งจาก Parent → Child component ทางเดียว (read-only ใน child) ทำให้ component configurable',
    example: '<Button label="Save" onClick={handleSave} variant="primary" />',
    analogy: 'เหมือน parameter ของ function',
  },
  {
    term: 'Side Effect', termEn: 'Side Effect',
    category: 'React',
    definition: 'การกระทำที่เกิดขึ้นนอกการ render: fetch data, timer, event listener, DOM manipulation จัดการด้วย useEffect',
    example: 'useEffect(() => { fetch(\'/api/data\') }, [])',
  },
  {
    term: 'Render', termEn: 'Render',
    category: 'React',
    definition: 'กระบวนการที่ React เรียก function component แล้วสร้าง Virtual DOM จาก JSX ที่ return มา',
    example: 'ทุกครั้งที่ state/props เปลี่ยน React จะ render component ใหม่',
    analogy: 'เหมือนการวาดรูปใหม่ทุกครั้งที่ภาพเปลี่ยน',
  },
  {
    term: 'Re-render', termEn: 'Re-render',
    category: 'React',
    definition: 'การที่ React render component ซ้ำเมื่อ state หรือ props เปลี่ยน React จะเปรียบเทียบ Virtual DOM และอัพเดตเฉพาะส่วนที่เปลี่ยน',
  },
  {
    term: 'Virtual DOM', termEn: 'Virtual DOM',
    category: 'React',
    definition: 'สำเนา DOM ที่เก็บใน JavaScript memory React ใช้เปรียบเทียบกับ Real DOM เพื่อหาส่วนที่ต้องอัพเดต (Diffing)',
    analogy: 'เหมือน draft ของเอกสาร ก่อน submit จริง',
  },
  {
    term: 'Reconciliation', termEn: 'Reconciliation',
    category: 'React',
    definition: 'กระบวนการที่ React เปรียบเทียบ Virtual DOM ใหม่กับเก่า (Diffing) เพื่อหาส่วนที่เปลี่ยนและอัพเดต Real DOM ให้น้อยที่สุด',
  },
  {
    term: 'SPA', termEn: 'Single Page Application',
    category: 'Architecture',
    definition: 'เว็บที่โหลด HTML ครั้งเดียว แล้ว JavaScript จัดการเปลี่ยนหน้าโดยไม่ reload ทำให้เร็วและ UX ดี เช่น Gmail, Facebook',
    example: 'React ด้วย React Router เป็น SPA',
    analogy: 'เหมือนแอปมือถือที่เปลี่ยน "view" โดยไม่ต้องเปิดแอปใหม่',
  },
  {
    term: 'Immutability', termEn: 'Immutability',
    category: 'Concept',
    definition: 'แนวคิดที่ว่าไม่แก้ข้อมูลเดิมโดยตรง แต่สร้างข้อมูลใหม่ที่มีการเปลี่ยนแปลงแทน React ต้องการสิ่งนี้เพื่อตรวจจับการเปลี่ยนแปลง',
    example: 'setItems([...items, newItem]) แทน items.push(newItem)',
  },
  {
    term: 'Pure Function', termEn: 'Pure Function',
    category: 'Concept',
    definition: 'Function ที่ให้ output เดิมเสมอเมื่อรับ input เดิม และไม่มี side effects React component ควรเป็น pure function ของ state+props',
    example: 'const double = (n) => n * 2 — pure, const rand = () => Math.random() — ไม่ pure',
  },
  {
    term: 'Lifting State Up', termEn: 'Lifting State Up',
    category: 'React',
    definition: 'การย้าย state ขึ้นไปอยู่ที่ ancestor ที่ต่ำที่สุดที่ทุก component ต้องการ state นั้นเข้าถึงได้ แล้วส่ง props ลงมา',
    example: 'SearchBox และ ResultList ต้องใช้ query เดียวกัน → ย้าย query state ขึ้น Parent',
  },
  {
    term: 'Prop Drilling', termEn: 'Prop Drilling',
    category: 'React',
    definition: 'การส่ง props ผ่าน component หลายชั้นที่ไม่ได้ใช้ข้อมูลนั้น เพียงแค่ส่งต่อ ทำให้โค้ดยุ่งยาก แก้ด้วย Context หรือ state management',
    analogy: 'เหมือนส่งจดหมายผ่านคนกลางหลายคนที่ไม่เกี่ยวข้อง',
  },
  {
    term: 'Context', termEn: 'React Context',
    category: 'React',
    definition: 'API ของ React สำหรับแชร์ state ระหว่าง component โดยไม่ต้องส่ง props ลงทุก level แก้ปัญหา Prop Drilling',
    example: 'UserContext, ThemeContext — ทุก component ใน tree เข้าถึงได้ด้วย useContext()',
  },
  {
    term: 'Hook', termEn: 'Hook',
    category: 'React',
    definition: 'Function พิเศษใน React ที่ชื่อขึ้นต้นด้วย use ทำให้ function component ใช้ features อย่าง state, lifecycle ได้',
    example: 'useState, useEffect, useContext, useCallback, useMemo, useRef',
  },
  {
    term: 'Bundle', termEn: 'Bundle / Bundler',
    category: 'Tooling',
    definition: 'การรวมไฟล์ JS/CSS หลายไฟล์เป็นไฟล์เดียว (หรือน้อยไฟล์) สำหรับ production Vite และ Webpack เป็น bundler ยอดนิยม',
    analogy: 'เหมือนการรวมหนังสือหลายเล่มเป็นชุดเดียวเพื่อส่งให้ลูกค้า',
  },
  {
    term: 'HMR', termEn: 'Hot Module Replacement',
    category: 'Tooling',
    definition: 'Feature ของ dev server ที่อัพเดต module ใน browser ทันทีที่ไฟล์เปลี่ยน โดยไม่ต้อง reload หน้าทั้งหมด ทำให้ development เร็ว',
  },
  {
    term: 'Tree Shaking', termEn: 'Tree Shaking',
    category: 'Tooling',
    definition: 'กระบวนการที่ bundler ลบ code ที่ไม่ได้ใช้ออกจาก bundle ทำให้ขนาดไฟล์เล็กลง ใช้ได้กับ ES Module (import/export)',
    example: 'import { get } from \'axios\' แทน import axios → ลดขนาด bundle',
  },
  {
    term: 'Type Safety', termEn: 'Type Safety',
    category: 'TypeScript',
    definition: 'ความสามารถในการตรวจสอบ type ของข้อมูลตั้งแต่ compile time ป้องกัน bug ที่เกิดจากการใช้ข้อมูลผิดประเภท',
  },
  {
    term: 'Hydration', termEn: 'Hydration',
    category: 'Advanced',
    definition: 'กระบวนการที่ React "ผนวก" event listeners และ state เข้ากับ HTML ที่ server render มาแล้ว ใช้ใน Next.js และ SSR',
  },
  {
    term: 'SSR', termEn: 'Server-Side Rendering',
    category: 'Advanced',
    definition: 'การ render HTML ที่ server แทน browser ทำให้ user เห็นเนื้อหาเร็วกว่า และ SEO ดีกว่า ใช้กับ Next.js',
  },
  {
    term: 'CSR', termEn: 'Client-Side Rendering',
    category: 'Advanced',
    definition: 'การ render HTML ที่ browser ด้วย JavaScript React ปกติทำแบบนี้ SEO ไม่ดีเท่า SSR แต่ UX ดี',
  },
  {
    term: 'API', termEn: 'Application Programming Interface',
    category: 'Web',
    definition: 'ช่องทางที่ software สื่อสารกัน ใน web dev มักหมายถึง REST API ที่รับส่งข้อมูลแบบ JSON ผ่าน HTTP',
    example: 'GET /api/users → server ส่ง list ของ users กลับมา',
  },
  {
    term: 'REST', termEn: 'REST (REpresentational State Transfer)',
    category: 'Web',
    definition: 'รูปแบบการออกแบบ API ที่ใช้ HTTP methods (GET, POST, PUT, DELETE) และ URL paths เป็น resource identifiers',
    example: 'GET /users, POST /users, PUT /users/1, DELETE /users/1',
  },
  {
    term: 'JSON', termEn: 'JavaScript Object Notation',
    category: 'Web',
    definition: 'รูปแบบข้อมูล text ที่ใช้แลกเปลี่ยนระหว่าง client และ server มีรูปแบบคล้าย JavaScript object',
    example: '{"id": 1, "name": "สมชาย", "active": true}',
  },
]

const categories = ['ทั้งหมด', ...Array.from(new Set(glossary.map((g) => g.category)))]

const questions: ExQuestion[] = [
  {
    type: 'choice',
    question: 'Virtual DOM คืออะไร?',
    choices: [
      'DOM ที่สร้างด้วย VR technology',
      'สำเนา DOM ใน JavaScript memory ที่ React ใช้เปรียบเทียบก่อนอัพเดต Real DOM',
      'DOM ที่โหลดเร็วกว่า Real DOM',
      'DOM ที่ใช้ใน server-side rendering เท่านั้น',
    ],
    correct: 1,
    explanation:
      'Virtual DOM คือ JavaScript object ที่แทน DOM tree React เปรียบเทียบ Virtual DOM ใหม่กับเก่า (Diffing/Reconciliation) เพื่อหาส่วนที่เปลี่ยนและอัพเดต Real DOM เฉพาะส่วนนั้น ทำให้เร็วกว่าการอัพเดต DOM ทั้งหมด',
  },
  {
    type: 'choice',
    question: '"Prop Drilling" คืออะไรและแก้ได้ด้วยอะไร?',
    choices: [
      'การส่ง props หลายตัวพร้อมกัน แก้ด้วยการรวม props เป็น object เดียว',
      'การส่ง props ผ่าน component หลายชั้นที่ไม่ได้ใช้ แก้ด้วย Context หรือ state management',
      'การใช้ props ผิด type แก้ด้วย TypeScript',
      'การส่ง callback props แก้ด้วย useState',
    ],
    correct: 1,
    explanation:
      'Prop Drilling = ส่ง props ผ่าน component กลางๆ ที่ไม่ได้ใช้ เพื่อส่งต่อให้ component ลึกๆ ทำให้โค้ดยุ่ง แก้ด้วย React Context (useContext) หรือ state management library เช่น Zustand, Redux',
  },
  {
    type: 'fill',
    question: 'การที่ React เปรียบเทียบ Virtual DOM ใหม่กับเก่าเพื่อหาส่วนที่ต้องอัพเดตเรียกว่า ___',
    hint: 'กระบวนการ "ประนีประนอม" ระหว่าง DOM เก่าและใหม่',
    correct: ['Reconciliation', 'reconciliation', 'Diffing', 'diffing'],
    explanation:
      'Reconciliation คือกระบวนการที่ React เปรียบเทียบ (Diff) Virtual DOM ใหม่กับเก่า เพื่อหาส่วนที่ต้องการอัพเดต แล้วอัพเดต Real DOM เฉพาะส่วนนั้น ทำให้ performance ดีกว่าการ re-render ทั้งหมด',
  },
  {
    type: 'choice',
    question: 'SPA (Single Page Application) ต่างจากเว็บปกติอย่างไร?',
    choices: [
      'SPA มีแค่หน้าเดียว ทำอะไรไม่ได้มาก',
      'SPA โหลด HTML ครั้งเดียว JavaScript เปลี่ยน view โดยไม่ reload ทำให้ UX เหมือนแอป',
      'SPA เร็วกว่าเว็บปกติเสมอในทุกกรณี',
      'SPA ไม่ต้องการ server',
    ],
    correct: 1,
    explanation:
      'SPA โหลด HTML/JS ครั้งแรกครั้งเดียว เมื่อเปลี่ยน "หน้า" JavaScript อัพเดต DOM โดยไม่ reload ทำให้รู้สึกเหมือนแอปมือถือ ข้อเสีย: SEO ทำได้ยากกว่าและ initial load ช้ากว่า (แก้ด้วย SSR/Next.js)',
  },
]

export default function L11_Definitions({ onPass }: { onPass?: () => void }) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('ทั้งหมด')
  const [expanded, setExpanded] = useState<string | null>(null)

  const filtered = glossary.filter((g) => {
    const matchCat = activeCategory === 'ทั้งหมด' || g.category === activeCategory
    const matchSearch = !search ||
      g.term.toLowerCase().includes(search.toLowerCase()) ||
      g.termEn.toLowerCase().includes(search.toLowerCase()) ||
      g.definition.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div>
      <Section title="ทำไมต้องรู้ Glossary?">
        <p>
          เมื่ออ่าน documentation, ดู tutorial, หรือคุยกับทีม จะเจอคำเหล่านี้บ่อย
          การรู้ความหมายทำให้เข้าใจบทสนทนาและโค้ดได้เร็วขึ้นมาก
        </p>
        <Callout type="tip" title="วิธีใช้">
          ค้นหาด้วย Search Box หรือกรองด้วย Category
          กดที่คำเพื่อดูรายละเอียด, ตัวอย่าง, และ analogy
        </Callout>
      </Section>

      <Section title={`Glossary (${filtered.length} คำ)`}>
        {/* Search */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาคำ..."
            className="flex-1 min-w-48 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
          />
        </div>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap mb-5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Terms */}
        <div className="space-y-2">
          {filtered.map((g) => (
            <div
              key={g.term}
              className="border border-slate-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setExpanded(expanded === g.term ? null : g.term)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 text-left"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      g.category === 'React' ? 'bg-blue-100 text-blue-700' :
                      g.category === 'TypeScript' ? 'bg-purple-100 text-purple-700' :
                      g.category === 'Web' ? 'bg-green-100 text-green-700' :
                      g.category === 'Tooling' ? 'bg-orange-100 text-orange-700' :
                      g.category === 'Concept' ? 'bg-pink-100 text-pink-700' :
                      g.category === 'Architecture' ? 'bg-indigo-100 text-indigo-700' :
                      'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {g.category}
                  </span>
                  <span className="font-semibold text-slate-800 text-sm">{g.term}</span>
                  <span className="text-slate-400 text-xs hidden sm:inline">({g.termEn})</span>
                </div>
                <span className="text-slate-400 text-xs ml-2">{expanded === g.term ? '▲' : '▼'}</span>
              </button>

              {expanded === g.term && (
                <div className="px-4 pb-4 space-y-2 border-t border-slate-100 pt-3 bg-slate-50">
                  <p className="text-slate-700 text-sm leading-relaxed">{g.definition}</p>
                  {g.analogy && (
                    <div className="flex gap-2 bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                      <span>💡</span>
                      <p className="text-yellow-700 text-xs">{g.analogy}</p>
                    </div>
                  )}
                  {g.example && (
                    <div className="bg-slate-900 rounded-lg px-3 py-2">
                      <p className="text-green-400 text-xs font-mono">{g.example}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-slate-400 py-8">ไม่พบคำที่ค้นหา</p>
          )}
        </div>
      </Section>

      <Exercise lessonId="definitions" questions={questions} onPass={onPass} />
    </div>
  )
}
