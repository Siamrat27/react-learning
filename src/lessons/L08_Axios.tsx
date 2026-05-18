import { useState } from 'react'
import axios from 'axios'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'
import DemoBox from '../components/DemoBox'
import Section from '../components/Section'

interface Post {
  id: number
  userId: number
  title: string
  body: string
}

interface User {
  id: number
  name: string
  email: string
  phone: string
  website: string
}

export default function L08_Axios() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [newPostTitle, setNewPostTitle] = useState('')
  const [postResult, setPostResult] = useState<string>('')
  const [user, setUser] = useState<User | null>(null)
  const [userId, setUserId] = useState(1)

  const fetchPosts = async () => {
    setLoadingPosts(true)
    try {
      const response = await axios.get<Post[]>('https://jsonplaceholder.typicode.com/posts?_limit=5')
      setPosts(response.data)
    } finally {
      setLoadingPosts(false)
    }
  }

  const createPost = async () => {
    if (!newPostTitle.trim()) return
    try {
      const response = await axios.post<Post>('https://jsonplaceholder.typicode.com/posts', {
        title: newPostTitle,
        body: 'Content here',
        userId: 1,
      })
      setPostResult(`✅ Created! ID: ${response.data.id}, Title: "${response.data.title}"`)
      setNewPostTitle('')
    } catch (err) {
      setPostResult('❌ Error creating post')
    }
  }

  const fetchUser = async (id: number) => {
    setUser(null)
    try {
      const { data } = await axios.get<User>(`https://jsonplaceholder.typicode.com/users/${id}`)
      setUser(data)
    } catch {
      setUser(null)
    }
  }

  return (
    <div>
      <Section title="Axios คืออะไร? ทำไมต้องใช้?">
        <p>
          <strong>Axios</strong> คือ HTTP client library ที่ทำให้การ เรียก API ง่ายขึ้น
          เทียบกับ fetch API ที่มีใน browser อยู่แล้ว
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="text-left px-3 py-2 border border-slate-200">Feature</th>
                <th className="text-center px-3 py-2 border border-slate-200">fetch (built-in)</th>
                <th className="text-center px-3 py-2 border border-slate-200">Axios</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Auto JSON parse', '❌ ต้อง .json() เอง', '✅ อัตโนมัติ'],
                ['Error on 4xx/5xx', '❌ ไม่ throw error', '✅ throw AxiosError'],
                ['Request Interceptors', '❌ ไม่มี', '✅ มี (ใส่ token อัตโนมัติ)'],
                ['Cancel Request', '⚠️ ต้องใช้ AbortController', '✅ cancelToken'],
                ['Timeout config', '❌ ยุ่งยาก', '✅ ง่าย'],
                ['Upload progress', '❌ ยุ่งยาก', '✅ onUploadProgress'],
              ].map(([feat, f, a]) => (
                <tr key={feat} className="border-b border-slate-100">
                  <td className="px-3 py-2 border border-slate-200 font-medium text-slate-700">{feat}</td>
                  <td className="px-3 py-2 border border-slate-200 text-center text-slate-500">{f}</td>
                  <td className="px-3 py-2 border border-slate-200 text-center">{a}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Install และ Import">
        <CodeBlock language="bash" code={`npm install axios`} />
        <CodeBlock
          language="typescript"
          filename="ใช้ใน component"
          code={`import axios from 'axios'

// หรือ import เฉพาะที่ต้องการ
import axios, { AxiosError, AxiosResponse } from 'axios'`}
        />
      </Section>

      <Section title="GET Request — ดึงข้อมูล">
        <CodeBlock
          language="tsx"
          code={`import axios from 'axios'

// แบบพื้นฐาน
const response = await axios.get('/api/users')
const users = response.data

// แบบ TypeScript — กำหนด type ของ response
interface User { id: number; name: string; email: string }
const { data } = await axios.get<User[]>('/api/users')
// data มี type เป็น User[]

// พร้อม Query Parameters
const { data } = await axios.get('/api/posts', {
  params: {
    userId: 1,     // → /api/posts?userId=1
    _limit: 10,    // → &_limit=10
    page: 2,       // → &page=2
  },
})

// ใน useEffect
useEffect(() => {
  const fetchUsers = async () => {
    try {
      const { data } = await axios.get<User[]>('/api/users')
      setUsers(data)
    } catch (err) {
      console.error(err)
    }
  }
  fetchUsers()
}, [])`}
        />
      </Section>

      <Section title="POST, PUT, DELETE — ส่ง/แก้/ลบข้อมูล">
        <CodeBlock
          language="typescript"
          code={`// POST — สร้างข้อมูลใหม่
const newUser = await axios.post('/api/users', {
  name: 'สมชาย',
  email: 'som@email.com',
})
console.log(newUser.data.id)  // ID ที่ server สร้างให้

// PUT — แทนที่ข้อมูลทั้งหมด
await axios.put('/api/users/1', {
  name: 'สมชาย แก้ไขแล้ว',
  email: 'new@email.com',
})

// PATCH — อัพเดตบางส่วน
await axios.patch('/api/users/1', {
  name: 'ชื่อใหม่',  // เปลี่ยนแค่ name
})

// DELETE — ลบข้อมูล
await axios.delete('/api/users/1')

// Headers เช่น Authorization
await axios.post('/api/data', payload, {
  headers: {
    Authorization: \`Bearer \${token}\`,
    'Content-Type': 'application/json',
  },
})`}
        />
      </Section>

      <Section title="Axios Instance — ตั้งค่า Base URL ครั้งเดียว">
        <CodeBlock
          language="typescript"
          filename="src/lib/apiClient.ts"
          code={`import axios from 'axios'

// สร้าง instance ที่มี base config
const apiClient = axios.create({
  baseURL: 'https://api.myapp.com/v1',
  timeout: 10000,  // 10 วินาที
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor — เพิ่ม token ทุก request อัตโนมัติ
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`
  }
  return config
})

