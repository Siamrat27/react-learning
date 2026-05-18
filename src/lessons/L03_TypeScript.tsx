import { useState } from 'react'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'
import DemoBox from '../components/DemoBox'
import Section from '../components/Section'
import Exercise, { ExQuestion } from '../components/Exercise'

interface FormData {
  name: string
  age: number | ''
  role: 'admin' | 'user' | 'guest'
}

const questions: ExQuestion[] = [
  {
    type: 'choice',
    question: 'TypeScript คืออะไร?',
    choices: [
      'ภาษา programming ใหม่แทน JavaScript',
      'JavaScript ที่เพิ่ม Type System เข้ามา — compile เป็น JS ก่อน run',
      'Framework สำหรับสร้าง web app',
      'CSS preprocessor เหมือน SCSS',
    ],
    correct: 1,
    explanation:
      'TypeScript เป็น superset ของ JavaScript — โค้ด JS ทุกอันเป็น TS ที่ valid Browser ไม่เข้าใจ TS โดยตรง มี compiler (tsc) แปลงเป็น JS ก่อน ประโยชน์หลักคือ type safety และ autocomplete',
  },
  {
    type: 'fill',
    question: 'กำหนด type ให้ตัวแปร: `let score: ___ = 100`',
    hint: 'type สำหรับตัวเลข',
    correct: ['number'],
    explanation:
      'TypeScript มี primitive types: string (ข้อความ), number (ตัวเลขทุกชนิด), boolean (true/false), null, undefined ตัวเลขทุกชนิดใช้ type "number" ไม่ว่าจะเป็น int หรือ float',
  },
  {
    type: 'choice',
    question: 'Optional property ใน Interface เขียนยังไง?',
    code: `interface Config {
  host: string
  port: ???    // ← optional: อาจมีหรือไม่มีก็ได้
  timeout: number
}`,
    codeLanguage: 'typescript',
    choices: [
      'port: number | undefined',
      'port?: number',
      'port = number',
      'optional port: number',
    ],
    correct: 1,
    explanation:
      'เติม ? หลังชื่อ property: `port?: number` หมายความว่า port อาจเป็น number หรือ undefined ก็ได้ ตอนใช้งานต้องเช็คก่อน: `if (config.port) { ... }` หรือ `config.port ?? 3000`',
  },
  {
    type: 'fill',
    question: 'Type ที่รับได้หลาย type เรียกว่า ___ type เขียนด้วย | เช่น `string | number`',
    hint: 'คำนี้มีความหมายว่า "รวมกัน"',
    correct: ['union', 'Union'],
    explanation:
      'Union type ใช้ | (pipe) เพื่อบอกว่า type นี้เป็นได้หลายแบบ เช่น `string | number | null` ก่อนใช้งานต้อง narrow type ก่อน: `if (typeof value === "string") { ... }`',
  },
  {
    type: 'choice',
    question: 'เมื่อต้องการ type ที่ยืดหยุ่น (reusable กับหลาย type) ควรใช้อะไร?',
    code: `// อยากให้ function นี้ใช้ได้กับ string[], number[], User[] ฯลฯ
function getFirst<???>(arr: ???[]): ??? {
  return arr[0]
}`,
    codeLanguage: 'typescript',
    choices: [
      'any — รับทุกอย่างโดยไม่ check type',
      'object — สำหรับ object ทุกชนิด',
      'T (Generic) — placeholder ที่กำหนด type ตอนใช้งาน',
      'unknown — ต้อง cast ก่อนใช้ทุกครั้ง',
    ],
    correct: 2,
    explanation:
      'Generic <T> คือ "type parameter" เหมือน placeholder ที่ถูกแทนด้วย type จริงตอน call function: getFirst<string>(["a","b"]) → T = string, getFirst<number>([1,2]) → T = number ยังคง type safety แต่ยืดหยุ่น',
  },
]

