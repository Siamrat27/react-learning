import { useState } from 'react'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'
import DemoBox from '../components/DemoBox'
import Section from '../components/Section'
import Exercise, { ExQuestion } from '../components/Exercise'

interface TodoItem {
  id: number
  text: string
  done: boolean
}

const questions: ExQuestion[] = [
  {
    type: 'choice',
    question: 'ทำไมต้องใช้ useState แทน plain variable?',
    choices: [
      'เพราะ let และ const ใช้ใน React ไม่ได้',
      'เพราะ React ไม่รู้ว่า variable เปลี่ยนค่า → ไม่ re-render → UI ไม่อัพเดต',
      'เพราะ useState เร็วกว่า variable ธรรมดา',
      'ไม่มีเหตุผลพิเศษ แค่เป็น convention',
    ],
    correct: 1,
    explanation:
      'React re-render component เฉพาะเมื่อ state (useState) เปลี่ยนเท่านั้น ถ้าแก้ plain variable ตรงๆ React ไม่รู้ว่ามีการเปลี่ยนแปลง → UI ไม่อัพเดต แม้ตัวแปรจะเปลี่ยนก็ตาม',
  },
  {
    type: 'fill',
    question: 'เติมให้ครบ: `const [count, ___] = useState(0)` — ชื่อ function สำหรับอัพเดต state',
    hint: 'convention คือ set + ชื่อ state',
    correct: ['setCount', 'setcount'],
    explanation:
      'Convention คือตั้งชื่อ setter ว่า set + ชื่อ state เช่น count → setCount, name → setName, isOpen → setIsOpen เพื่อให้อ่านโค้ดได้ชัดเจน',
  },
  {
    type: 'choice',
    question: 'Immutability ใน React หมายความว่าอะไร?',
    code: `const [items, setItems] = useState([1, 2, 3])

// ❌ vs ✅ ?
items.push(4)         // แบบ A
setItems([...items, 4]) // แบบ B`,
    codeLanguage: 'tsx',
    choices: [
      'แบบ A ถูกต้อง เพราะแก้ array ตรงๆ ง่ายกว่า',
      'แบบ B ถูกต้อง เพราะสร้าง array ใหม่ ทำให้ React รู้ว่า state เปลี่ยน',
      'ทั้งคู่ถูกต้อง ผลลัพธ์เหมือนกัน',
      'ทั้งคู่ผิด ต้องใช้ array.concat แทน',
    ],
    correct: 1,
    explanation:
      'React ตรวจ state เปลี่ยนด้วย === (reference comparison) items.push() แก้ array เดิม (reference เดิม) → React คิดว่าไม่เปลี่ยน [...items, 4] สร้าง array ใหม่ → reference ใหม่ → React รู้ว่าต้อง re-render',
  },
  {
    type: 'fill',
    question: 'Functional update: `setCount(___ => ___ + 1)` — เติม parameter name (ชื่ออะไรก็ได้ แต่ convention คืออะไร?)',
    hint: 'ย่อมาจาก "previous value"',
    correct: ['prev', 'prevCount', 'previous'],
    explanation:
      'Functional update ใช้เมื่อค่าใหม่ขึ้นอยู่กับค่าเก่า เช่น setCount(prev => prev + 1) ดีกว่า setCount(count + 1) เพราะ prev รับค่า state ล่าสุดเสมอ ป้องกัน stale closure bug',
  },
]

