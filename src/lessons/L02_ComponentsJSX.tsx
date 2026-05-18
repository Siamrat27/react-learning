import { useState } from 'react'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'
import DemoBox from '../components/DemoBox'
import Section from '../components/Section'
import Exercise, { ExQuestion } from '../components/Exercise'

const questions: ExQuestion[] = [
  {
    type: 'choice',
    question: 'ข้อใดเป็น JSX ที่ถูกต้อง?',
    code: `// เลือกอันที่ถูกต้อง`,
    choices: [
      '<div class="box"><img src="x.png"></div>',
      '<div className="box"><img src="x.png" /></div>',
      '<Div className="box"><img src="x.png" /></Div>',
      '<div className="box"><img src="x.png">',
    ],
    correct: 1,
    explanation:
      'JSX ใช้ className (ไม่ใช่ class), tag ต้องปิดเสมอ (img ต้องมี /), และ HTML element ต้องตัวเล็ก (div ไม่ใช่ Div)',
  },
  {
    type: 'fill',
    question: 'ใน JSX เมื่อต้องการแสดงค่าตัวแปร JavaScript ต้องใช้เครื่องหมาย ___',
    hint: 'เป็น bracket 2 ตัว',
    correct: ['{}', '{ }'],
    explanation:
      'ใช้ {} (curly braces) เพื่อแทรก JavaScript expression ใดๆ ใน JSX เช่น {name}, {count + 1}, {isActive ? "yes" : "no"}',
  },
  {
    type: 'choice',
    question: 'ทำไมต้องใส่ key prop เมื่อ render list ด้วย .map()?',
    choices: [
      'เพื่อให้ CSS selector ทำงานได้',
      'React บังคับให้ใส่ ไม่งั้น error',
      'React ใช้ key เพื่อรู้ว่า item ไหนเปลี่ยน/เพิ่ม/ลบ ทำให้ update เร็วและถูกต้อง',
      'key ใช้สำหรับ sorting ข้อมูล',
    ],
    correct: 2,
    explanation:
      'React ใช้ key เพื่อ track แต่ละ item ใน list ถ้าไม่มี key React ต้อง re-render ทั้งหมดแทนที่จะ update เฉพาะ item ที่เปลี่ยน ส่งผลต้อง performance และอาจเกิด bugs กับ state ของ item',
  },
  {
    type: 'choice',
    question: 'Fragment (<> </>) ใช้ทำอะไร?',
    choices: [
      'สร้าง div ที่มองไม่เห็น',
      'ครอบ elements หลายตัวโดยไม่เพิ่ม DOM element จริงๆ',
      'ทำให้ component โหลดเร็วขึ้น',
      'แทน return statement',
    ],
    correct: 1,
    explanation:
      'JSX ต้องมี root element เดียว ถ้าไม่อยากเพิ่ม div ที่ไม่จำเป็นใน DOM ให้ใช้ Fragment <> </> มันจะหายไปจาก DOM จริงๆ เหลือแค่ children',
  },
  {
    type: 'fill',
    question: 'เติม operator ที่ใช้แสดง element เมื่อ condition เป็น true เท่านั้น: `{isLoggedIn ___ <Dashboard />}`',
    hint: 'short-circuit operator',
    correct: ['&&', 'and'],
    explanation:
      '&& (AND operator) — ถ้า isLoggedIn เป็น true จะ render ส่วนขวา ถ้าเป็น false จะ render ไม่มีอะไร (short-circuit evaluation)',
  },
]

export default function L02_ComponentsJSX({ onPass }: { onPass?: () => void }) {
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
      <Button />   {/* ใช้กี่ครั้งก็ได้ — reusable! */}
      <Button />
    </div>
  )
}`}
        />
        <Callout type="warning" title="กฎสำคัญ: ชื่อ Component ต้องขึ้นต้นด้วยตัวพิมพ์ใหญ่">
          <code>&lt;Button /&gt;</code> = React Component (เรียก function Button())<br />
          <code>&lt;button /&gt;</code> = HTML element ธรรมดา<br />
          ถ้าชื่อเล็ก React จะส่ง <code>&lt;greeting&gt;</code> เป็น string ให้ DOM แทนที่จะเรียก function
        </Callout>
      </Section>

      <Section title="🔬 กายวิภาค JSX — แต่ละส่วนทำอะไร?">
        <CodeBlock
          language="tsx"
          code={`//      ┌── tag name (HTML element หรือ Component)
//      │      ┌── attribute (prop ใน JSX)
//      │      │           ┌── ค่าของ attribute
//      ↓      ↓           ↓
      <button  onClick={handleClick}  className="btn"  disabled={false}>
