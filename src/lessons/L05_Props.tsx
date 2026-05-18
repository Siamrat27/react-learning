import { useState } from 'react'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'
import DemoBox from '../components/DemoBox'
import Section from '../components/Section'
import Exercise, { ExQuestion } from '../components/Exercise'

interface AvatarProps {
  name: string
  role: string
  color?: string
  size?: 'sm' | 'md' | 'lg'
}

function Avatar({ name, role, color = '#6366f1', size = 'md' }: AvatarProps) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-12 h-12 text-sm', lg: 'w-16 h-16 text-lg' }
  return (
    <div className="flex items-center gap-3">
      <div
        className={`${sizes[size]} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}
        style={{ backgroundColor: color }}
      >
        {name[0].toUpperCase()}
      </div>
      <div>
        <div className="font-semibold text-slate-800 text-sm">{name}</div>
        <div className="text-slate-400 text-xs">{role}</div>
      </div>
    </div>
  )
}

interface CardProps {
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
}

function Card({ title, children, footer }: CardProps) {
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
        <h3 className="font-semibold text-slate-800 text-sm">{title}</h3>
      </div>
      <div className="p-4">{children}</div>
      {footer && <div className="px-4 py-3 border-t border-slate-100 bg-slate-50">{footer}</div>}
    </div>
  )
}

const questions: ExQuestion[] = [
  {
    type: 'choice',
    question: 'Props ในข้อใดต่อไปนี้ถูกต้องที่สุด?',
    choices: [
      'Props ส่งจาก Child → Parent ได้',
      'Props เป็นข้อมูลที่ส่งจาก Parent → Child และ Child แก้ไขได้',
      'Props ส่งจาก Parent → Child และ Child แก้ไขโดยตรงไม่ได้ (read-only)',
      'Props และ State เหมือนกัน แต่ชื่อต่างกัน',
    ],
    correct: 2,
    explanation:
      'Props ไหลทิศทางเดียว: Parent → Child เสมอ Child ไม่สามารถแก้ค่า props ได้โดยตรง ถ้าต้องการแจ้ง Parent ต้องใช้ callback function ที่ Parent ส่งมาเป็น prop',
  },
  {
    type: 'fill',
    question: 'เติมให้ครบ: prop พิเศษที่รับ JSX ที่อยู่ระหว่าง opening/closing tag ของ component เรียกว่า prop `___`',
    hint: 'ชื่อ prop ที่ React ส่งให้อัตโนมัติเมื่อมี JSX ข้างใน',
    correct: ['children'],
    explanation:
      '`children` คือ prop พิเศษที่ React ส่งให้อัตโนมัติ มีค่าเป็น JSX ทุกอย่างที่อยู่ระหว่าง <Component> และ </Component> Type ที่ใช้คือ `React.ReactNode`',
  },
  {
    type: 'choice',
    question: '"Lifting State Up" หมายความว่าอะไร?',
    choices: [
      'การเพิ่ม state ใหม่ใน component',
      'การย้าย state ขึ้นไปอยู่ที่ Parent ที่ทุก component ที่ต้องการเข้าถึงได้',
      'การลบ state ออกจาก component',
      'การใช้ state ใน global scope',
    ],
    correct: 1,
    explanation:
      'เมื่อ 2 component ต้องใช้ state เดียวกัน ให้ย้าย state ขึ้นไปที่ Parent ร่วมกัน (ancestor ที่ต่ำที่สุด) แล้วส่ง state + callback ลงมาเป็น props ให้ทั้งคู่',
  },
  {
    type: 'choice',
    question: 'Default Props ใน TypeScript เขียนยังไง?',
    code: `interface Props { name: string; color?: string }
function Badge({ name, color = ___ }: Props) { ... }`,
    codeLanguage: 'tsx',
    choices: [
      `'blue' — กำหนดค่า default ใน destructuring parameter`,
      `Props.defaultProps = { color: 'blue' }`,
      `useState('blue')`,
      `required ทุก prop ไม่มี default`,
    ],
    correct: 0,
    explanation:
      'กำหนด default value ใน destructuring parameter โดยตรง: `{ color = "blue" }` เมื่อ parent ไม่ส่ง color มา จะใช้ "blue" อัตโนมัติ `?` ใน interface บอกว่า prop นั้น optional',
  },
  {
    type: 'fill',
    question: 'เติมให้ครบ: `<Button label="Save" onClick={___} />` — เติม event handler ที่เรียก setCount(count + 1)',
    hint: 'ส่ง arrow function เป็น prop',
    correct: ['() => setCount(count + 1)', '()=>setCount(count+1)'],
    explanation:
      'ส่ง arrow function เป็น callback prop: `onClick={() => setCount(count + 1)}` ไม่ใส่ () ก็ได้ถ้า function ไม่ต้องการ argument: `onClick={handleClick}` แต่อย่าเขียน `onClick={handleClick()}` เพราะจะรันทันทีตอน render',
  },
]

export default function L05_Props({ onPass }: { onPass?: () => void }) {
  const [selectedColor, setSelectedColor] = useState('#6366f1')
  const [selectedSize, setSelectedSize] = useState<'sm' | 'md' | 'lg'>('md')

  return (
    <div>
      <Section title="Props คืออะไร?">
        <p>
          <strong>Props</strong> (Properties) คือข้อมูลที่ส่งจาก <strong>Parent Component → Child Component</strong>
          มันทำงานเหมือน "parameter" ของ function — เราส่งค่าเข้าไปเพื่อให้ Component แสดงผลต่างกัน
        </p>
        <Callout type="definition" title="One-Way Data Flow">
          ข้อมูลใน React ไหล <strong>ทิศทางเดียว</strong>: จาก Parent → Child เสมอ
          Child ไม่สามารถแก้ไข props ของตัวเองได้ ถ้า Child ต้องการเปลี่ยนข้อมูล
          ต้องเรียก callback function ที่ Parent ส่งมา
        </Callout>
        <CodeBlock
          language="tsx"
          code={`// Parent Component
function App() {
  return (
    <div>
      {/* ส่ง props เหมือน HTML attributes */}
      <Greeting name="สมชาย" isVip={true} age={25} />
      <Greeting name="สมหญิง" isVip={false} age={30} />
    </div>
  )
}

// Child Component รับ props
function Greeting({ name, isVip, age }: { name: string; isVip: boolean; age: number }) {
  return (
    <p>
      สวัสดี {name} (อายุ {age})
      {isVip && ' ⭐ VIP'}
    </p>
  )
}`}
        />
      </Section>

      <Section title="🔬 Anatomy ของ Props — ทุก part">
        <CodeBlock
          language="tsx"
          code={`// ① กำหนด shape ของ props ด้วย Interface
interface ButtonProps {
  label: string           // ② required prop — ต้องส่งมาเสมอ
  onClick: () => void     // ③ callback function prop
  variant?: 'primary' | 'secondary'  // ④ optional prop (มี ?)
  disabled?: boolean      // ⑤ optional boolean
}

// ⑥ Destructure props ใน parameter
function Button({
  label,
  onClick,
  variant = 'primary',   // ⑦ default value — ใช้เมื่อไม่ส่งมา
  disabled = false,      // ⑦ default value
}: ButtonProps) {        // ← ใส่ type ที่นี่

  return (
    <button
      onClick={onClick}    // ⑧ ส่งต่อไป HTML element
      disabled={disabled}
    >
      {label}
    </button>
  )
}

// ⑨ ใช้งาน — ส่ง props
<Button
  label="บันทึก"           // string
  onClick={() => save()}   // function
  variant="primary"        // literal type
  // disabled ไม่ส่ง → ใช้ default false
/>`}
        />
        <div className="grid grid-cols-1 gap-3 mt-4">
          {[
            { num: '①', title: 'Interface', desc: 'กำหนดว่า component รับ props อะไรได้บ้าง TypeScript ตรวจสอบ compile time ถ้าส่งผิด type จะ error ทันที' },
            { num: '②③', title: 'Required vs Optional', desc: '`label: string` = required (ไม่ส่ง → error), `disabled?: boolean` = optional (มี ?) ไม่ส่งก็ได้' },
            { num: '⑦', title: 'Default Value', desc: '`variant = "primary"` ใน destructuring = ถ้า parent ไม่ส่ง variant มา จะใช้ "primary" อัตโนมัติ' },
            { num: '⑧', title: 'Forwarding Props', desc: 'ส่งต่อ props ไปให้ HTML element เช่น `onClick={onClick}` หรือ spread: `{...rest}`' },
          ].map((item) => (
            <div key={item.num} className="flex gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
              <span className="text-indigo-600 font-bold text-sm w-8 flex-shrink-0">{item.num}</span>
              <div>
                <div className="font-semibold text-indigo-800 text-sm">{item.title}</div>
                <div className="text-indigo-600 text-xs mt-0.5">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Destructuring Props">
        <CodeBlock
          language="tsx"
          code={`// Interface กำหนด shape ของ props
interface ButtonProps {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

// ✅ Destructure ใน parameter โดยตรง
function Button({
  label,
  onClick,
  variant = 'primary',   // default value
  size = 'md',
  disabled = false,
}: ButtonProps) {
  const variantClasses = {
    primary: 'bg-blue-500 text-white',
    secondary: 'bg-gray-200 text-gray-800',
    danger: 'bg-red-500 text-white',
  }
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={\`rounded \${variantClasses[variant]} \${sizeClasses[size]}\`}
    >
      {label}
    </button>
  )
}`}
        />
        <Callout type="warning" title="ถ้าลืมใส่ ? (optional) จะเกิดอะไร?">
          ถ้า Interface บอกว่า `label: string` (ไม่มี ?) แต่ parent ไม่ส่ง label มา
          TypeScript จะ error ทันทีตอน compile: <em>"Property 'label' is missing..."</em>
          ถ้าต้องการ optional ให้เพิ่ม ?: `label?: string` และอาจต้องมี default value
        </Callout>
      </Section>

      <Section title="Children Prop — ส่ง JSX เข้าไปใน Component">
        <p>
          <code>children</code> เป็น prop พิเศษที่ React ส่งให้อัตโนมัติ
          คือ JSX ที่อยู่ <em>ระหว่าง</em> opening และ closing tag ของ component
        </p>
        <CodeBlock
          language="tsx"
          code={`interface CardProps {
  title: string
  children: React.ReactNode    // ① อะไรก็ได้ที่ React render ได้
  footer?: React.ReactNode
}

function Card({ title, children, footer }: CardProps) {
  return (
    <div className="border rounded-lg">
      <h2>{title}</h2>
      <div>{children}</div>     {/* ② แสดง children ที่ส่งมา */}
      {footer && <footer>{footer}</footer>}
    </div>
  )
}

// ③ ใช้งาน — ทุกอย่างระหว่าง <Card> </Card> คือ children
function App() {
  return (
    <Card
      title="My Card"
      footer={<button>Save</button>}
    >
      <p>นี่คือ children</p>      {/* ← children ①*/}
      <img src="photo.jpg" />    {/* ← children ②*/}
      <AnotherComponent />       {/* ← children ③*/}
    </Card>
  )
}

// React.ReactNode คือ union type รับได้: string | number | JSX | null | undefined | boolean`}
        />
        <Callout type="tip" title="ทำไมต้องใช้ children แทนการส่ง JSX เป็น prop ธรรมดา?">
          ทั้งสองวิธีทำงานได้ แต่ <code>children</code> อ่านเป็นธรรมชาติกว่า
          เหมือน HTML ปกติ (`&lt;div&gt;...&lt;/div&gt;`) และทำให้ compose component ได้ยืดหยุ่นกว่า
        </Callout>
      </Section>

      <Section title="Callback Props — Child แจ้ง Parent">
        <p>
          เนื่องจากข้อมูลไหลทางเดียว Child จึงสื่อสารกลับ Parent โดยการ <strong>เรียก function</strong>
          ที่ Parent ส่งมาเป็น prop (callback function)
        </p>
        <CodeBlock
          language="tsx"
          code={`// Parent จัดการ state ทั้งหมด
function Parent() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>Count: {count}</p>
      {/* ① ส่ง function เป็น prop */}
      <ChildButton onIncrement={() => setCount(count + 1)} />
      <ChildButton onIncrement={() => setCount(count + 5)} label="+ 5" />
    </div>
  )
}

// ② Child รับ function เป็น prop และเรียกมันเมื่อ user กด
interface ChildButtonProps {
  onIncrement: () => void
  label?: string
}

function ChildButton({ onIncrement, label = '+ 1' }: ChildButtonProps) {
  return (
    <button onClick={onIncrement}>
      {label}  {/* ③ Child ไม่รู้จัก count แต่แจ้ง Parent ให้เพิ่มได้ */}
    </button>
  )
}

// ④ Pattern: onEvent เป็น convention สำหรับ callback props
// onSubmit, onChange, onClick, onClose, onSuccess, onError`}
        />
        <Callout type="tip" title="Lifting State Up">
          ถ้า 2 Component ต้องใช้ state เดียวกัน → ย้าย state ขึ้นไปอยู่ที่ Parent ร่วมกัน
          แล้วส่ง state + setter ลงมาเป็น props ให้ทั้งคู่ — เรียกว่า "Lifting State Up"
        </Callout>
      </Section>

      <Section title="Props vs State — เลือกใช้อะไร?">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="text-left px-3 py-2 border border-slate-200"></th>
                <th className="text-left px-3 py-2 border border-slate-200">Props</th>
                <th className="text-left px-3 py-2 border border-slate-200">State</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['เจ้าของข้อมูล', 'Parent เป็นเจ้าของ', 'Component เป็นเจ้าของ'],
                ['แก้ไขได้?', 'ไม่ได้ (read-only ใน child)', 'ได้ (ผ่าน setState)'],
                ['เมื่อเปลี่ยน', 'Re-render เมื่อ parent เปลี่ยน', 'Re-render ทันที'],
                ['ใช้สำหรับ', 'ส่งข้อมูลและ event handler', 'ข้อมูลที่ component จัดการเอง'],
                ['ตัวอย่าง', 'label, onClick, color', 'isOpen, count, inputValue'],
              ].map(([aspect, p, s]) => (
                <tr key={aspect} className="border-b border-slate-100">
                  <td className="px-3 py-2 border border-slate-200 font-medium text-slate-600 text-xs">{aspect}</td>
                  <td className="px-3 py-2 border border-slate-200 text-blue-700 text-xs">{p}</td>
                  <td className="px-3 py-2 border border-slate-200 text-green-700 text-xs">{s}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Demo: Props Interactive">
        <DemoBox title="ปรับ Props แบบ Real-time">
          <div className="space-y-4">
            <div className="flex gap-4 flex-wrap">
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Color</label>
                <div className="flex gap-2">
                  {['#6366f1', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className="w-6 h-6 rounded-full border-2 transition-all"
                      style={{
                        backgroundColor: c,
                        borderColor: selectedColor === c ? '#1e293b' : 'transparent',
                        transform: selectedColor === c ? 'scale(1.2)' : 'scale(1)',
                      }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Size</label>
                <div className="flex gap-1">
                  {(['sm', 'md', 'lg'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-2 py-1 text-xs rounded border transition-colors ${
                        selectedSize === s
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-slate-600 border-slate-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-400 mb-3">Component ที่ render ด้วย props เหล่านี้:</p>
              <Avatar name="สมชาย" role="Developer" color={selectedColor} size={selectedSize} />
            </div>

            <Card title="Profile Card (ใช้ children prop)" footer={<span className="text-xs text-slate-400">Updated just now</span>}>
              <Avatar name="สมหญิง" role="Designer" color={selectedColor} size={selectedSize} />
              <p className="text-xs text-slate-500 mt-2">นี่คือ children ที่ส่งเข้าไปใน Card</p>
            </Card>
          </div>
        </DemoBox>
      </Section>

      <Exercise lessonId="props" questions={questions} onPass={onPass} />
    </div>
  )
}
