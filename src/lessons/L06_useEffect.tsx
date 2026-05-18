import { useState, useEffect, useRef } from 'react'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'
import DemoBox from '../components/DemoBox'
import Section from '../components/Section'
import Exercise, { ExQuestion } from '../components/Exercise'

const questions: ExQuestion[] = [
  {
    type: 'choice',
    question: 'Dependency array แบบ [] (empty array) หมายความว่าอะไร?',
    choices: [
      'รัน useEffect ทุกครั้งที่ component re-render',
      'ไม่รัน useEffect เลย',
      'รันแค่ครั้งเดียวตอน component mount (โหลดครั้งแรก)',
      'รันเฉพาะตอน component unmount',
    ],
    correct: 2,
    explanation:
      '[] = "ไม่มี dependency ที่ต้องติดตาม" → รันครั้งเดียวตอน mount เหมาะสำหรับ initial data fetch หรือ setup ที่ต้องทำแค่ครั้งเดียว',
  },
  {
    type: 'fill',
    question: 'Cleanup function ใน useEffect คือ function ที่ ___ ออกมาจาก callback',
    hint: 'คำที่ใช้ส่งค่ากลับออกจาก function',
    correct: ['return', 'returns'],
    explanation:
      'useEffect cleanup คือ function ที่ return ออกมา: `useEffect(() => { ... return () => { cleanup here } }, [])` มันรันก่อน effect รันใหม่ หรือก่อน component unmount ป้องกัน memory leak',
  },
  {
    type: 'choice',
    question: 'ถ้าไม่ใส่ dependency array เลย useEffect จะทำงานยังไง?',
    code: `useEffect(() => {
  console.log('running...')
})  // ← ไม่มี [] `,
    codeLanguage: 'tsx',
    choices: [
      'รันแค่ครั้งเดียวตอนเริ่ม',
      'ไม่รันเลย',
      'รันทุกครั้งที่ component re-render — อันตราย อาจเกิด infinite loop',
      'รันทุก 1 วินาที',
    ],
    correct: 2,
    explanation:
      'ไม่มี dependency array = รันทุก render ถ้าใน effect มีการ setState ก็จะ re-render → effect รันอีก → re-render อีก → infinite loop! หลีกเลี่ยงการไม่ใส่ dependency array',
  },
  {
    type: 'choice',
    question: 'Memory Leak ใน useEffect เกิดจากอะไร?',
    choices: [
      'ใช้ useState มากเกินไป',
      'Component unmount แต่ยังมี timer/listener ทำงานอยู่และ setState',
      'fetch ข้อมูลเยอะเกิน',
      'ใช้ dependency array ผิด',
    ],
    correct: 1,
    explanation:
      'เมื่อ component unmount (หายจากหน้า) แต่ setInterval หรือ event listener ยังทำงานอยู่และเรียก setState → React warn และเกิด bug cleanup function (return () => clearInterval/removeEventListener) ป้องกันสิ่งนี้',
  },
]

