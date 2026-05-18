import { useState } from 'react'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'
import DemoBox from '../components/DemoBox'
import Section from '../components/Section'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function L07_AsyncFunctions() {
  const [userId, setUserId] = useState(1)
  const [status, setStatus] = useState<Status>('idle')
  const [result, setResult] = useState<string>('')

  const fetchUser = async () => {
    setStatus('loading')
    setResult('')
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const data = await response.json()
      setResult(`${data.name} — ${data.email}`)
      setStatus('success')
    } catch (err) {
      setResult(err instanceof Error ? err.message : 'Unknown error')
      setStatus('error')
    }
  }

  return (
    <div>
      <Section title="การประกาศตัวแปร: var, let, const">
        <CodeBlock
          language="javascript"
          code={`// var — เก่า, หลีกเลี่ยงถ้าทำได้
var x = 10
var x = 20     // ประกาศซ้ำได้ — เป็นที่มาของ bug
if (true) {
  var y = 5    // ไม่มี block scope → y ออกไปข้างนอก block ได้
}
console.log(y) // 5 (แปลก!)

// let — มี block scope, เปลี่ยนค่าได้
let count = 0
count = 1      // ✅ เปลี่ยนค่าได้
let count = 2  // ❌ Error: Cannot redeclare

if (true) {
  let inner = 5  // มี block scope
}
// console.log(inner)  // ❌ Error: inner is not defined

// const — มี block scope, เปลี่ยนค่าไม่ได้ (reference)
const MAX = 100
// MAX = 200  // ❌ Error: Assignment to constant variable

const obj = { name: 'Alice' }
obj.name = 'Bob'    // ✅ แก้ property ได้ (reference ไม่เปลี่ยน)
// obj = {}         // ❌ ไม่ได้ (เปลี่ยน reference)

// Rule of thumb: ใช้ const เสมอ เปลี่ยนเป็น let เมื่อจำเป็น, ไม่ใช้ var`}
        />
      </Section>

      <Section title="Function: 3 วิธีในการสร้าง">
        <CodeBlock
          language="javascript"
          code={`// 1. Function Declaration — hoisted (ใช้ก่อนประกาศได้)
greet("Alice")  // ✅ ทำงานได้แม้ประกาศทีหลัง
function greet(name: string) {
  return \`Hello \${name}\`
}

// 2. Function Expression — ไม่ hoisted
// hello("Bob")  // ❌ Error: Cannot access before initialization
const hello = function(name: string) {
  return \`Hello \${name}\`
}

// 3. Arrow Function — syntax สั้นกว่า, ไม่มี own 'this'
const greetArrow = (name: string) => \`Hello \${name}\`

// Arrow function แบบต่างๆ
const add = (a: number, b: number) => a + b          // 1 expression, ไม่ต้อง return
const double = (n: number) => n * 2                   // parameter เดียว ไม่ต้อง ()
const getObj = () => ({ name: 'Alice' })              // return object ต้องใส่ ()
const multiLine = (x: number) => {                    // หลาย statement ต้องใส่ {}
  const result = x * x
  return result
}

// TypeScript: กำหนด type ของ parameter และ return
const multiply = (a: number, b: number): number => a * b
type Callback = (value: string) => void
const log: Callback = (value) => console.log(value)`}
        />
      </Section>

      <Section title="Promise คืออะไร?">
        <p>
          <strong>Promise</strong> คือ object ที่แทน "ผลลัพธ์ในอนาคต" ของ async operation
          มัน 3 สถานะ: <code>pending</code> → <code>fulfilled</code> หรือ <code>rejected</code>
        </p>
        <CodeBlock
          language="javascript"
          code={`// Promise สร้างเอง
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    const success = true
    if (success) {
      resolve("✅ สำเร็จ!")
    } else {
      reject(new Error("❌ ผิดพลาด"))
    }
  }, 1000)
})

// ใช้งาน Promise ด้วย .then() .catch()
promise
  .then((result) => console.log(result))    // รับค่าเมื่อสำเร็จ
  .catch((error) => console.error(error))   // จัดการ error
  .finally(() => console.log("จบแล้ว"))    // รันเสมอ ไม่ว่าจะสำเร็จหรือไม่

// fetch() return Promise
fetch('/api/users')
  .then(response => response.json())  // แปลง response เป็น JSON
  .then(data => console.log(data))
  .catch(err => console.error(err))`}
        />
      </Section>

      <Section title="Async/Await — เขียน Async แบบ Sync">
        <p>
          <code>async/await</code> คือ syntax sugar ที่ทำให้เขียน Promise ได้แบบ "ดูเหมือน" code ปกติ
          อ่านง่ายกว่า .then() chain มาก
        </p>
        <CodeBlock
          language="typescript"
          code={`// เปรียบเทียบ: .then() vs async/await
// ------- .then() chain -------
function getUserThen(id: number) {
  return fetch(\`/api/users/\${id}\`)
    .then(res => {
      if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
      return res.json()
    })
    .then(user => {
      return fetch(\`/api/posts?userId=\${user.id}\`)
    })
    .then(res => res.json())
    .catch(err => console.error(err))
}

// ------- async/await -------
async function getUserAsync(id: number) {
  try {
    const res = await fetch(\`/api/users/\${id}\`)   // await = รอจนได้ผล
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
    const user = await res.json()

    const postsRes = await fetch(\`/api/posts?userId=\${user.id}\`)
    const posts = await postsRes.json()

    return { user, posts }
  } catch (err) {
    console.error(err)    // จัดการ error ที่นี่
  }
}

// ⚠️ await ใช้ได้แค่ใน async function เท่านั้น
// ❌ const data = await fetch(...)  — ใช้นอก async ไม่ได้
// ✅ const run = async () => { const data = await fetch(...) }`}
        />
      </Section>

      <Section title="Try/Catch/Finally — จัดการ Error">
        <CodeBlock
          language="typescript"
          code={`async function fetchData(url: string) {
  try {
    // โค้ดที่อาจ throw error
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(\`Server Error: \${response.status}\`)
    }

    const data = await response.json()
    return data

  } catch (error) {
    // จัดการ error
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      // แสดง error ให้ user
    } else {
      console.error('Unknown error:', error)
    }
    throw error  // อาจ re-throw ให้ caller จัดการต่อ

  } finally {
    // รันเสมอ ไม่ว่า try หรือ catch
    setLoading(false)  // เช่น ปิด loading spinner
  }
}

// Error types ที่ควรรู้
// TypeError — เรียก method ที่ไม่มี เช่น null.toString()
// RangeError — ค่าอยู่นอก range ที่ valid
// SyntaxError — JSON.parse() กับ JSON ที่ผิด format
// Error (custom) — throw new Error('message')`}
        />
        <Callout type="tip" title="ใน React Component ทำ Async ยังไง?">
          useEffect callback ไม่สามารถเป็น async โดยตรงได้ ต้องสร้าง async function ข้างใน:<br/>
          <code>{`useEffect(() => { const run = async () => { ... }; run() }, [])`}</code>
        </Callout>
      </Section>

      <Section title="Demo: Fetch ด้วย Async/Await + Error Handling">
        <DemoBox title="ลองเรียก API ด้วย async/await + try/catch">
          <div className="space-y-3">
            <div className="flex gap-2 items-center">
              <span className="text-sm text-slate-600">User ID:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 0].map((id) => (
                  <button
                    key={id}
                    onClick={() => setUserId(id)}
                    className={`w-8 h-8 rounded text-sm font-medium ${
                      userId === id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {id === 0 ? '??' : id}
                  </button>
                ))}
              </div>
              <span className="text-xs text-slate-400">(0 = จะ error)</span>
            </div>

            <button
              onClick={fetchUser}
              disabled={status === 'loading'}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50"
            >
              {status === 'loading' ? '⏳ กำลัง Fetch...' : '🚀 Fetch User'}
            </button>

            {status !== 'idle' && (
              <div className={`p-3 rounded-lg text-sm ${
                status === 'loading' ? 'bg-slate-100 text-slate-500' :
                status === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
                'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {status === 'loading' && 'กำลังโหลด...'}
                {status === 'success' && `✅ ${result}`}
                {status === 'error' && `❌ Error: ${result}`}
              </div>
            )}

            <div className="bg-slate-900 rounded-lg p-3 text-xs font-mono text-slate-300">
              <div className="text-slate-500 mb-1">// Code ที่ใช้:</div>
              <div><span className="text-purple-400">const</span> <span className="text-blue-300">fetchUser</span> = <span className="text-purple-400">async</span> () =&gt; {'{'}</div>
              <div className="ml-4"><span className="text-purple-400">try</span> {'{'}</div>
              <div className="ml-8"><span className="text-purple-400">const</span> res = <span className="text-yellow-300">await</span> fetch(`/users/{userId}`)</div>
              <div className="ml-8"><span className="text-purple-400">const</span> data = <span className="text-yellow-300">await</span> res.json()</div>
              <div className="ml-4">{'}'} <span className="text-purple-400">catch</span> (err) {'{'}</div>
              <div className="ml-8 text-red-400">// handle error</div>
              <div className="ml-4">{'}'}</div>
              <div>{'}'}</div>
            </div>
          </div>
        </DemoBox>
      </Section>
    </div>
  )
}
