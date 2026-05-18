import { useState } from 'react'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'
import DemoBox from '../components/DemoBox'
import Section from '../components/Section'

interface FormData {
  name: string
  age: number | ''
  role: 'admin' | 'user' | 'guest'
}

export default function L03_TypeScript() {
  const [form, setForm] = useState<FormData>({ name: '', age: '', role: 'user' })
  const [submitted, setSubmitted] = useState<FormData | null>(null)

  return (
    <div>
      <Section title="ทำไมต้องใช้ TypeScript?">
        <p>
          <strong>TypeScript</strong> คือ JavaScript ที่เพิ่ม <strong>Type System</strong> เข้ามา
          มันช่วยให้ IDE บอกได้ว่าโค้ดผิดตั้งแต่ตอนเขียน ก่อน run จริง
        </p>
        <CodeBlock
          language="typescript"
          filename="ทำไม TS ถึงดีกว่า JS"
          code={`// JavaScript — ไม่รู้ว่า bug จนกว่าจะ run
function greet(user) {
  return "Hello " + user.name.toUpperCase()
}
greet(null)   // 💥 TypeError: Cannot read property 'name' of null

// TypeScript — IDE บอกผิดทันที ก่อน run
function greet(user: { name: string }) {
  return "Hello " + user.name.toUpperCase()
}
greet(null)   // ❌ Error: Argument of type 'null' is not assignable to parameter
// IDE แสดง error สีแดง — จับ bug ได้เลย!`}
        />
        <div className="grid grid-cols-2 gap-3 mt-4">
          {[
            { icon: '🔍', title: 'Autocomplete', desc: 'IDE รู้ว่า object มี property อะไร' },
            { icon: '🐛', title: 'Catch Bugs Early', desc: 'เห็น error ก่อน runtime' },
            { icon: '📚', title: 'Self-documenting', desc: 'Type คือ documentation ในตัว' },
            { icon: '🔄', title: 'Refactor Safe', desc: 'เปลี่ยนชื่อตัวแปร — รู้ทันทีว่าที่ไหนพัง' },
          ].map((b) => (
            <div key={b.title} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="font-semibold text-blue-800 text-sm">{b.icon} {b.title}</div>
              <div className="text-blue-600 text-xs mt-1">{b.desc}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Basic Types — ประเภทพื้นฐาน">
        <CodeBlock
          language="typescript"
          code={`// Primitive Types — ชนิดข้อมูลพื้นฐาน
let name: string = "สมชาย"
let age: number = 25
let isActive: boolean = true

// Array Types
let fruits: string[] = ["apple", "banana"]
let scores: number[] = [90, 85, 72]
let flags: Array<boolean> = [true, false]

// Tuple — array ที่กำหนดจำนวนและ type แต่ละตำแหน่ง
let point: [number, number] = [10, 20]
let person: [string, number] = ["Alice", 30]

// Any — ปิด type checking (ใช้ให้น้อยที่สุด!)
let anything: any = "hello"
anything = 42     // ได้
anything = true   // ได้ — TypeScript ไม่ check

// Unknown — ต้อง check type ก่อนใช้ (ดีกว่า any)
let value: unknown = "hello"
if (typeof value === 'string') {
  console.log(value.toUpperCase())  // OK ตอนนี้รู้แล้วว่าเป็น string
}

// Void — function ที่ไม่ return อะไร
function logMessage(msg: string): void {
  console.log(msg)
}

// Never — function ที่ไม่มีวัน return (throw error เสมอ)
function throwError(msg: string): never {
  throw new Error(msg)
}`}
        />
      </Section>

      <Section title="Object Types — Interface และ Type">
        <p>
          ใช้ <strong>Interface</strong> หรือ <strong>Type Alias</strong> สำหรับกำหนด shape ของ object
        </p>
        <CodeBlock
          language="typescript"
          code={`// Interface — นิยาม shape ของ object
interface User {
  id: number
  name: string
  email: string
  age?: number       // ? = optional (อาจมีหรือไม่มีก็ได้)
  readonly role: string  // readonly = แก้ไขไม่ได้
}

// ใช้ Interface
const user: User = {
  id: 1,
  name: "สมชาย",
  email: "som@email.com",
  role: "admin",
}

// Type Alias — คล้ายกัน แต่ยืดหยุ่นกว่า
type Point = {
  x: number
  y: number
}

// Interface vs Type: ความต่างหลัก
// Interface: extends ได้ง่าย → ใช้กับ object/class
interface Animal { name: string }
interface Dog extends Animal { breed: string }

// Type: ทำ union/intersection ได้ → ยืดหยุ่นกว่า
type Status = 'active' | 'inactive' | 'pending'  // Union Type
type AdminUser = User & { permissions: string[] }   // Intersection Type`}
        />
        <Callout type="tip" title="Interface หรือ Type ใช้อันไหนดี?">
          ไม่มีคำตอบที่ถูกต้อง 100% แต่ guideline ทั่วไป:<br/>
          → <strong>Interface</strong> สำหรับ object shapes และ class<br/>
          → <strong>Type</strong> สำหรับ union types, computed types, primitives<br/>
          ส่วนมากทีมจะเลือกใช้แบบใดแบบหนึ่งให้ consistent
        </Callout>
      </Section>

      <Section title="Union Types & Literal Types">
        <CodeBlock
          language="typescript"
          code={`// Union Type — เป็นได้หลาย type
type ID = string | number
let userId: ID = "abc123"
userId = 42  // ได้ทั้งคู่

// Literal Type — จำกัดค่าที่เป็นไปได้
type Direction = 'north' | 'south' | 'east' | 'west'
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
type Status = 'loading' | 'success' | 'error'

function move(direction: Direction) {
  console.log(\`Moving \${direction}\`)
}
move('north')    // ✅
move('up')       // ❌ Error: ไม่อยู่ใน union

// Narrowing — ตรวจสอบ type ด้วย typeof/instanceof
function formatId(id: string | number): string {
  if (typeof id === 'string') {
    return id.toUpperCase()   // TS รู้ว่าเป็น string
  }
  return id.toFixed(2)       // TS รู้ว่าเป็น number
}`}
        />
      </Section>

      <Section title="Generics — Type ที่ยืดหยุ่น">
        <CodeBlock
          language="typescript"
          code={`// Generic — placeholder สำหรับ type ที่จะส่งมาทีหลัง
// เหมือน "template" ที่ใช้ T แทน type จริงๆ

// ❌ ไม่ใช้ Generic — ต้อง copy function หลายครั้ง
function getFirstString(arr: string[]): string { return arr[0] }
function getFirstNumber(arr: number[]): number { return arr[0] }

// ✅ ใช้ Generic — เขียนครั้งเดียว ใช้ได้ทุก type
function getFirst<T>(arr: T[]): T {
  return arr[0]
}
const firstFruit = getFirst(['apple', 'banana'])  // T = string
const firstScore = getFirst([90, 85, 72])          // T = number

// Generic กับ Interface
interface ApiResponse<T> {
  data: T
  status: number
  message: string
}

// ใช้กับ type ต่างกัน
type UserResponse = ApiResponse<User>       // data เป็น User
type ListResponse = ApiResponse<User[]>     // data เป็น User[]
type StringResponse = ApiResponse<string>   // data เป็น string`}
        />
      </Section>

      <Section title="Typing React Components">
        <CodeBlock
          language="tsx"
          code={`// กำหนด type ของ Props
interface ButtonProps {
  label: string
  onClick: () => void           // function ที่ไม่รับ arg และไม่ return
  variant?: 'primary' | 'danger'
  disabled?: boolean
  children?: React.ReactNode   // อะไรก็ได้ที่ React render ได้
}

function Button({ label, onClick, variant = 'primary', disabled = false }: ButtonProps) {
  const className = variant === 'danger' ? 'bg-red-500' : 'bg-blue-500'
  return (
    <button onClick={onClick} disabled={disabled} className={className}>
      {label}
    </button>
  )
}

// Typing useState
const [name, setName] = useState<string>('')
const [count, setCount] = useState<number>(0)
const [user, setUser] = useState<User | null>(null)
const [items, setItems] = useState<string[]>([])

// Typing event handlers
function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
  setName(e.target.value)
}
function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault()
}`}
        />
      </Section>

      <Section title="Demo: Typed Form">
        <DemoBox title="Form ที่มี TypeScript กำกับ Type ทุก field">
          <div className="space-y-3 max-w-sm">
            <div>
              <label className="text-sm font-medium text-slate-700">ชื่อ (string)</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full mt-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
                placeholder="กรอกชื่อ..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">อายุ (number)</label>
              <input
                type="number"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value ? Number(e.target.value) : '' })}
                className="w-full mt-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
                placeholder="กรอกอายุ..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Role ('admin' | 'user' | 'guest')</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as FormData['role'] })}
                className="w-full mt-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
              >
                <option value="user">user</option>
                <option value="admin">admin</option>
                <option value="guest">guest</option>
              </select>
            </div>
            <button
              onClick={() => setSubmitted(form)}
              className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
            >
              Submit
            </button>
            {submitted && (
              <div className="bg-slate-900 rounded-lg p-3 text-xs font-mono">
                <div className="text-green-400 mb-1">// TypeScript typed data:</div>
                <div className="text-slate-300">
                  <div>name: <span className="text-yellow-300">"{submitted.name}"</span></div>
                  <div>age: <span className="text-blue-300">{submitted.age}</span></div>
                  <div>role: <span className="text-yellow-300">"{submitted.role}"</span></div>
                </div>
              </div>
            )}
          </div>
        </DemoBox>
      </Section>
    </div>
  )
}
