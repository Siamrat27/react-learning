export interface Lesson {
  id: string
  number: number
  title: string
  subtitle: string
  description: string
  tags: string[]
  duration: string
}

export const lessons: Lesson[] = [
  {
    id: 'what-is-react',
    number: 1,
    title: 'React คืออะไร',
    subtitle: 'What is React',
    description: 'รู้จัก React, Virtual DOM และหลักการทำงานพื้นฐาน',
    tags: ['React', 'Basics', 'Virtual DOM'],
    duration: '15 นาที',
  },
  {
    id: 'components-jsx',
    number: 2,
    title: 'Components & JSX',
    subtitle: 'Building Blocks',
    description: 'ส่วนประกอบหลักของ React และ JSX syntax',
    tags: ['Component', 'JSX', 'Render'],
    duration: '20 นาที',
  },
  {
    id: 'typescript',
    number: 3,
    title: 'TypeScript',
    subtitle: 'Type Safety',
    description: 'Types, Interface และทำไมต้องใช้ TypeScript',
    tags: ['TypeScript', 'Types', 'Interface'],
    duration: '25 นาที',
  },
  {
    id: 'usestate',
    number: 4,
    title: 'useState Hook',
    subtitle: 'State Management',
    description: 'การจัดการ State และการ Re-render ของ React',
    tags: ['useState', 'Hook', 'State'],
    duration: '20 นาที',
  },
  {
    id: 'props',
    number: 5,
    title: 'Props & Data Flow',
    subtitle: 'Passing Data',
    description: 'การส่งข้อมูลระหว่าง Component แบบ one-way',
    tags: ['Props', 'Data Flow', 'Children'],
    duration: '20 นาที',
  },
  {
    id: 'useeffect',
    number: 6,
    title: 'useEffect Hook',
    subtitle: 'Side Effects',
    description: 'Side Effects, Lifecycle และ Cleanup function',
    tags: ['useEffect', 'Hook', 'Lifecycle'],
    duration: '25 นาที',
  },
  {
    id: 'async-functions',
    number: 7,
    title: 'Functions & Async/Await',
    subtitle: 'Async Programming',
    description: 'Arrow functions, Async/Await, Try/Catch อย่างละเอียด',
    tags: ['Async', 'Await', 'Function', 'Promise'],
    duration: '30 นาที',
  },
  {
    id: 'axios',
    number: 8,
    title: 'Axios & API Calls',
    subtitle: 'HTTP Requests',
    description: 'เรียก API ด้วย Axios — GET, POST, PUT, DELETE',
    tags: ['Axios', 'API', 'HTTP'],
    duration: '30 นาที',
  },
  {
    id: 'custom-hooks',
    number: 9,
    title: 'Custom Hooks',
    subtitle: 'Reusable Logic',
    description: 'สร้าง Hook เองสำหรับ Logic ที่ใช้ซ้ำหลายที่',
    tags: ['Custom Hook', 'useFetch', 'Pattern'],
    duration: '25 นาที',
  },
  {
    id: 'promise-all',
    number: 10,
    title: 'Promise.all & Patterns',
    subtitle: 'Parallel Async',
    description: 'ทำงานหลาย Promise พร้อมกัน, allSettled, race',
    tags: ['Promise', 'Async', 'Parallel'],
    duration: '20 นาที',
  },
  {
    id: 'definitions',
    number: 11,
    title: 'นิยามสำคัญ',
    subtitle: 'Key Definitions',
    description: 'Glossary ครบทุกคำสำคัญใน Frontend Development',
    tags: ['Concepts', 'Glossary', 'Reference'],
    duration: '15 นาที',
  },
  {
    id: 'tailwind',
    number: 12,
    title: 'Tailwind CSS',
    subtitle: 'Styling Framework',
    description: 'Utility-first CSS — styling แบบเร็วและ consistent',
    tags: ['Tailwind', 'CSS', 'Styling'],
    duration: '25 นาที',
  },
]