export default function L06_useEffect({ onPass }: { onPass?: () => void }) {
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [fetchedPost, setFetchedPost] = useState<{ title: string; body: string } | null>(null)
  const [postId, setPostId] = useState(1)
  const [loading, setLoading] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isRunning])

  useEffect(() => {
    const handler = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  useEffect(() => {
    setLoading(true)
    setFetchedPost(null)
    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
      .then((r) => r.json())
      .then((data) => { setFetchedPost(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [postId])

  return (
    <div>
      <Section title="Side Effect คืออะไร?">
        <p>
          <strong>Side Effect</strong> คือการกระทำที่เกิด <em>นอก</em> component render cycle
          เช่น การ fetch data, ตั้ง timer, subscribe to events, แก้ไข document title
        </p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: '🌐', label: 'Fetch Data', desc: 'เรียก API เมื่อ component โหลด' },
            { icon: '⏱️', label: 'Timers', desc: 'setTimeout, setInterval' },
            { icon: '👂', label: 'Event Listeners', desc: 'resize, scroll, keydown' },
            { icon: '📝', label: 'DOM Mutation', desc: 'เปลี่ยน document.title' },
          ].map((e) => (
            <div key={e.label} className="p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="font-semibold text-purple-800 text-sm">{e.icon} {e.label}</div>
              <div className="text-purple-600 text-xs mt-1">{e.desc}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="🔬 Anatomy ของ useEffect — ทุก part">
        <CodeBlock
          language="tsx"
          code={`useEffect(
  () => {              // ← ① callback function (side effect ที่ต้องการรัน)
    const timer = setInterval(() => {
      setCount(c => c + 1)
    }, 1000)

    return () => {     // ← ② cleanup function (optional แต่สำคัญมาก)
      clearInterval(timer)
      //  └── รัน: ก่อน effect รันใหม่, หรือก่อน component unmount
    }
  },
  [dependency]         // ← ③ dependency array — กำหนดเมื่อไหร่ effect ถึงรัน
  //  ├── []         = รันแค่ครั้งแรก (mount)
  //  ├── [id]       = รันเมื่อ id เปลี่ยน
  //  ├── [a, b]     = รันเมื่อ a หรือ b เปลี่ยน
  //  └── (ไม่ใส่)   = รันทุก render (ระวัง! infinite loop)
)`}
        />
      </Section>

      <Section title="3 รูปแบบของ Dependency Array">
        <div className="space-y-4">
          {[
            {
              label: '[] — Empty: รันแค่ครั้งเดียวตอน mount',
              color: 'blue',
              when: 'Initial fetch, setup subscription, ดึงข้อมูลครั้งแรก',
              code: `useEffect(() => {
  // รันแค่ครั้งเดียวตอน component โหลด
  fetch('/api/config').then(setConfig)
}, [])  // ← [] = "ไม่มีอะไรที่ต้องติดตาม"`,
            },
            {
              label: '[dep] — With Dependencies: รันเมื่อ dependency เปลี่ยน',
              color: 'green',
              when: 'Fetch ตาม parameter, sync state กับ external source',
              code: `useEffect(() => {
  // รันทุกครั้งที่ userId เปลี่ยน
  fetch(\`/api/users/\${userId}\`).then(setUser)
}, [userId])  // ← ติดตาม userId`,
            },
            {
              label: 'ไม่มี Array — รันทุก render (อันตราย!)',
              color: 'red',
              when: 'แทบไม่มี use case ที่ดี มักเกิด infinite loop',
              code: `useEffect(() => {
  // รันทุกครั้งที่ component re-render
  setCount(count + 1)  // ← setState → re-render → effect รัน → loop!
})  // ← ไม่มี array = อันตราย`,
            },
          ].map((item) => (
            <div key={item.label} className={`border border-${item.color}-200 rounded-xl overflow-hidden`}>
              <div className={`px-4 py-2 bg-${item.color}-50 border-b border-${item.color}-200`}>
                <code className={`text-${item.color}-700 text-sm font-semibold`}>{item.label}</code>
                <p className={`text-${item.color}-500 text-xs mt-0.5`}>ใช้เมื่อ: {item.when}</p>
              </div>
              <CodeBlock language="tsx" code={item.code} />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Cleanup Function — ป้องกัน Memory Leak">
        <CodeBlock
          language="tsx"
          code={`// ❌ ไม่มี cleanup — Memory Leak!
useEffect(() => {
  const interval = setInterval(() => {
    setCount(c => c + 1)
  }, 1000)
  // ✗ ไม่ล้าง interval → แม้ component หายไป interval ยังทำงาน
  // → เรียก setCount บน component ที่ไม่มีแล้ว → React warn
}, [])

// ✅ มี cleanup — ปลอดภัย
useEffect(() => {
  const interval = setInterval(() => {
    setCount(c => c + 1)
  }, 1000)

  return () => clearInterval(interval)  // ← cleanup
}, [])

// ✅ Event Listener + cleanup
useEffect(() => {
  const handleResize = () => setWidth(window.innerWidth)
  window.addEventListener('resize', handleResize)

  return () => window.removeEventListener('resize', handleResize)  // ← cleanup
}, [])

// ✅ Fetch + Abort (ยกเลิก request เมื่อ unmount หรือ dependency เปลี่ยน)
useEffect(() => {
  const controller = new AbortController()
  fetch('/api/data', { signal: controller.signal })
    .then(r => r.json())
    .then(setData)
    .catch(() => {})  // AbortError จะ catch ที่นี่ (ไม่ต้อง setState)

  return () => controller.abort()  // ← ยกเลิก request
}, [id])`}
        />
        <Callout type="warning" title="ถ้าไม่มี cleanup จะเกิดอะไร?">
          React จะ warn: <em>"Can't perform a React state update on an unmounted component"</em>
          และอาจเกิด bugs แปลกๆ เช่น state อัพเดตหลัง component หายไปแล้ว
          ทำให้ app ช้าลงและหน่วยความจำล้น (memory leak) เมื่อเปิดใช้นาน
        </Callout>
      </Section>

      <Section title="useEffect vs Lifecycle Methods (สำหรับคนมาจาก Class Component)">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="text-left px-3 py-2 border border-slate-200">Class Component</th>
                <th className="text-left px-3 py-2 border border-slate-200">useEffect equivalent</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['componentDidMount', 'useEffect(() => { ... }, [])'],
                ['componentDidUpdate', 'useEffect(() => { ... }, [dep])'],
                ['componentWillUnmount', 'useEffect(() => { return () => { ... } }, [])'],
              ].map(([cls, hook]) => (
                <tr key={cls} className="border-b border-slate-100">
                  <td className="px-3 py-2 border border-slate-200 font-mono text-purple-700 text-xs">{cls}</td>
                  <td className="px-3 py-2 border border-slate-200 font-mono text-green-700 text-xs">{hook}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout type="tip" title="useEffect ทำได้มากกว่า lifecycle เดิม">
          useEffect สามารถรวม mount + update + unmount ไว้ในที่เดียว และแยก concerns ได้ดีกว่า
          เช่น แยก timer effect กับ fetch effect ออกจากกัน แทนที่จะยัดทุกอย่างใน componentDidMount
        </Callout>
      </Section>

      <Section title="Demo: useEffect 3 แบบ">
        <DemoBox title="Timer | Window Width | API Fetch">
          <div className="grid grid-cols-1 gap-4">
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-xs font-semibold text-purple-600 mb-2">⏱️ setInterval + cleanup</p>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-mono font-bold text-purple-700">{seconds}s</span>
                <button onClick={() => setIsRunning(!isRunning)} className={`px-3 py-1.5 rounded text-sm text-white ${isRunning ? 'bg-red-500' : 'bg-green-500'}`}>{isRunning ? 'หยุด' : 'เริ่ม'}</button>
                <button onClick={() => { setIsRunning(false); setSeconds(0) }} className="px-3 py-1.5 rounded text-sm bg-slate-200 text-slate-700">Reset</button>
              </div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-xs font-semibold text-green-600 mb-1">📏 resize event + cleanup — ลอง resize browser</p>
              <p className="text-sm text-green-700">Window width: <strong>{windowWidth}px</strong></p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs font-semibold text-blue-600 mb-2">🌐 Fetch ตาม postId ([postId] dependency)</p>
              <div className="flex gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((id) => (
                  <button key={id} onClick={() => setPostId(id)} className={`w-7 h-7 rounded text-xs ${postId === id ? 'bg-blue-600 text-white' : 'bg-white border border-blue-300 text-blue-600'}`}>{id}</button>
                ))}
              </div>
              {loading ? <p className="text-blue-400 text-xs">Loading...</p> : fetchedPost && <p className="text-blue-800 text-xs font-medium truncate">{fetchedPost.title}</p>}
            </div>
          </div>
        </DemoBox>
      </Section>

      <Exercise lessonId="useeffect" questions={questions} onPass={onPass} />
    </div>
  )
}
