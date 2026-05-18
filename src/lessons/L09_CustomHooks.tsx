import { useState, useEffect } from 'react'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'
import DemoBox from '../components/DemoBox'
import Section from '../components/Section'
import Exercise, { ExQuestion } from '../components/Exercise'

// ---- Custom Hooks ที่ใช้ใน Demo ----

function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    setData(null)
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((d) => { setData(d); setLoading(false) })
      .catch((e) => { setError(e.message); setLoading(false) })
  }, [url])

  return { data, loading, error }
}

function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : initial
    } catch {
      return initial
    }
  })

  const setStoredValue = (newValue: T) => {
    setValue(newValue)
    localStorage.setItem(key, JSON.stringify(newValue))
  }

  return [value, setStoredValue] as const
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

interface Post { id: number; title: string; userId: number }

const questions: ExQuestion[] = [
  {
    type: 'choice',
    question: 'Custom Hook ต้องขึ้นต้นด้วยอะไร?',
    choices: [
      'hook',
      'use (เช่น useFetch, useLocalStorage)',
      'custom',
      'Hook (ตัวพิมพ์ใหญ่)',
    ],
    correct: 1,
    explanation:
      'Custom Hook ต้องชื่อขึ้นต้นด้วย `use` เสมอ (เช่น useFetch, useDebounce, useLocalStorage) เพราะ React ใช้ rule นี้ตรวจหา hook และ eslint-plugin-react-hooks จะ warn ถ้าไม่ขึ้นต้นด้วย use',
  },
  {
    type: 'choice',
    question: 'Rules of Hooks กำหนดว่าอะไร?',
    choices: [
      'ใช้ hook ได้แค่ใน class component',
      'เรียก hook ใน if/else หรือ loop ได้ถ้าจำเป็น',
      'ใช้ hook ได้แค่ใน function component และ custom hook และต้องเรียกที่ top level เสมอ',
      'hook ต้องการ TypeScript เสมอ',
    ],
    correct: 2,
    explanation:
      'Rules of Hooks: 1) ใช้ hook ได้แค่ใน function component และ custom hook 2) เรียก hook ที่ top level เสมอ ห้ามใน if/loop/function ซ้อน เพราะ React ต้องรู้ลำดับ hook เดิมทุก render ถ้าลำดับเปลี่ยน → state ผิด',
  },
  {
    type: 'fill',
    question: 'เติมให้ครบ: `const { data, loading, error } = use___(url)` — custom hook สำหรับดึงข้อมูลจาก API',
    hint: 'ชื่อ hook ที่ใช้ fetch data',
    correct: ['useFetch', 'Fetch'],
    explanation:
      'useFetch เป็น custom hook ที่รับ URL แล้วจัดการ loading/error/data ให้ครบ Component ที่ใช้ไม่ต้องเขียน useEffect + useState ซ้ำๆ แค่ `const { data, loading, error } = useFetch(url)` ก็พอ',
  },
  {
    type: 'choice',
    question: 'useDebounce มีประโยชน์อย่างไรกับ search input?',
    choices: [
      'ทำให้ input พิมพ์เร็วขึ้น',
      'บังคับให้ user พิมพ์ครบก่อนค้นหา',
      'หน่วงเวลาก่อน API call เพื่อไม่ให้เรียก API ทุกตัวอักษรที่พิมพ์',
      'เก็บ search history',
    ],
    correct: 2,
    explanation:
      'Debounce หน่วงเวลา X ms ก่อนทำงาน ถ้า value เปลี่ยนก่อนหมดเวลา จะ reset timer ใหม่ ทำให้ API ถูกเรียกเมื่อ user หยุดพิมพ์เท่านั้น (ไม่เรียกทุก keystroke) ประหยัด bandwidth และลดภาระ server',
  },
]

