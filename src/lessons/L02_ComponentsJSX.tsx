import { useState } from 'react'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'
import DemoBox from '../components/DemoBox'
import Section from '../components/Section'

export default function L02_ComponentsJSX() {
  const [showBio, setShowBio] = useState(true)
  const [items, setItems] = useState(['Apple', 'Banana', 'Cherry'])
  const [newItem, setNewItem] = useState('')

  return (
    <div>
      <Section title="Component คืออะไร?">
        <p>
          <strong>Component</strong> คือ function ที่ return <strong>JSX</strong> — มันคือ "ชิ้นส่วน" ของ UI
          ที่นำมาประกอบกันเป็นหน้าเว็บ คล้ายกับ LEGO ที่เอาชิ้นเล็กๆ มาต่อเป็นรูปใหญ่
        </p>
        <CodeBlock
          language="tsx"
          filename="components/Button.tsx"
          code={`// Component คือ function ที่ขึ้นต้นด้วยตัวใหญ่เสมอ
function Button() {
  return (
    <button className="px-4 py-2 bg-blue-500 text-white rounded">
      Click me
    </button>
  )
}

// การใช้งาน — เขียนเหมือน HTML tag
function App() {
  return (
    <div>
      <Button />   {/* ใช้ Component เหมือน tag */}
      <Button />   {/* ใช้กี่ครั้งก็ได้ */}
      <Button />
    </div>
  )
}`}
        />
        <Callout type="warning" title="กฎสำคัญ: ชื่อ Component ต้องขึ้นต้นด้วยตัวพิมพ์ใหญ่">
          <code>&lt;Button /&gt;</code> = React Component<br/>
          <code>&lt;button /&gt;</code> = HTML element ธรรมดา<br/>
          ถ้าชื่อเล็ก React จะไม่รู้ว่าเป็น component
        </Callout>
      </Section>

      <Section title="JSX คืออะไร?">
        <p>
          <strong>JSX</strong> (JavaScript XML) คือ syntax พิเศษที่ทำให้เขียน HTML ใน JavaScript ได้
          มันไม่ใช่ HTML จริงๆ — Babel จะแปลงมันเป็น <code>React.createElement()</code> ก่อน browser จะเข้าใจ
        </p>
        <CodeBlock
          language="tsx"
          filename="JSX vs JS"
          code={`// สิ่งที่เราเขียน (JSX)
const element = <h1 className="title">Hello, World!</h1>

// สิ่งที่ Babel แปลงให้ (JavaScript จริงๆ)
const element = React.createElement(
  'h1',
  { className: 'title' },
  'Hello, World!'
)
// เห็นมั้ยว่า JSX แค่ shorthand สำหรับ createElement()`}
        />

        <h3 className="font-bold text-slate-800 mt-6 mb-3">JSX Rules — ข้อแตกต่างจาก HTML</h3>
        <div className="space-y-3">
          {[
            { rule: 'ต้องมี Root element เดียว', bad: '<p>A</p><p>B</p>', good: '<><p>A</p><p>B</p></>', note: 'ใช้ Fragment <> </> ถ้าไม่อยากเพิ่ม div' },
            { rule: 'ใช้ className แทน class', bad: '<div class="red">', good: '<div className="red">', note: 'เพราะ class เป็น keyword ของ JS' },
            { rule: 'ใช้ htmlFor แทน for', bad: '<label for="name">', good: '<label htmlFor="name">', note: 'เพราะ for เป็น keyword ของ JS' },
            { rule: 'Tag ต้องปิดเสมอ', bad: '<br><img src="x">', good: '<br /><img src="x" />', note: 'Self-closing tags ต้องมี /' },
          ].map((item) => (
            <div key={item.rule} className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">{item.rule}</div>
              <div className="grid grid-cols-2 divide-x divide-slate-200">
                <div className="p-3 bg-red-50">
                  <div className="text-xs text-red-500 font-semibold mb-1">❌ ผิด (HTML)</div>
                  <code className="text-xs text-red-700">{item.bad}</code>
                </div>
                <div className="p-3 bg-green-50">
                  <div className="text-xs text-green-500 font-semibold mb-1">✅ ถูก (JSX)</div>
                  <code className="text-xs text-green-700">{item.good}</code>
                </div>
              </div>
              <div className="px-3 py-1.5 bg-yellow-50 text-xs text-yellow-700">💡 {item.note}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Expressions ใน JSX — ใช้ { }">
        <p>
          ใช้ <code>{'{}'}</code> เพื่อแทรก JavaScript expression ใดๆ ก็ได้ใน JSX
        </p>
        <CodeBlock
          language="tsx"
          code={`const name = "สมชาย"
const price = 350
const isVip = true

return (
  <div>
    {/* ตัวแปร */}
    <p>สวัสดี {name}!</p>

    {/* คำนวณ */}
    <p>ราคา: {price * 1.07} บาท (รวม VAT)</p>

    {/* ternary operator */}
    <p>{isVip ? '⭐ VIP Member' : 'ปกติ'}</p>

    {/* เรียก function */}
    <p>{name.toUpperCase()}</p>

    {/* ❌ if statement ใน JSX ไม่ได้ ต้องใช้ ternary หรือ && */}
    {/* {if (isVip) { ... }}  — ผิด! */}
  </div>
)`}
        />
      </Section>

      <Section title="Conditional Rendering">
        <p>การแสดง UI แบบมีเงื่อนไข ทำได้ 2 วิธีหลัก</p>
        <CodeBlock
          language="tsx"
          code={`function UserCard({ isLoggedIn, isAdmin }: { isLoggedIn: boolean; isAdmin: boolean }) {
  return (
    <div>
      {/* วิธี 1: && operator — แสดงถ้า condition เป็น true */}
      {isLoggedIn && <p>ยินดีต้อนรับ!</p>}

      {/* วิธี 2: ternary — แสดง A หรือ B */}
      {isLoggedIn ? <p>เข้าสู่ระบบแล้ว</p> : <p>กรุณา login</p>}

      {/* ซ้อนกันได้ */}
      {isLoggedIn && isAdmin && <button>Admin Panel</button>}
    </div>
  )
}`}
        />
      </Section>

      <Section title="List Rendering — .map()">
        <p>
          การ render รายการ ใช้ <code>.map()</code> และต้องใส่ <code>key</code> prop ที่ไม่ซ้ำกันทุกครั้ง
        </p>
        <CodeBlock
          language="tsx"
          code={`const fruits = ['Apple', 'Banana', 'Cherry']

return (
  <ul>
    {fruits.map((fruit, index) => (
      // key ต้องไม่ซ้ำ — ใช้ id จาก data หรือค่าที่ unique
      // ❌ อย่าใช้ index เป็น key ถ้าลำดับเปลี่ยนได้
      <li key={fruit}>{fruit}</li>
    ))}
  </ul>
)

// key สำคัญแค่ไหน?
// React ใช้ key เพื่อรู้ว่า item ไหนเปลี่ยน/ลบ/เพิ่ม
// ถ้าไม่มี key → React ต้อง re-render ทั้งหมด (ช้า + bugs)`}
        />
        <Callout type="warning" title="ทำไม key ถึงสำคัญ?">
          ลองจิตนาการว่ามีรายการ A, B, C แล้วลบ B ออก
          ถ้าไม่มี key → React คิดว่า A เปลี่ยนเป็น A, B เปลี่ยนเป็น C, ลบ C
          ถ้ามี key → React รู้ว่าลบ B แค่อันเดียว
        </Callout>
      </Section>

      <Section title="Demo: Component + List Interactive">
        <DemoBox title="ทดลอง: เพิ่ม/ลบรายการ + Conditional Rendering">
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newItem.trim()) {
                    setItems([...items, newItem.trim()])
                    setNewItem('')
                  }
                }}
                placeholder="พิมพ์แล้วกด Enter..."
                className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
              />
              <button
                onClick={() => {
                  if (newItem.trim()) {
                    setItems([...items, newItem.trim()])
                    setNewItem('')
                  }
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
              >
                เพิ่ม
              </button>
            </div>

            <div>
              <button
                onClick={() => setShowBio(!showBio)}
                className="text-sm text-indigo-600 underline mb-2"
              >
                {showBio ? 'ซ่อน' : 'แสดง'} รายการ (Conditional Rendering)
              </button>
              {showBio && (
                <ul className="space-y-1">
                  {items.length === 0 ? (
                    <p className="text-slate-400 text-sm">ไม่มีรายการ</p>
                  ) : (
                    items.map((item) => (
                      <li key={item} className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                        <span className="text-sm">🍎 {item}</span>
                        <button
                          onClick={() => setItems(items.filter((i) => i !== item))}
                          className="text-red-400 hover:text-red-600 text-xs"
                        >
                          ลบ
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              )}
            </div>
          </div>
        </DemoBox>
      </Section>
    </div>
  )
}
