import { useState } from 'react'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'
import DemoBox from '../components/DemoBox'
import Section from '../components/Section'

// ตัวอย่าง Component ที่ใช้ Props
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

export default function L05_Props() {
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
  children: React.ReactNode    // อะไรก็ได้ที่ React render ได้
  footer?: React.ReactNode
}

function Card({ title, children, footer }: CardProps) {
  return (
    <div className="border rounded-lg">
      <h2>{title}</h2>
      <div>{children}</div>     {/* แสดง children ที่ส่งมา */}
      {footer && <footer>{footer}</footer>}
    </div>
  )
}

// ใช้งาน — ทุกอย่างระหว่าง <Card> </Card> คือ children
function App() {
  return (
    <Card
      title="My Card"
      footer={<button>Save</button>}
    >
      <p>นี่คือ children</p>
      <img src="photo.jpg" />
      <AnotherComponent />
    </Card>
  )
}`}
        />
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
      {/* ส่ง function เป็น prop */}
      <ChildButton onIncrement={() => setCount(count + 1)} />
      <ChildButton onIncrement={() => setCount(count + 5)} label="+ 5" />
    </div>
  )
}

// Child รับ function เป็น prop และเรียกมันเมื่อ user กด
interface ChildButtonProps {
  onIncrement: () => void
  label?: string
}

function ChildButton({ onIncrement, label = '+ 1' }: ChildButtonProps) {
  return (
    <button onClick={onIncrement}>
      {label}  {/* Child ไม่รู้จัก count แต่แจ้ง Parent ให้เพิ่มได้ */}
    </button>
  )
}`}
        />
        <Callout type="tip" title="Lifting State Up">
          ถ้า 2 Component ต้องใช้ state เดียวกัน → ย้าย state ขึ้นไปอยู่ที่ Parent ร่วมกัน
          แล้วส่ง state + setter ลงมาเป็น props ให้ทั้งคู่ — เรียกว่า "Lifting State Up"
        </Callout>
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
    </div>
  )
}
