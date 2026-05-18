import { useState, useEffect } from 'react'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'
import DemoBox from '../components/DemoBox'
import Section from '../components/Section'

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

export default function L09_CustomHooks() {
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
    </div>
  )
}
