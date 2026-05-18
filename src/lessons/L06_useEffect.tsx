import { useState, useEffect, useRef } from 'react'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'
import DemoBox from '../components/DemoBox'
import Section from '../components/Section'

export default function L06_useEffect() {
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [fetchedPost, setFetchedPost] = useState<{ title: string; body: string } | null>(null)
  const [postId, setPostId] = useState(1)
  const [loading, setLoading] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Timer demo
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => s + 1)
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning])

  // Window resize
  useEffect(() => {
    const handler = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  // Fetch on postId change
  useEffect(() => {
    setLoading(true)
    setFetchedPost(null)
    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
      .then((r) => r.json())
      .then((data) => {
        setFetchedPost(data)
        setLoading(false)
      })
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

      <Section title="useEffect Syntax">
        <CodeBlock
          language="tsx"
          code={`useEffect(() => {
  // 1. โค้ด side effect ที่ต้องการรัน

  return () => {
    // 2. Cleanup function (optional)
    //    รันก่อน effect รันอีกครั้ง หรือก่อน component unmount
  }
}, [/* 3. dependency array */])`}
        />

        <h3 className="font-bold text-slate-800 mt-6 mb-3">3 รูปแบบของ Dependency Array</h3>
        <div className="space-y-3">
          {[
            {
              label: '[] — Empty Array',
              color: 'blue',
              desc: 'รันแค่ครั้งเดียว ตอน Component mount (โหลดครั้งแรก)',
              useCase: 'Fetch initial data, setup subscriptions',
              code: `useEffect(() => {
  fetch('/api/data').then(...)
}, [])  // รันครั้งเดียว`,
            },
            {
              label: '[dep1, dep2] — With Dependencies',
              color: 'green',
              desc: 'รันทุกครั้งที่ dep1 หรือ dep2 เปลี่ยนค่า',
              useCase: 'Fetch เมื่อ parameter เปลี่ยน, อัพเดต UI ตาม state',
              code: `useEffect(() => {
  fetch(\`/api/posts/\${postId}\`).then(...)
}, [postId])  // รันทุกครั้งที่ postId เปลี่ยน`,
            },
            {
              label: 'ไม่มี Array',
              color: 'red',
              desc: 'รันทุก render (ใช้ระวัง! มักเกิด infinite loop)',
              useCase: 'แทบไม่ได้ใช้ในทางปฏิบัติ',
              code: `useEffect(() => {
  console.log('รันทุก render!')
})  // ไม่มี array — อันตราย!`,
            },
          ].map((item) => (
            <div key={item.label} className={`border border-${item.color}-200 rounded-lg overflow-hidden`}>
              <div className={`px-4 py-2 bg-${item.color}-50 border-b border-${item.color}-200`}>
                <code className={`text-${item.color}-700 text-sm font-semibold`}>{item.label}</code>
              </div>
              <div className="p-3">
                <p className="text-slate-700 text-sm mb-1">{item.desc}</p>
                <p className="text-slate-400 text-xs mb-2">ใช้สำหรับ: {item.useCase}</p>
                <CodeBlock language="tsx" code={item.code} />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Cleanup Function — ป้องกัน Memory Leak">
        <p>
          Cleanup function คือ function ที่ return ออกมาจาก useEffect
          มันรันเมื่อ component <strong>unmount</strong> หรือก่อน effect รันใหม่
        </p>
        <CodeBlock
          language="tsx"
          code={`// ❌ ไม่มี cleanup — Memory Leak!
useEffect(() => {
  const interval = setInterval(() => {
    setCount(c => c + 1)
  }, 1000)
  // ไม่ล้าง interval → interval ยังทำงานต่อแม้ component หายไป
}, [])

// ✅ มี cleanup
useEffect(() => {
  const interval = setInterval(() => {
    setCount(c => c + 1)
  }, 1000)

  return () => clearInterval(interval)  // cleanup!
}, [])

// ตัวอย่าง Event Listener
useEffect(() => {
  const handler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') closeModal()
  }
  window.addEventListener('keydown', handler)

  return () => window.removeEventListener('keydown', handler)  // cleanup!
}, [])

// ตัวอย่าง Fetch พร้อม Abort (ยกเลิก request เมื่อ unmount)
useEffect(() => {
  const controller = new AbortController()
  fetch('/api/data', { signal: controller.signal })
    .then(r => r.json())
    .then(setData)
    .catch(() => {})  // AbortError จะถูก catch ที่นี่

  return () => controller.abort()  // ยกเลิก request
}, [id])`}
        />
        <Callout type="warning" title="Memory Leak คืออะไร?">
          เมื่อ component unmount (หายจากหน้า) แต่ยังมี timer หรือ event listener ทำงานอยู่
          และพยายาม setState → React จะ warn และอาจเกิด bug แปลกๆ
          Cleanup function แก้ปัญหานี้
        </Callout>
      </Section>

      <Section title="Common Patterns">
        <CodeBlock
          language="tsx"
          code={`// Pattern 1: Fetch on mount
function UserProfile({ userId }: { userId: number }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    fetch(\`/api/users/\${userId}\`)
      .then(r => r.json())
      .then(setUser)
  }, [userId])  // refetch เมื่อ userId เปลี่ยน

  return user ? <div>{user.name}</div> : <div>Loading...</div>
}

// Pattern 2: Document title
useEffect(() => {
  document.title = \`(\${unread}) Notifications\`
  return () => { document.title = 'My App' }  // reset เมื่อ leave
}, [unread])

// Pattern 3: Sync with localStorage
useEffect(() => {
  localStorage.setItem('theme', theme)
}, [theme])  // save เมื่อ theme เปลี่ยน`}
        />
      </Section>

      <Section title="Demo: useEffect 3 แบบ">
        <DemoBox title="Timer (setInterval + cleanup) | Window Width | API Fetch">
          <div className="grid grid-cols-1 gap-4">
            {/* Timer */}
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-xs font-semibold text-purple-600 mb-2">⏱️ Timer — useEffect + setInterval + cleanup</p>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-mono font-bold text-purple-700">{seconds}s</span>
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className={`px-3 py-1.5 rounded text-sm text-white ${isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                >
                  {isRunning ? 'หยุด' : 'เริ่ม'}
                </button>
                <button
                  onClick={() => { setIsRunning(false); setSeconds(0) }}
                  className="px-3 py-1.5 rounded text-sm bg-slate-200 hover:bg-slate-300 text-slate-700"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Window width */}
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-xs font-semibold text-green-600 mb-1">📏 Window Width — resize event listener + cleanup</p>
              <p className="text-sm text-green-700">ลอง resize หน้าต่างดู: <strong>{windowWidth}px</strong></p>
            </div>

            {/* API fetch */}
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs font-semibold text-blue-600 mb-2">🌐 Fetch — useEffect([postId])</p>
              <div className="flex gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((id) => (
                  <button
                    key={id}
                    onClick={() => setPostId(id)}
                    className={`w-7 h-7 rounded text-xs font-medium ${postId === id ? 'bg-blue-600 text-white' : 'bg-white border border-blue-300 text-blue-600'}`}
                  >
                    {id}
                  </button>
                ))}
              </div>
              {loading ? (
                <p className="text-blue-400 text-sm">Loading post {postId}...</p>
              ) : fetchedPost ? (
                <div>
                  <p className="text-xs font-semibold text-blue-800 truncate">{fetchedPost.title}</p>
                  <p className="text-xs text-blue-600 mt-1 line-clamp-2">{fetchedPost.body}</p>
                </div>
              ) : null}
            </div>
          </div>
        </DemoBox>
      </Section>
    </div>
  )
}