export default function L03_TypeScript({ onPass }: { onPass?: () => void }) {
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
          code={`// JavaScript — ไม่รู้ว่า bug จนกว่าจะ run (runtime error)
function greet(user) {
  return "Hello " + user.name.toUpperCase()
}
greet(null)   // 💥 TypeError: Cannot read properties of null

// TypeScript — IDE บอกผิดทันที ก่อน run (compile-time error)
function greet(user: { name: string }) {
  return "Hello " + user.name.toUpperCase()
}
greet(null)   // ❌ Error: Argument of type 'null' is not assignable
//             IDE แสดงเส้นแดงใต้ null ทันที — จับ bug ได้ก่อน!`}
        />
        <div className="grid grid-cols-2 gap-3 mt-4">
          {[
            { icon: '🔍', title: 'Autocomplete', desc: 'IDE รู้ว่า object มี property อะไร พิมพ์ . แล้วเห็นตัวเลือก' },
            { icon: '🐛', title: 'Catch Bugs Early', desc: 'เห็น error สีแดงก่อน run ไม่ต้องรอ test' },
            { icon: '📚', title: 'Self-documenting', desc: 'Type คือ documentation ในตัว รู้ทันทีว่า function รับอะไร return อะไร' },
            { icon: '🔄', title: 'Safe Refactor', desc: 'เปลี่ยนชื่อตัวแปร → รู้ทันทีว่าที่ไหนพัง' },
          ].map((b) => (
            <div key={b.title} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="font-semibold text-blue-800 text-sm">{b.icon} {b.title}</div>
              <div className="text-blue-600 text-xs mt-1">{b.desc}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="🔬 Anatomy ของ TypeScript Types">
        <CodeBlock
          language="typescript"
          code={`//   ┌── keyword ประกาศตัวแปร
//   │    ┌── ชื่อตัวแปร
//   │    │      ┌── type annotation
//   │    │      │       ┌── ค่าเริ่มต้น
//   ↓    ↓      ↓       ↓
  const  name : string = "สมชาย"
  let    age  : number = 25
  const  active: boolean = true

// ★ Type Inference — TypeScript เดา type ให้อัตโนมัติ
const x = "hello"   // TypeScript รู้เองว่า x: string
const n = 42        // TypeScript รู้เองว่า n: number
// ไม่ต้องเขียน type ถ้า TypeScript เดาได้ถูก (เขียน type เมื่อจำเป็น)`}
        />
        <Callout type="tip" title="เมื่อไหร่ควรใส่ type annotation?">
          ✅ Function parameters — TypeScript เดาไม่ได้ว่าจะส่งอะไรมา<br />
          ✅ Function return type — บังคับให้ function return สิ่งที่ถูกต้อง<br />
          ✅ useState ที่เริ่มเป็น null หรือ array เปล่า<br />
          ❌ ตัวแปรที่มีค่าเริ่มต้นชัดเจน — ให้ TypeScript เดาเอง
        </Callout>
      </Section>

      <Section title="Basic Types — ประเภทพื้นฐาน">
        <CodeBlock
          language="typescript"
          code={`// ① Primitive Types
let name: string = "สมชาย"     // ข้อความ
let age: number = 25            // ตัวเลข (int, float, รวมกัน)
let active: boolean = true      // true หรือ false

// ② Array Types
let fruits: string[] = ["apple", "banana"]
let scores: number[] = [90, 85, 72]
let flags: Array<boolean> = [true, false]  // syntax อีกแบบ

// ③ Tuple — array ที่กำหนดจำนวนและ type ของแต่ละ index
let point: [number, number] = [10, 20]
let entry: [string, number] = ["Alice", 30]

// ④ Any — ปิด type checking (ใช้ให้น้อยที่สุด!)
let anything: any = "hello"
anything = 42     // ✅ ได้
anything = true   // ✅ ได้ — TypeScript ไม่ check

// ⑤ Unknown — ต้อง check type ก่อนใช้ (ดีกว่า any)
let value: unknown = fetchSomeData()
if (typeof value === 'string') {
  console.log(value.toUpperCase())  // ✅ TypeScript รู้แล้วว่า string
}
// value.toUpperCase()  // ❌ Error: ต้อง check ก่อน

// ⑥ Void — function ที่ไม่ return อะไร
function logMessage(msg: string): void {
  console.log(msg)
  // ไม่มี return
}

// ⑦ Never — function ที่ไม่มีวัน return
function throwError(msg: string): never {
  throw new Error(msg)  // throw เสมอ
}`}
        />
      </Section>

      <Section title="Interface & Type — กำหนด shape ของ object">
        <CodeBlock
          language="typescript"
          code={`// Interface — กำหนดโครงสร้างของ object
interface User {
  id: number
  name: string
  email: string
  age?: number              // ? = optional (อาจมีหรือไม่)
  readonly role: string     // readonly = อ่านได้อย่างเดียว ห้ามแก้
}

// ใช้งาน
const user: User = {
  id: 1,
  name: "สมชาย",
  email: "som@mail.com",
  role: "admin",
  // age ไม่ใส่ก็ได้ เพราะ optional
}
// user.role = "user"  // ❌ Error: readonly property

// Type Alias — คล้ายกัน แต่ยืดหยุ่นกว่าสำหรับ union/intersection
type Status = 'loading' | 'success' | 'error'  // Literal Union
type AdminUser = User & { permissions: string[] }  // Intersection

// Interface vs Type — ความต่างที่สำคัญ
// Interface: extend ได้ด้วย extends
interface Animal { name: string }
interface Dog extends Animal { breed: string }

// Type: ทำ union/intersection ได้
type Shape = Circle | Rectangle  // union
type ColoredDog = Dog & { color: string }  // intersection`}
        />
        <Callout type="info" title="ควรใช้ Interface หรือ Type?">
          ไม่มีคำตอบที่ถูก 100% แต่ guideline ทั่วไป:<br />
          → ใช้ <strong>Interface</strong> สำหรับ object shapes ที่อาจ extend (components, API responses)<br />
          → ใช้ <strong>Type</strong> สำหรับ union types, primitive aliases, computed types
        </Callout>
      </Section>

      <Section title="Union Types & Type Narrowing">
        <CodeBlock
          language="typescript"
          code={`// Union Type — เป็นได้หลาย type
type ID = string | number
let userId: ID = "abc123"
userId = 42  // ✅ ทั้งคู่ได้

// Literal Union — จำกัดค่าที่เป็นไปได้
type Direction = 'north' | 'south' | 'east' | 'west'
type Size = 'sm' | 'md' | 'lg' | 'xl'

function move(direction: Direction) { ... }
move('north')   // ✅
// move('up')   // ❌ Error: "up" ไม่ใช่ Direction

// Type Narrowing — ต้องตรวจ type ก่อนใช้
function formatValue(value: string | number): string {
  // TypeScript รู้ว่าในแต่ละ branch value เป็น type อะไร
  if (typeof value === 'string') {
    return value.toUpperCase()   // string methods ได้
  } else {
    return value.toFixed(2)     // number methods ได้
  }
}

// Null check (Nullish narrowing)
function greetUser(user: User | null) {
  if (!user) return "กรุณา login"  // narrow null ออก
  return \`สวัสดี \${user.name}\`   // TypeScript รู้ว่า user ไม่ใช่ null
}`}
        />
      </Section>

      <Section title="Generics — Type ที่ยืดหยุ่น">
        <CodeBlock
          language="typescript"
          code={`// ปัญหา: อยากให้ getFirst() ใช้ได้กับทุก type
// ❌ ต้องเขียน function หลายอัน
function getFirstString(arr: string[]): string { return arr[0] }
function getFirstNumber(arr: number[]): number { return arr[0] }

// ✅ Generic — เขียนครั้งเดียว ใช้ได้ทุก type
// T คือ "type parameter" — placeholder ที่กำหนดตอนใช้
function getFirst<T>(arr: T[]): T {
  return arr[0]
}

const firstFruit = getFirst<string>(['apple', 'banana'])  // T = string → return string
const firstScore = getFirst<number>([90, 85, 72])          // T = number → return number
const firstUser = getFirst<User>([user1, user2])           // T = User → return User

// TypeScript เดา T ได้อัตโนมัติ (ไม่ต้องระบุเสมอ)
const first = getFirst(['a', 'b', 'c'])  // TypeScript รู้ว่า T = string

// Generic กับ Interface (ใช้บ่อยมากกับ API response)
interface ApiResponse<T> {
  data: T          // T ถูกแทนที่ตอนใช้งาน
  status: number
  message: string
}

type UserResponse = ApiResponse<User>        // data: User
type UserListResponse = ApiResponse<User[]>  // data: User[]`}
        />
      </Section>

      <Section title="Typing React Components">
        <CodeBlock
          language="tsx"
          code={`// ① กำหนด Props Interface
interface ButtonProps {
  label: string
  onClick: () => void           // function ไม่รับ arg, ไม่ return
  variant?: 'primary' | 'danger'
  disabled?: boolean
  children?: React.ReactNode   // อะไรก็ได้ที่ React render ได้
}

// ② Component รับ props แบบ destructure
function Button({ label, onClick, variant = 'primary', disabled = false }: ButtonProps) {
  const cls = variant === 'danger' ? 'bg-red-500' : 'bg-blue-500'
  return (
    <button onClick={onClick} disabled={disabled} className={cls}>
      {label}
    </button>
  )
}

// ③ Typing useState
const [name, setName] = useState<string>('')          // explicit
const [count, setCount] = useState(0)                  // inferred: number
const [user, setUser] = useState<User | null>(null)   // nullable

// ④ Typing Event Handlers
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
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full mt-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400" placeholder="กรอกชื่อ..." />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">อายุ (number)</label>
              <input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value ? Number(e.target.value) : '' })} className="w-full mt-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Role ('admin' | 'user' | 'guest')</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as FormData['role'] })} className="w-full mt-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400">
                <option value="user">user</option>
                <option value="admin">admin</option>
                <option value="guest">guest</option>
              </select>
            </div>
            <button onClick={() => setSubmitted(form)} className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">Submit</button>
            {submitted && (
              <div className="bg-slate-900 rounded-lg p-3 text-xs font-mono">
                <div className="text-green-400 mb-1">// TypeScript typed data:</div>
                <div className="text-slate-300">
                  <div>name: <span className="text-yellow-300">"{submitted.name}"</span> ← string</div>
                  <div>age: <span className="text-blue-300">{submitted.age}</span> ← number | ""</div>
                  <div>role: <span className="text-yellow-300">"{submitted.role}"</span> ← literal union</div>
                </div>
              </div>
            )}
          </div>
        </DemoBox>
      </Section>

      <Exercise lessonId="typescript" questions={questions} onPass={onPass} />
    </div>
  )
}