// Response Interceptor — จัดการ error กลาง
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // token หมดอายุ → redirect ไปหน้า login
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default apiClient

// ใช้งาน: import apiClient จากที่นี่แทน axios โดยตรง
// const { data } = await apiClient.get('/users')`}
        />
      </Section>

      <Section title="Error Handling กับ AxiosError">
        <CodeBlock
          language="typescript"
          code={`import axios, { AxiosError } from 'axios'

async function fetchData() {
  try {
    const { data } = await axios.get('/api/users')
    return data
  } catch (err) {
    if (axios.isAxiosError(err)) {
      // err เป็น AxiosError
      const status = err.response?.status
      const message = err.response?.data?.message

      if (status === 404) console.error('ไม่พบข้อมูล')
      if (status === 401) console.error('กรุณา login ก่อน')
      if (status === 500) console.error('Server error')
      if (!err.response) console.error('Network error — ไม่มี internet?')
    } else {
      // error อื่นๆ ที่ไม่ใช่ HTTP
      console.error('Unexpected error:', err)
    }
    throw err  // re-throw ให้ caller จัดการ
  }
}`}
        />
        <Callout type="tip" title="ทำไม fetch ไม่ throw เมื่อ 404?">
          fetch() ถือว่า request สำเร็จถ้าได้ response (แม้ 404, 500)
          ต้องเช็ค <code>response.ok</code> เองแล้ว throw เอง
          Axios จัดการให้อัตโนมัติ
        </Callout>
      </Section>

      <Section title="Demo: API Calls ด้วย Axios">
        <DemoBox title="GET List | POST Create | GET by ID">
          <div className="space-y-4">
            {/* GET posts */}
            <div>
              <button
                onClick={fetchPosts}
                disabled={loadingPosts}
                className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
              >
                {loadingPosts ? '⏳ Loading...' : '📋 GET /posts (limit 5)'}
              </button>
              {posts.length > 0 && (
                <div className="mt-2 space-y-1">
                  {posts.map((p) => (
                    <div key={p.id} className="text-xs bg-blue-50 border border-blue-200 rounded p-2 truncate">
                      <span className="text-blue-400 mr-2">#{p.id}</span>{p.title}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* POST */}
            <div>
              <div className="flex gap-2 mb-2">
                <input
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="ชื่อ post ใหม่..."
                  className="flex-1 border border-slate-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-green-400"
                />
                <button
                  onClick={createPost}
                  className="px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                >
                  POST Create
                </button>
              </div>
              {postResult && (
                <div className="text-xs p-2 bg-green-50 border border-green-200 rounded text-green-700">
                  {postResult}
                </div>
              )}
            </div>

            {/* GET user by ID */}
            <div>
              <div className="flex gap-1 mb-2">
                {[1, 2, 3].map((id) => (
                  <button
                    key={id}
                    onClick={() => { setUserId(id); fetchUser(id) }}
                    className={`px-3 py-1.5 rounded text-sm ${
                      userId === id && user ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700'
                    }`}
                  >
                    GET User #{id}
                  </button>
                ))}
              </div>
              {user && (
                <div className="p-3 bg-purple-50 border border-purple-200 rounded text-xs space-y-1">
                  <div><strong>Name:</strong> {user.name}</div>
                  <div><strong>Email:</strong> {user.email}</div>
                  <div><strong>Phone:</strong> {user.phone}</div>
                </div>
              )}
            </div>
          </div>
        </DemoBox>
      </Section>
    </div>
  )
}
