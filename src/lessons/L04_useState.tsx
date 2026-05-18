import { useState } from 'react'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'
import DemoBox from '../components/DemoBox'
import Section from '../components/Section'

interface TodoItem {
  id: number
  text: string
  done: boolean
}

export default function L04_useState() {
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
        <Callout type="definition" title="useState Hook">
          <code>const [value, setValue] = useState(initialValue)</code><br/>
          • <strong>value</strong> — ค่าปัจจุบันของ state<br/>
          • <strong>setValue</strong> — function สำหรับอัพเดต state<br/>
          • <strong>initialValue</strong> — ค่าเริ่มต้น (ใช้แค่ครั้งแรก)<br/>
          การตั้งชื่อ: <code>[thing, setThing]</code> เป็น convention ปกติ
        </Callout>
      </Section>

      <Section title="useState กับ Type ต่างๆ">
        <CodeBlock
          language="tsx"
          code={`// String
const [name, setName] = useState<string>('')
setName('สมชาย')

// Number
const [count, setCount] = useState<number>(0)
setCount(count + 1)

// Boolean
const [isOpen, setIsOpen] = useState<boolean>(false)
setIsOpen(true)
setIsOpen(!isOpen)   // toggle

// Array
const [items, setItems] = useState<string[]>([])
setItems([...items, 'newItem'])       // เพิ่ม item
setItems(items.filter(i => i !== 'x'))  // ลบ item

// Object
const [user, setUser] = useState({ name: '', email: '' })
setUser({ ...user, name: 'สมชาย' })   // อัพเดต field เดียว

// Nullable (null = ยังไม่มีข้อมูล)
const [data, setData] = useState<User | null>(null)`}
        />
      </Section>

      <Section title="Functional Update — อัพเดตจาก state เก่า">
        <p>
          เมื่อค่าใหม่ขึ้นอยู่กับค่าเก่า ควรใช้ <strong>functional update</strong> แบบ <code>setValue(prev =&gt; prev + 1)</code>
          แทนการเขียน <code>setValue(value + 1)</code> โดยตรง
        </p>
        <CodeBlock
          language="tsx"
          code={`// ❌ อาจเกิด bug เมื่อ setState เรียกหลายครั้งเร็วๆ กัน
setCount(count + 1)  // ใช้ count ณ เวลานั้น (อาจ stale)

// ✅ Functional update — ใช้ prev ล่าสุดเสมอ
setCount(prev => prev + 1)

// ตัวอย่างจริงที่มี bug:
function badTripleIncrement() {
  setCount(count + 1)  // count = 0 → set 1
  setCount(count + 1)  // count ยัง 0! → set 1 อีกครั้ง
  setCount(count + 1)  // count ยัง 0! → set 1 อีกครั้ง
  // ผลลัพธ์: count = 1 (ผิด!)
}

function goodTripleIncrement() {
  setCount(prev => prev + 1)  // prev=0 → 1
  setCount(prev => prev + 1)  // prev=1 → 2
  setCount(prev => prev + 1)  // prev=2 → 3
  // ผลลัพธ์: count = 3 (ถูก!)
}`}
        />
      </Section>

      <Section title="Immutability — อย่า Mutate State โดยตรง">
        <p>
          React ใช้การเปรียบเทียบ reference เพื่อรู้ว่า state เปลี่ยนหรือไม่
          ถ้าเราแก้ object/array โดยตรง (mutate) React จะไม่รู้ว่าเปลี่ยน
        </p>
        <CodeBlock
          language="tsx"
          code={`const [user, setUser] = useState({ name: 'สมชาย', age: 25 })
const [items, setItems] = useState([1, 2, 3])

// ❌ Mutating directly — React จะไม่ re-render!
user.name = 'สมหญิง'        // แก้ object โดยตรง
setUser(user)               // reference เดิม → React ไม่รู้ว่าเปลี่ยน

items.push(4)              // แก้ array โดยตรง
setItems(items)             // reference เดิม → ไม่ re-render

// ✅ สร้าง object/array ใหม่เสมอ (Immutable update)
setUser({ ...user, name: 'สมหญิง' })      // spread operator สร้าง object ใหม่
setItems([...items, 4])                    // สร้าง array ใหม่
setItems(items.filter(i => i !== 2))       // filter สร้าง array ใหม่
setItems(items.map(i => i === 2 ? 99 : i)) // map สร้าง array ใหม่`}
        />
        <Callout type="warning" title="Immutability คือหัวใจของ React State">
          React compare ด้วย === (reference equality)
          Object ที่เปลี่ยน field แต่ยัง reference เดิม → React คิดว่าไม่เปลี่ยน → ไม่ re-render
        </Callout>
      </Section>

      <Section title="Demo: Todo List สมบูรณ์">
        <DemoBox title="Todo App — useState กับ Array of Objects">
          <div className="space-y-3 max-w-md">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTodo()}
                placeholder="เพิ่ม todo..."
                className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
              />
              <button
                onClick={addTodo}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
              >
                เพิ่ม
              </button>
            </div>

            <div className="text-xs text-slate-500">
              เสร็จแล้ว {todos.filter(t => t.done).length}/{todos.length} รายการ
            </div>

            <div className="space-y-1.5">
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg group"
                >
                  <input
                    type="checkbox"
                    checked={todo.done}
                    onChange={() => toggleTodo(todo.id)}
                    className="w-4 h-4 accent-indigo-600"
                  />
                  <span className={`flex-1 text-sm ${todo.done ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                    {todo.text}
                  </span>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-red-400 hover:text-red-600 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ลบ
                  </button>
                </div>
              ))}
              {todos.length === 0 && (
                <p className="text-center text-slate-400 text-sm py-4">ไม่มี todo</p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setCount(count + 1)}
                className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded text-xs hover:bg-slate-200"
              >
                Count: {count}
              </button>
              <button
                onClick={() => setTodos(todos.filter(t => !t.done))}
                className="px-3 py-1.5 bg-red-50 text-red-600 rounded text-xs hover:bg-red-100"
              >
                ลบที่เสร็จแล้ว
              </button>
            </div>
          </div>
        </DemoBox>
      </Section>
    </div>
  )
}