export default function L09_CustomHooks({ onPass }: { onPass?: () => void }) {
  const [postId, setPostId] = useState(1)
  const url = `https://jsonplaceholder.typicode.com/posts/${postId}`
  const { data: post, loading, error } = useFetch<Post>(url)

  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('course-theme', 'light')
  const [searchText, setSearchText] = useState('')
  const debouncedSearch = useDebounce(searchText, 500)

  return (
    <div>
      <Section title="Custom Hooks คืออะไร?">
        <p>
          <strong>Custom Hook</strong> คือ function ที่ชื่อขึ้นต้นด้วย <code>use</code>
          และใช้ React hooks ข้างใน มันช่วยให้เรา <strong>แยก logic ออกจาก component</strong>
          และนำ logic เดิมกลับมาใช้ได้หลายที่
        </p>
        <Callout type="definition" title="Rules of Hooks — กฎที่ต้องรู้ก่อน">
          1. ใช้ Hooks ได้แค่ใน <strong>Function Component</strong> และ <strong>Custom Hook</strong> เท่านั้น<br/>
          2. เรียก Hook ที่ <strong>top level เสมอ</strong> — ห้ามใน if, loop, หรือ function ซ้อน<br/>
          ทำไม? React ต้องรู้ลำดับ Hook เดิมทุก render ถ้าลำดับเปลี่ยน → bug
        </Callout>
        <CodeBlock
          language="tsx"
          code={`// ❌ ละเมิด Rules of Hooks
function BadComponent({ isAdmin }: { isAdmin: boolean }) {
  if (isAdmin) {
    const [data, setData] = useState([])  // ❌ Hook ใน if
  }
  for (let i = 0; i < 3; i++) {
    useEffect(() => {})   // ❌ Hook ใน loop
  }
}

// ✅ Hook ที่ top level เสมอ
function GoodComponent({ isAdmin }: { isAdmin: boolean }) {
  const [data, setData] = useState([])    // ✅ top level
  useEffect(() => {
    if (isAdmin) { /* ... */ }   // condition อยู่ใน effect
  }, [isAdmin])
}`}
        />
      </Section>

      <Section title="🔬 Anatomy ของ Custom Hook: useFetch">
        <CodeBlock
          language="tsx"
          code={`// ① ชื่อต้องขึ้นต้นด้วย 'use'
// ② Generic <T> ทำให้ใช้ได้กับทุก type ของ data
function useFetch<T>(url: string) {    // ③ รับ url เป็น parameter

  // ④ state ที่ hook จัดการภายใน
  const [data, setData] = useState<T | null>(null)   // T | null = ยังไม่มีข้อมูล
  const [loading, setLoading] = useState(true)        // เริ่มต้น loading = true
  const [error, setError] = useState<string | null>(null)

  // ⑤ side effect — fetch เมื่อ url เปลี่ยน
  useEffect(() => {
    setLoading(true)
    setError(null)      // reset error ก่อน fetch ใหม่

    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(\`HTTP \${r.status}\`)
        return r.json()
      })
      .then((d) => {
        setData(d)         // ⑥ เก็บ data
        setLoading(false)
      })
      .catch((e: Error) => {
        setError(e.message)  // ⑦ เก็บ error message
        setLoading(false)
      })
  }, [url])  // ⑧ refetch เมื่อ url เปลี่ยน

  // ⑨ return ค่าที่ component ต้องการ
  return { data, loading, error }
}

// ⑩ ใช้งานใน component — clean และ reusable!
function UserProfile({ id }: { id: number }) {
  // ① ใช้ Generic กำหนด type ของ data ที่ expect
  const { data: user, loading, error } = useFetch<User>(\`/api/users/\${id}\`)
  //           ↑ rename data → user ด้วย alias

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>
  return <div>{user?.name}</div>
}`}
        />
        <div className="grid grid-cols-1 gap-2 mt-3">
          {[
            { step: 'ประโยชน์ที่ 1', desc: 'Reuse — เขียน fetch logic ครั้งเดียว ใช้ได้ทุก component โดยไม่ต้องเขียนซ้ำ' },
            { step: 'ประโยชน์ที่ 2', desc: 'Separation of Concerns — component ไม่ต้องรู้เรื่อง fetch/loading/error จัดการเอง แค่รับผลลัพธ์' },
            { step: 'ประโยชน์ที่ 3', desc: 'Testable — test hook แยกได้โดยไม่ต้องเกี่ยวกับ UI' },
          ].map((item) => (
            <div key={item.step} className="flex gap-3 p-2 bg-blue-50 rounded-lg border border-blue-100">
              <span className="text-blue-600 font-semibold text-xs w-24 flex-shrink-0">{item.step}</span>
              <p className="text-blue-700 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="สร้าง Custom Hook: useFetch">
        <p>
          แทนที่จะเขียน fetch logic ซ้ำๆ ในทุก component เราสร้าง <code>useFetch</code> hook ครั้งเดียว
          แล้วใช้ในทุกที่ที่ต้องการ fetch data
        </p>
        <CodeBlock
          language="tsx"
          filename="src/hooks/useFetch.ts"
          code={`import { useState, useEffect } from 'react'

// Generic hook ที่ใช้ได้กับทุก type ของ data
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(\`HTTP \${r.status}\`)
        return r.json()
      })
      .then((d) => {
        setData(d)
        setLoading(false)
      })
      .catch((e: Error) => {
        setError(e.message)
        setLoading(false)
      })
  }, [url])  // refetch เมื่อ URL เปลี่ยน

  return { data, loading, error }
}

// ใช้ใน component — clean มาก!
function UserProfile({ id }: { id: number }) {
  const { data: user, loading, error } = useFetch<User>(\`/api/users/\${id}\`)

  if (loading) return <Spinner />
  if (error) return <ErrorMessage error={error} />
  return <div>{user?.name}</div>
}`}
        />
      </Section>

      <Section title="Custom Hook: useLocalStorage">
        <CodeBlock
          language="tsx"
          filename="src/hooks/useLocalStorage.ts"
          code={`import { useState } from 'react'

function useLocalStorage<T>(key: string, initialValue: T) {
  // อ่านจาก localStorage ตอน init (lazy initialization)
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  // Setter ที่ save ลง localStorage ด้วย
  const setValue = (value: T) => {
    setStoredValue(value)
    localStorage.setItem(key, JSON.stringify(value))
  }

  return [storedValue, setValue] as const
}

// ใช้งาน
function Settings() {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light')
  const [lang, setLang] = useLocalStorage<string>('language', 'th')

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Theme: {theme}
    </button>
  )
}`}
        />
      </Section>

      <Section title="Custom Hook: useDebounce">
        <p>
          <strong>Debounce</strong> คือการหน่วงเวลาก่อนทำงาน เช่น search box ที่รอ user หยุดพิมพ์
          ก่อนส่ง API request เพื่อไม่ให้ส่ง request ทุกตัวอักษร
        </p>
        <CodeBlock
          language="tsx"
          filename="src/hooks/useDebounce.ts"
          code={`import { useState, useEffect } from 'react'

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    // ตั้ง timer หน่วง delay ms
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // cleanup: ยกเลิก timer เก่าทุกครั้งที่ value เปลี่ยน
    // → ถ้า value เปลี่ยนก่อน delay หมด → timer ถูก reset
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

// ใช้งาน — search ที่ไม่ spam API
function SearchBox() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 500)  // รอ 500ms

  useEffect(() => {
    if (debouncedQuery) {
      // API call เกิดขึ้นเมื่อ user หยุดพิมพ์ 500ms เท่านั้น
      searchAPI(debouncedQuery)
    }
  }, [debouncedQuery])

  return <input value={query} onChange={e => setQuery(e.target.value)} />
}`}
        />
        <Callout type="tip" title="ถ้าไม่ debounce จะเกิดอะไร?">
          User พิมพ์ "React" → 5 ตัวอักษร → 5 API calls ("R", "Re", "Rea", "Reac", "React")
          ด้วย debounce 500ms → API call เดียวเมื่อหยุดพิมพ์ ลด server load ได้มาก
        </Callout>
      </Section>

      <Section title="Demo: ใช้ Custom Hooks จริงๆ">
        <DemoBox title="useFetch | useLocalStorage | useDebounce">
          <div className="space-y-5">
            {/* useFetch demo */}
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs font-semibold text-blue-600 mb-2">🎣 useFetch — เลือก post</p>
              <div className="flex gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((id) => (
                  <button
                    key={id}
                    onClick={() => setPostId(id)}
                    className={`w-7 h-7 rounded text-xs ${postId === id ? 'bg-blue-600 text-white' : 'bg-white border border-blue-300 text-blue-600'}`}
                  >
                    {id}
                  </button>
                ))}
              </div>
              {loading && <p className="text-blue-400 text-xs">Loading...</p>}
              {error && <p className="text-red-500 text-xs">Error: {error}</p>}
              {post && (
                <p className="text-blue-800 text-xs font-medium truncate">{post.title}</p>
              )}
            </div>

            {/* useLocalStorage demo */}
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-xs font-semibold text-green-600 mb-2">💾 useLocalStorage — ค่า persist หลัง refresh</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setTheme('light')}
                  className={`px-3 py-1.5 rounded text-xs ${theme === 'light' ? 'bg-green-600 text-white' : 'bg-white border border-green-300 text-green-600'}`}
                >
                  ☀️ Light
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`px-3 py-1.5 rounded text-xs ${theme === 'dark' ? 'bg-green-600 text-white' : 'bg-white border border-green-300 text-green-600'}`}
                >
                  🌙 Dark
                </button>
              </div>
              <p className="text-green-600 text-xs mt-1">Theme: <strong>{theme}</strong> — ลอง refresh แล้วมาดู</p>
            </div>

            {/* useDebounce demo */}
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-xs font-semibold text-purple-600 mb-2">⏱️ useDebounce — พิมพ์แล้วรอ 500ms</p>
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="พิมพ์บางอย่าง..."
                className="w-full border border-purple-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-purple-500 bg-white"
              />
              <div className="flex justify-between mt-1 text-xs">
                <span className="text-purple-400">Typing: "{searchText}"</span>
                <span className="text-purple-700 font-medium">Debounced: "{debouncedSearch}"</span>
              </div>
              <p className="text-xs text-purple-400 mt-1">API จะถูกเรียกเฉพาะค่า debounced (หลังหยุดพิมพ์ 500ms)</p>
            </div>
          </div>
        </DemoBox>
      </Section>

      <Exercise lessonId="customhooks" questions={questions} onPass={onPass} />
    </div>
  )
}
