import { useState } from 'react'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'
import DemoBox from '../components/DemoBox'
import Section from '../components/Section'

interface ApiResult {
  label: string
  data: string
  status: 'pending' | 'success' | 'error'
  time?: number
}

export default function L10_PromiseAll() {
  const [results, setResults] = useState<ApiResult[]>([])
  const [running, setRunning] = useState(false)
  const [totalTime, setTotalTime] = useState<number | null>(null)
  const [mode, setMode] = useState<'all' | 'settled' | 'sequential'>('all')

  const endpoints = [
    { label: 'Users', url: 'https://jsonplaceholder.typicode.com/users/1' },
    { label: 'Posts', url: 'https://jsonplaceholder.typicode.com/posts/1' },
    { label: 'Todos', url: 'https://jsonplaceholder.typicode.com/todos/1' },
  ]

  const runDemo = async () => {
    setRunning(true)
    setResults(endpoints.map((e) => ({ label: e.label, data: '', status: 'pending' })))
    setTotalTime(null)
    const start = Date.now()

    try {
      if (mode === 'sequential') {
        const newResults: ApiResult[] = []
        for (const ep of endpoints) {
          const r = await fetch(ep.url)
          const d = await r.json()
          newResults.push({ label: ep.label, data: JSON.stringify(d).slice(0, 60) + '...', status: 'success', time: Date.now() - start })
          setResults([...newResults])
        }
      } else if (mode === 'all') {
        const promises = endpoints.map((ep) => fetch(ep.url).then((r) => r.json()))
        const all = await Promise.all(promises)
        const elapsed = Date.now() - start
        setResults(all.map((d, i) => ({
          label: endpoints[i].label,
          data: JSON.stringify(d).slice(0, 60) + '...',
          status: 'success',
          time: elapsed,
        })))
      } else {
        const promises = endpoints.map((ep) =>
          fetch(ep.url).then((r) => r.json()).then((d) => ({ status: 'fulfilled' as const, value: d, label: ep.label }))
            .catch((e) => ({ status: 'rejected' as const, reason: e.message, label: ep.label }))
        )
        const settled = await Promise.allSettled(promises)
        const elapsed = Date.now() - start
        setResults(settled.map((r, i) => ({
          label: endpoints[i].label,
          data: r.status === 'fulfilled' ? JSON.stringify((r.value as { value?: unknown }).value ?? r.value).slice(0, 60) + '...' : `Error: ${r.reason}`,
          status: r.status === 'fulfilled' ? 'success' : 'error',
          time: elapsed,
        })))
      }
      setTotalTime(Date.now() - start)
    } catch (err) {
      setResults((prev) => prev.map((r) => r.status === 'pending' ? { ...r, status: 'error', data: 'Failed' } : r))
    } finally {
      setRunning(false)
    }
  }

  return (
    <div>
      <Section title="Promise คืออะไร? ทบทวนก่อน">
        <p>
          <strong>Promise</strong> คือ object ที่แทน "ผลลัพธ์ในอนาคต" ของ operation ที่ใช้เวลา
          มี 3 สถานะ:
        </p>
        <div className="flex gap-3 my-4">
          {[
            { state: 'Pending', color: 'yellow', desc: 'กำลังรออยู่ ยังไม่รู้ผล' },
            { state: 'Fulfilled', color: 'green', desc: 'สำเร็จ มีค่า (resolve)' },
            { state: 'Rejected', color: 'red', desc: 'ล้มเหลว มี error (reject)' },
          ].map((s) => (
            <div key={s.state} className={`flex-1 p-3 bg-${s.color}-50 border border-${s.color}-200 rounded-lg text-center`}>
              <div className={`font-bold text-${s.color}-700 text-sm`}>{s.state}</div>
              <div className={`text-${s.color}-600 text-xs mt-1`}>{s.desc}</div>
            </div>
          ))}
        </div>
        <CodeBlock
          language="typescript"
          code={`// Promise เดี่ยว
const promise = fetch('/api/users')  // → Promise<Response>

// รอด้วย await
const response = await promise       // → Response (fulfilled)
const data = await response.json()   // → any (fulfilled)

// ถ้าเกิด error → rejected → ต้องใช้ try/catch`}
        />
      </Section>

      <Section title="ทำไมต้องรัน Parallel?">
        <CodeBlock
          language="typescript"
          code={`// ❌ Sequential — ช้า: รอทีละอัน
async function loadPageSequential() {
  const user = await fetchUser(1)    // รอ 200ms
  const posts = await fetchPosts(1)  // รอ 300ms (เริ่มหลัง user เสร็จ)
  const todos = await fetchTodos(1)  // รอ 150ms (เริ่มหลัง posts เสร็จ)
  // รวม: 200 + 300 + 150 = 650ms
}

// ✅ Parallel ด้วย Promise.all — เร็วกว่า
async function loadPageParallel() {
  const [user, posts, todos] = await Promise.all([
    fetchUser(1),     // รันพร้อมกัน
    fetchPosts(1),    // รันพร้อมกัน
    fetchTodos(1),    // รันพร้อมกัน
  ])
  // รวม: max(200, 300, 150) = 300ms ← เร็วกว่า 2x!
}`}
        />
      </Section>

      <Section title="Promise.all — ทั้งหมดต้องสำเร็จ">
        <CodeBlock
          language="typescript"
          code={`// Promise.all รอทุก promise และ return array ของผลลัพธ์
const [users, posts, comments] = await Promise.all([
  axios.get('/api/users'),
  axios.get('/api/posts'),
  axios.get('/api/comments'),
])

// TypeScript version
const [usersRes, postsRes] = await Promise.all([
  axios.get<User[]>('/api/users'),
  axios.get<Post[]>('/api/posts'),
])
const users = usersRes.data   // User[]
const posts = postsRes.data   // Post[]

// ⚠️ ถ้า promise ใดๆ reject → Promise.all จะ reject ทันที
// promise อื่นที่ยังทำงานอยู่จะยังรัน แต่เราได้ error
try {
  const results = await Promise.all([promise1, promise2, failingPromise])
} catch (err) {
  // err มาจาก failingPromise
  console.error('อย่างน้อยหนึ่งอันล้มเหลว:', err)
}`}
        />
      </Section>

      <Section title="Promise.allSettled — รอทุกอัน ไม่สนว่าจะ fail">
        <CodeBlock
          language="typescript"
          code={`// allSettled รอจนทุก promise จบ ไม่ว่าจะสำเร็จหรือไม่
const results = await Promise.allSettled([
  fetchUser(1),      // สำเร็จ
  fetchUser(9999),   // ล้มเหลว (ไม่มี user)
  fetchPosts(1),     // สำเร็จ
])

// results มี type เป็น PromiseSettledResult[]
results.forEach((result, index) => {
  if (result.status === 'fulfilled') {
    console.log(\`[\${index}] ✅ สำเร็จ:\`, result.value)
  } else {
    console.log(\`[\${index}] ❌ ล้มเหลว:\`, result.reason)
  }
})

// ใช้เมื่อ: ต้องการผลทุกอัน แม้บางอันจะ fail
// เช่น: แสดงผลที่สำเร็จ + แสดง error สำหรับที่ล้มเหลว`}
        />
      </Section>

      <Section title="Promise.race และ Promise.any">
        <CodeBlock
          language="typescript"
          code={`// Promise.race — อันที่เสร็จก่อน (สำเร็จหรือล้มเหลวก็ได้)
const result = await Promise.race([
  fetch('/api/fast'),    // 100ms
  fetch('/api/slow'),    // 3000ms
  timeout(2000),         // reject หลัง 2 วินาที
])
// ใช้สำหรับ: timeout pattern

// ทำ timeout ด้วย Promise.race
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Timeout!')), ms)
  )
  return Promise.race([promise, timeout])
}

// Promise.any — รอจนกว่าจะมีอันสำเร็จ
const fastest = await Promise.any([
  fetch('https://mirror1.com/data'),
  fetch('https://mirror2.com/data'),
  fetch('https://mirror3.com/data'),
])
// ใช้กับ: หลาย mirror/source ต้องการอันที่เร็วที่สุด`}
        />
      </Section>

      <Section title="Demo: เปรียบเทียบ Sequential vs Parallel">
        <DemoBox title="ทดสอบ 3 API Calls ด้วยวิธีต่างๆ">
          <div className="space-y-3">
            <div className="flex gap-2 flex-wrap">
              {[
                { key: 'all', label: 'Promise.all', color: 'indigo' },
                { key: 'settled', label: 'Promise.allSettled', color: 'green' },
                { key: 'sequential', label: 'Sequential (await ทีละอัน)', color: 'orange' },
              ].map((m) => (
                <button
                  key={m.key}
                  onClick={() => setMode(m.key as typeof mode)}
                  className={`px-3 py-1.5 rounded text-xs font-medium border transition-colors ${
                    mode === m.key
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-slate-600 border-slate-300'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <button
              onClick={runDemo}
              disabled={running}
              className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              {running ? '⏳ กำลังรัน...' : '▶️ รัน Demo'}
            </button>

            {results.length > 0 && (
              <div className="space-y-1.5">
                {results.map((r) => (
                  <div
                    key={r.label}
                    className={`flex items-start gap-2 p-2 rounded border text-xs ${
                      r.status === 'success' ? 'bg-green-50 border-green-200' :
                      r.status === 'error' ? 'bg-red-50 border-red-200' :
                      'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <span className="font-semibold w-14 flex-shrink-0">
                      {r.status === 'success' ? '✅' : r.status === 'error' ? '❌' : '⏳'} {r.label}
                    </span>
                    <span className="text-slate-500 truncate flex-1">{r.data || 'กำลังโหลด...'}</span>
                    {r.time && <span className="text-slate-400 flex-shrink-0">{r.time}ms</span>}
                  </div>
                ))}
              </div>
            )}

            {totalTime !== null && (
              <div className="text-center p-2 bg-indigo-50 rounded border border-indigo-200">
                <span className="text-indigo-700 font-semibold text-sm">⏱️ รวม: {totalTime}ms</span>
                {mode === 'all' && <span className="text-indigo-400 text-xs ml-2">(Parallel — เร็วที่สุด)</span>}
                {mode === 'sequential' && <span className="text-indigo-400 text-xs ml-2">(Sequential — ช้าที่สุด)</span>}
              </div>
            )}
          </div>
        </DemoBox>
      </Section>
    </div>
  )
}