//                        ↑                   ↑               ↑
//                    {} = JS expression   string ใส่ ""   boolean ใส่ {}
        Click!
//      ↑ children — content ระหว่าง opening/closing tag
      </button>
//      ↑ closing tag ต้องตรงกับ opening`}
        />

        <div className="space-y-3 mt-4">
          <h3 className="font-bold text-slate-800">ความแตกต่าง JSX vs HTML ที่พบบ่อย:</h3>
          {[
            { attr: 'class', jsx: 'className', reason: 'class เป็น reserved word ใน JavaScript' },
            { attr: 'for', jsx: 'htmlFor', reason: 'for เป็น reserved word ใน JavaScript (for loop)' },
            { attr: 'onclick', jsx: 'onClick', reason: 'JSX ใช้ camelCase: onClick, onChange, onSubmit' },
            { attr: 'style="color:red"', jsx: 'style={{ color: "red" }}', reason: 'style ต้องเป็น JS object ใน {{}}' },
            { attr: '<br>', jsx: '<br />', reason: 'ทุก tag ต้องปิด รวม self-closing tags' },
          ].map((row) => (
            <div key={row.attr} className="grid grid-cols-5 gap-2 items-start text-sm">
              <code className="col-span-1 text-red-600 bg-red-50 px-2 py-1 rounded text-xs">{row.attr}</code>
              <span className="text-slate-400 text-center">→</span>
              <code className="col-span-1 text-green-700 bg-green-50 px-2 py-1 rounded text-xs">{row.jsx}</code>
              <span className="col-span-2 text-slate-500 text-xs leading-tight">{row.reason}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="JSX คืออะไรจริงๆ? (ภายใต้ hood)">
        <p>
          <strong>JSX</strong> ไม่ใช่ HTML — มันคือ syntax พิเศษที่ Babel แปลงเป็น JavaScript ก่อน browser รัน
        </p>
        <CodeBlock
          language="tsx"
          filename="สิ่งที่เราเขียน vs สิ่งที่ browser เห็น"
          code={`// สิ่งที่เราเขียน (JSX)
const element = (
  <h1 className="title" id="heading">
    Hello, {name}!
  </h1>
)

// สิ่งที่ Babel แปลงให้ (JavaScript จริงๆ)
const element = React.createElement(
  'h1',                              // tag name
  { className: 'title', id: 'heading' },  // props object
  'Hello, ',                         // children...
  name,
  '!'
)

// เห็นมั้ยว่า JSX แค่ shorthand สำหรับ React.createElement()
// เราเขียน JSX เพราะอ่านง่ายกว่ามาก!`}
        />
        <Callout type="tip" title="JSX ต้อง return element เดียวเสมอ">
          เพราะ <code>React.createElement()</code> return ได้ครั้งละ 1 element
          ถ้าต้องการหลาย element ต้องใช้ wrapper หรือ Fragment <code>&lt;&gt;&lt;/&gt;</code>
        </Callout>
      </Section>

      <Section title="Expressions ใน JSX — ใช้ { }">
        <p>ใช้ <code>{'{}'}</code> เพื่อแทรก JavaScript expression ใดๆ ก็ได้ใน JSX</p>
        <CodeBlock
          language="tsx"
          code={`const name = "สมชาย"
const price = 350
const isVip = true
const items = ['A', 'B', 'C']

return (
  <div>
    {/* ✅ ตัวแปร */}
    <p>สวัสดี {name}!</p>

    {/* ✅ คำนวณ */}
    <p>ราคา: {price * 1.07} บาท (รวม VAT)</p>

    {/* ✅ ternary operator — A ถ้า condition true, B ถ้า false */}
    <p>{isVip ? '⭐ VIP Member' : 'สมาชิกทั่วไป'}</p>

    {/* ✅ เรียก method */}
    <p>{name.toUpperCase()}</p>

    {/* ✅ array.length */}
    <p>มี {items.length} รายการ</p>

    {/* ❌ if statement ใช้ใน JSX ไม่ได้ */}
    {/* {if (isVip) { return <span>VIP</span> }} */}

    {/* ✅ แก้ด้วย && หรือ ternary */}
    {isVip && <span>⭐ VIP</span>}
  </div>
)`}
        />
        <Callout type="warning" title="ถ้าใส่ if statement ใน JSX จะเกิดอะไร?">
          Error ทันที: <code>Unexpected token 'if'</code> — เพราะ <code>{`{}`}</code> ใน JSX รับได้แค่ expression
          (อะไรก็ตามที่มีค่า) ไม่ใช่ statement (เช่น if, for, while)
        </Callout>
      </Section>

      <Section title="Event Handling — รับ Input จาก User">
        <CodeBlock
          language="tsx"
          code={`function Form() {
  const [text, setText] = useState('')

  // Event handler รับ event object เสมอ
  // e.target.value = ค่าที่ user พิมพ์
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setText(e.target.value)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()   // ❗ ต้องมี! ป้องกัน browser reload หน้า
    console.log('submitted:', text)
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* onChange fire ทุกครั้งที่พิมพ์ */}
      <input
        value={text}
        onChange={handleChange}
        // หรือเขียนสั้นกว่า:
        // onChange={(e) => setText(e.target.value)}
      />
      <button type="submit">ส่ง</button>
      <p>พิมพ์: {text}</p>
    </form>
  )
}`}
        />
        <Callout type="info" title="Common Events ที่ใช้บ่อย">
          <code>onClick</code> — กดปุ่ม / คลิก element<br />
          <code>onChange</code> — พิมพ์ใน input / เปลี่ยนค่า<br />
          <code>onSubmit</code> — ส่ง form<br />
          <code>onKeyDown</code> — กดปุ่มบน keyboard<br />
          <code>onMouseEnter</code> / <code>onMouseLeave</code> — hover
        </Callout>
      </Section>

      <Section title="Conditional Rendering">
        <CodeBlock
          language="tsx"
          code={`function UserPanel({ isLoggedIn, isAdmin, loading }: {
  isLoggedIn: boolean
  isAdmin: boolean
  loading: boolean
}) {
  // ① Early return — ถ้า loading ให้ return ก่อน ไม่ต้องดู condition อื่น
  if (loading) return <Spinner />

  return (
    <div>
      {/* ② && — แสดงเฉพาะเมื่อ true */}
      {isLoggedIn && <p>ยินดีต้อนรับ!</p>}

      {/* ③ ternary — แสดง A หรือ B */}
      {isLoggedIn
        ? <p>เข้าสู่ระบบแล้ว</p>
        : <button>Login</button>
      }

      {/* ④ ซ้อนกันได้ */}
      {isLoggedIn && isAdmin && <button>Admin Panel</button>}

      {/* ⚠️ ระวัง: 0 && <p>text</p> จะ render เลข 0 ออกมา! */}
      {/* ✅ แก้ด้วย: Boolean(count) && <p>text</p> */}
    </div>
  )
}`}
        />
        <Callout type="warning" title="ข้อควรระวัง: 0 && element">
          JavaScript ถือว่า <code>0</code> เป็น falsy แต่ JSX จะ render <code>0</code> ออกมาเป็นตัวเลข!
          ถ้าเขียน <code>{`{count && <List />}`}</code> และ count = 0 จะเห็นเลข 0 บนหน้าจอ
          แก้ด้วย <code>{`{count > 0 && <List />}`}</code> หรือ <code>{`{!!count && <List />}`}</code>
        </Callout>
      </Section>

      <Section title="List Rendering — .map()">
        <p>การ render รายการ ใช้ <code>.map()</code> และต้องใส่ <code>key</code> prop ที่ไม่ซ้ำกันทุกครั้ง</p>
        <CodeBlock
          language="tsx"
          code={`interface Product {
  id: number
  name: string
  price: number
}

const products: Product[] = [
  { id: 1, name: 'Apple', price: 20 },
  { id: 2, name: 'Banana', price: 10 },
]

return (
  <ul>
    {products.map((product) => (
      // ✅ ใช้ id จาก data เป็น key — unique และ stable
      <li key={product.id}>
        {product.name} — {product.price} บาท
      </li>
      // ❌ อย่าใช้ index เป็น key ถ้าลำดับเปลี่ยนได้
      // key={index}  ← ถ้าเพิ่ม/ลบ item ลำดับเปลี่ยน → React สับสน → bugs
    ))}
  </ul>
)

// กรณีที่ใช้ index เป็น key ได้: list ที่ไม่มีวันเปลี่ยนลำดับ/เพิ่ม/ลบ`}
        />
        <Callout type="warning" title="ถ้าไม่ใส่ key จะเกิดอะไร?">
          React จะ warn ใน console: <code>Each child in a list should have a unique "key" prop</code>
          และถ้า list เปลี่ยนแปลง React อาจ re-render ผิด item หรือ state ของ item ผิดที่
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
              <button onClick={() => setShowBio(!showBio)} className="text-sm text-indigo-600 underline mb-2">
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
                        <button onClick={() => setItems(items.filter((i) => i !== item))} className="text-red-400 hover:text-red-600 text-xs">ลบ</button>
                      </li>
                    ))
                  )}
                </ul>
              )}
            </div>
          </div>
        </DemoBox>
      </Section>

      <Exercise lessonId="components-jsx" questions={questions} onPass={onPass} />
    </div>
  )
}