export default function L04_useState({ onPass }: { onPass?: () => void }) {
  const [count, setCount] = useState(0)
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: 1, text: 'เรียน React', done: false },
    { id: 2, text: 'เรียน TypeScript', done: false },
  ])
  const [input, setInput] = useState('')
  const [nextId, setNextId] = useState(3)

  const addTodo = () => {
    if (!input.trim()) return
    setTodos([...todos, { id: nextId, text: input.trim(), done: false }])
    setNextId(nextId + 1)
    setInput('')
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((t) => t.id !== id))
  }

  return (
    <div>
      <Section title="State คืออะไร?">
        <p>
          <strong>State</strong> คือข้อมูลที่เมื่อเปลี่ยนแล้ว <strong>UI ต้องอัพเดตตาม</strong>
          เช่น จำนวนสินค้าในตะกร้า, ข้อความที่ user พิมพ์, สถานะ loading
        </p>
        <CodeBlock
          language="tsx"
          filename="ทำไม plain variable ไม่พอ"
          code={`// ❌ ใช้ตัวแปรธรรมดา — React ไม่รู้ว่าเปลี่ยน
function Counter() {
  let count = 0   // plain variable
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => { count++ }}>
        {/* กดแล้ว count++ แต่ UI ไม่อัพเดต! */}
        +
      </button>
    </div>
  )
}

// ✅ ใช้ useState — React รู้ว่าต้อง re-render
function Counter() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
      {/* กดแล้ว React re-render → UI อัพเดต! */}
    </div>
  )
}`}
        />
        <Callout type="definition" title="🔬 Anatomy ของ useState">
          <code>const [count, setCount] = useState(0)</code><br /><br />
          ├── <code>useState</code> — Hook function ที่ React ให้มา<br />
          ├── <code>(0)</code> — ค่าเริ่มต้น (initial value) ใช้แค่ครั้งแรกที่ mount<br />
          ├── <code>count</code> — ค่าปัจจุบันของ state (read-only — อย่าแก้โดยตรง!)<br />
          └── <code>setCount</code> — function สำหรับอัพเดต state (trigger re-render)
        </Callout>
      </Section>

      <Section title="🔬 Re-render Cycle — เกิดอะไรขึ้นเมื่อ state เปลี่ยน">
        <CodeBlock
          language="text"
          code={`1. User กดปุ่ม → onClick ทำงาน
2. setCount(count + 1) ถูกเรียก
3. React บันทึกค่า state ใหม่
4. React เรียก function Counter() ใหม่ (re-render)
5. ตัวแปร count มีค่าใหม่แล้ว (จากที่ React บันทึกไว้)
6. JSX ใหม่ถูกสร้าง → Virtual DOM ใหม่
7. React diff ระหว่าง Virtual DOM เก่ากับใหม่
8. อัพเดต Real DOM เฉพาะตรงที่เปลี่ยน (เฉพาะตัวเลข)
→ User เห็นตัวเลขใหม่บนหน้าจอ`}
        />
        <Callout type="info" title="ทุก render คือการ เรียก function ใหม่">
          เมื่อ React re-render มันเรียก <code>Counter()</code> ใหม่ทั้งหมด แต่ state ไม่หาย
          เพราะ React เก็บ state ไว้แยกต่างหาก ไม่ใช่ใน function
          ทุก render จะได้ "snapshot" ของ state ณ เวลานั้น
        </Callout>
      </Section>

      <Section title="useState กับ Type ต่างๆ">
        <CodeBlock
          language="tsx"
          code={`// ① String
const [name, setName] = useState<string>('')
setName('สมชาย')

// ② Number
const [count, setCount] = useState<number>(0)
setCount(count + 1)
setCount(prev => prev + 1)   // functional update — ดีกว่าเมื่อขึ้นกับค่าเก่า

// ③ Boolean (toggle pattern)
const [isOpen, setIsOpen] = useState<boolean>(false)
setIsOpen(true)
setIsOpen(prev => !prev)    // toggle

// ④ Array — ต้องสร้าง array ใหม่ทุกครั้ง (immutability!)
const [items, setItems] = useState<string[]>([])
setItems([...items, 'newItem'])             // เพิ่ม
setItems(items.filter(i => i !== 'x'))      // ลบ
setItems(items.map(i => i === 'old' ? 'new' : i))  // แก้ไข

// ⑤ Object — ต้องสร้าง object ใหม่ (spread operator)
const [user, setUser] = useState({ name: '', email: '' })
setUser({ ...user, name: 'สมชาย' })    // แก้เฉพาะ field name
setUser(prev => ({ ...prev, email: 'new@mail.com' }))

// ⑥ Nullable (ยังไม่มีข้อมูล = null)
const [data, setData] = useState<User | null>(null)
// ก่อนใช้ data ต้อง check: if (data) { ... }`}
        />
      </Section>

      <Section title="Functional Update — สำคัญมากเมื่ออัพเดตจากค่าเก่า">
        <CodeBlock
          language="tsx"
          code={`// ❌ อาจเกิด bug เมื่อ setState เรียกหลายครั้งติดกัน
function badTripleIncrement() {
  setCount(count + 1)  // count = 5 → set 6
  setCount(count + 1)  // count ยัง 5! (React batch updates) → set 6 อีก
  setCount(count + 1)  // count ยัง 5! → set 6 อีก
  // ผลลัพธ์: count = 6 (ผิด! ควรได้ 8)
}

// ✅ Functional update — ใช้ prev ล่าสุดเสมอ
function goodTripleIncrement() {
  setCount(prev => prev + 1)  // prev=5 → 6
  setCount(prev => prev + 1)  // prev=6 → 7 (รับค่าจาก update ก่อนหน้า)
  setCount(prev => prev + 1)  // prev=7 → 8
  // ผลลัพธ์: count = 8 (ถูก!)
}

// กฎง่ายๆ:
// ✅ setCount(5)              — set ค่าคงที่ → ไม่ต้อง functional
// ✅ setCount(prev => prev+1) — ขึ้นกับค่าเก่า → ต้อง functional`}
        />
      </Section>

      <Section title="Immutability — อย่า Mutate State โดยตรง">
        <p>
          React ใช้การเปรียบเทียบ reference (<code>===</code>) เพื่อรู้ว่า state เปลี่ยนหรือไม่
        </p>
        <CodeBlock
          language="tsx"
          code={`const [user, setUser] = useState({ name: 'สมชาย', age: 25 })
const [items, setItems] = useState([1, 2, 3])

// ❌ Mutating directly — React ไม่รู้ว่าเปลี่ยน → ไม่ re-render!
user.name = 'สมหญิง'   // แก้ object เดิม (reference เดิม)
setUser(user)          // === เดิม → React skip re-render

items.push(4)          // แก้ array เดิม
setItems(items)        // === เดิม → ไม่ re-render

// ✅ สร้างใหม่เสมอ (Immutable update patterns)

// Object — spread operator
setUser({ ...user, name: 'สมหญิง' })
//        ↑ copy ทุก field    ↑ override field ที่ต้องการ

// Array เพิ่ม
setItems([...items, 4])

// Array ลบ
setItems(items.filter(i => i !== 2))

// Array แก้ไข item
setItems(items.map(i => i === 2 ? 99 : i))`}
        />
        <Callout type="warning" title="ถ้า mutate state โดยตรงจะเกิดอะไร?">
          UI ไม่อัพเดต เพราะ React compare reference เหมือนเดิม
          แต่ข้อมูลจริงเปลี่ยน → เกิด inconsistency ที่หาสาเหตุยากมาก
          ดีที่สุดคือไม่แก้ state โดยตรงเลย
        </Callout>
      </Section>

      <Section title="Demo: Todo List สมบูรณ์">
        <DemoBox title="Todo App — useState กับ Array of Objects">
          <div className="space-y-3 max-w-md">
            <div className="flex gap-2">
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addTodo()} placeholder="เพิ่ม todo..." className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400" />
              <button onClick={addTodo} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">เพิ่ม</button>
            </div>
            <div className="text-xs text-slate-500">เสร็จแล้ว {todos.filter(t => t.done).length}/{todos.length} รายการ</div>
            <div className="space-y-1.5">
              {todos.map((todo) => (
                <div key={todo.id} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg group">
                  <input type="checkbox" checked={todo.done} onChange={() => toggleTodo(todo.id)} className="w-4 h-4 accent-indigo-600" />
                  <span className={`flex-1 text-sm ${todo.done ? 'line-through text-slate-400' : 'text-slate-700'}`}>{todo.text}</span>
                  <button onClick={() => deleteTodo(todo.id)} className="text-red-400 hover:text-red-600 text-xs opacity-0 group-hover:opacity-100 transition-opacity">ลบ</button>
                </div>
              ))}
              {todos.length === 0 && <p className="text-center text-slate-400 text-sm py-4">ไม่มี todo</p>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setCount(count + 1)} className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded text-xs hover:bg-slate-200">Count: {count}</button>
              <button onClick={() => setTodos(todos.filter(t => !t.done))} className="px-3 py-1.5 bg-red-50 text-red-600 rounded text-xs hover:bg-red-100">ลบที่เสร็จแล้ว</button>
            </div>
          </div>
        </DemoBox>
      </Section>

      <Exercise lessonId="usestate" questions={questions} onPass={onPass} />
    </div>
  )
}
