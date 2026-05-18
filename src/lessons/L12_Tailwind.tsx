import { useState } from 'react'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'
import DemoBox from '../components/DemoBox'
import Section from '../components/Section'
import Exercise, { ExQuestion } from '../components/Exercise'

const colorOptions = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'purple', 'pink']

const questions: ExQuestion[] = [
  {
    type: 'choice',
    question: 'Tailwind CSS ใช้แนวคิดอะไรในการเขียน style?',
    choices: [
      'Component-first — เขียน class เดียวแทน style ทั้งหมด',
      'Utility-first — ใช้ class เล็กๆ แต่ละตัวทำหน้าที่เดียว แทนที่ CSS file แยก',
      'Semantic CSS — ใช้ชื่อ class ตามความหมาย เช่น .card .header',
      'CSS-in-JS — เขียน style ใน JavaScript object',
    ],
    correct: 1,
    explanation:
      'Tailwind เป็น Utility-first CSS Framework แต่ละ class ทำหน้าที่เดียว เช่น `p-4` = padding 16px, `text-blue-600` = text สีน้ำเงิน เขียน style ตรงใน className ไม่ต้องสลับไปไฟล์ CSS',
  },
  {
    type: 'fill',
    question: 'Tailwind class ที่ใช้ทำให้ element เป็น flex container คือ class `___`',
    hint: 'เหมือน CSS property `display: flex`',
    correct: ['flex'],
    explanation:
      '`flex` = `display: flex` ใน Tailwind ใช้คู่กับ `items-center` (align-items: center), `justify-between` (justify-content: space-between), `gap-4` (gap: 1rem) เพื่อจัด layout',
  },
  {
    type: 'choice',
    question: 'Tailwind breakpoint prefix `md:` หมายความว่าอะไร?',
    choices: [
      'มีผลเฉพาะหน้าจอขนาดกลาง (tablet) เท่านั้น',
      'มีผลตั้งแต่ขนาด md (768px) ขึ้นไป — Mobile First approach',
      'มีผลเฉพาะบน mobile',
      'บน desktop ใช้ md: บน mobile ไม่ใช้',
    ],
    correct: 1,
    explanation:
      'Tailwind ใช้ Mobile First — class ที่ไม่มี prefix ใช้กับทุกขนาด, prefix เพิ่ม rule สำหรับขนาดนั้นขึ้นไป `md:` = 768px ขึ้นไป ดังนั้น `grid-cols-1 md:grid-cols-2` = 1 col บน mobile, 2 col บน tablet ขึ้นไป',
  },
  {
    type: 'choice',
    question: 'ต้องการ hover effect บน button ใช้ Tailwind ยังไง?',
    code: `<button className="bg-blue-500 ___ transition-colors">
  Click me
</button>`,
    codeLanguage: 'tsx',
    choices: [
      ':hover:bg-blue-600',
      'onHover:bg-blue-600',
      'hover:bg-blue-600',
      'hover={bg-blue-600}',
    ],
    correct: 2,
    explanation:
      'ใช้ prefix `hover:` ก่อน utility class เช่น `hover:bg-blue-600` จะมีผลเมื่อ mouse hover element นั้น ควรใส่ `transition-colors` ด้วยเพื่อให้มี animation smooth',
  },
  {
    type: 'fill',
    question: 'Tailwind class ที่ทำให้ element อยู่กึ่งกลางแนวนอน (margin auto left-right) คือ `mx-___`',
    hint: 'ย่อมาจาก "automatic"',
    correct: ['auto', 'mx-auto'],
    explanation:
      '`mx-auto` = `margin-left: auto; margin-right: auto` ทำให้ element กึ่งกลาง horizontally ใช้กับ block element ที่มีความกว้างกำหนด เช่น `max-w-4xl mx-auto` เพื่อจำกัดความกว้างและจัดกึ่งกลาง',
  },
]

export default function L12_Tailwind({ onPass }: { onPass?: () => void }) {
  const [selectedColor, setSelectedColor] = useState('indigo')
  const [size, setSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base')
  const [rounded, setRounded] = useState<'none' | 'md' | 'xl' | 'full'>('xl')
  const [isDark, setIsDark] = useState(false)

  return (
    <div>
      <Section title="Tailwind CSS คืออะไร?">
        <p>
          <strong>Tailwind CSS</strong> คือ <strong>Utility-first CSS Framework</strong>
          แทนที่จะเขียน CSS file แยก เราใส่ class ตรงใน JSX ได้เลย แต่ละ class ทำงานเดียว
        </p>
        <CodeBlock
          language="tsx"
          filename="Tailwind vs CSS ปกติ"
          code={`// ❌ Traditional CSS — ต้องไปแก้ไฟล์ CSS แยก
// styles.css
.card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

// Component
<div className="card">...</div>

// ✅ Tailwind — เขียน style ตรงใน JSX
<div className="bg-white rounded-xl p-4 shadow-md">
  ...
</div>
// ดูเลยว่า style เป็นยังไง ไม่ต้องสลับไฟล์`}
        />
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: '⚡', title: 'เร็ว', desc: 'ไม่ต้องคิดชื่อ class, ไม่ต้องสลับไฟล์' },
            { icon: '🎯', title: 'Consistent', desc: 'Design system ในตัว — spacing, color, font ใช้สเกลเดียวกัน' },
            { icon: '📦', title: 'Bundle เล็ก', desc: 'Purge unused CSS อัตโนมัติ' },
            { icon: '📱', title: 'Responsive ง่าย', desc: 'sm: md: lg: xl: prefix ทำ responsive ได้ทันที' },
          ].map((b) => (
            <div key={b.title} className="p-3 bg-cyan-50 rounded-lg border border-cyan-200">
              <div className="font-semibold text-cyan-800 text-sm">{b.icon} {b.title}</div>
              <div className="text-cyan-600 text-xs mt-1">{b.desc}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="🔬 Anatomy ของ Tailwind Class">
        <CodeBlock
          language="tsx"
          code={`{/* ① Property prefix — บอกว่า style ไหน */}
{/* ② Scale/Value — บอกว่าค่าเท่าไหร่ */}
{/* ③ Responsive prefix — บอกว่าใช้กับขนาดไหน */}
{/* ④ State prefix — บอกว่า state ไหน */}

<div className="
  p-4          {/* ① p = padding, ② 4 = 16px */}
  md:p-8       {/* ③ md: = ≥768px, ① p = padding, ② 8 = 32px */}
  text-blue-600 {/* ① text = color, ② blue-600 = สีน้ำเงินระดับ 600 */}
  hover:text-blue-800  {/* ④ hover: = เมื่อ hover, เปลี่ยนสีเข้มขึ้น */}
  bg-white     {/* ① bg = background, ② white = สีขาว */}
  rounded-xl   {/* ① rounded = border-radius, ② xl = 12px */}
  shadow-md    {/* ① shadow = box-shadow, ② md = medium shadow */}
  flex         {/* display: flex */}
  items-center {/* align-items: center */}
  gap-4        {/* gap: 16px */}
  transition-colors  {/* transition effect สำหรับ color changes */}
">
`}
        />
        <div className="grid grid-cols-2 gap-3 mt-3">
          {[
            { prefix: 'p-, m-', css: 'padding, margin', scale: '1=4px, 2=8px, 4=16px, 8=32px' },
            { prefix: 'text-', css: 'font-size หรือ color', scale: 'xs, sm, base, lg, xl / slate-600' },
            { prefix: 'bg-', css: 'background-color', scale: 'white, slate-50, blue-500' },
            { prefix: 'rounded-', css: 'border-radius', scale: 'sm, md, lg, xl, full' },
            { prefix: 'w-, h-', css: 'width, height', scale: '4=16px, full=100%, screen=100vw' },
            { prefix: 'flex, grid', css: 'display type', scale: 'flex-col, grid-cols-3' },
          ].map((item) => (
            <div key={item.prefix} className="p-2 bg-cyan-50 rounded border border-cyan-100">
              <code className="text-cyan-700 font-bold text-xs">{item.prefix}</code>
              <p className="text-cyan-600 text-xs mt-0.5">{item.css}</p>
              <p className="text-cyan-400 text-xs">{item.scale}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Layout: Flexbox และ Grid">
        <CodeBlock
          language="tsx"
          code={`{/* Flexbox */}
<div className="flex items-center justify-between gap-4">
  {/* flex = display:flex */}
  {/* items-center = align-items: center */}
  {/* justify-between = justify-content: space-between */}
  {/* gap-4 = gap: 1rem (16px) */}
  <span>Left</span>
  <span>Right</span>
</div>

{/* Flex column */}
<div className="flex flex-col gap-2">
  <p>Item 1</p>
  <p>Item 2</p>
</div>

{/* Grid */}
<div className="grid grid-cols-3 gap-4">
  {/* grid = display:grid */}
  {/* grid-cols-3 = 3 columns */}
  {/* gap-4 = gap: 1rem */}
  <div>Col 1</div>
  <div>Col 2</div>
  <div>Col 3</div>
</div>

{/* Responsive Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* 1 col บนมือถือ, 2 col บน tablet, 4 col บน desktop */}
</div>`}
        />
      </Section>

      <Section title="Spacing: Padding และ Margin">
        <CodeBlock
          language="tsx"
          code={`{/* สเกล: 1 = 4px, 2 = 8px, 4 = 16px, 6 = 24px, 8 = 32px, 12 = 48px */}

{/* Padding */}
<div className="p-4">     {/* padding ทุกด้าน 16px */}
<div className="px-4 py-2"> {/* px = horizontal, py = vertical */}
<div className="pt-4 pb-2 pl-3 pr-6"> {/* แต่ละด้านแยก */}

{/* Margin */}
<div className="m-4">     {/* margin ทุกด้าน */}
<div className="mx-auto"> {/* center horizontally */}
<div className="mt-4 mb-2"> {/* top, bottom */}
<div className="space-y-4"> {/* ช่องว่างระหว่าง children vertical */}
<div className="space-x-2"> {/* ช่องว่างระหว่าง children horizontal */}`}
        />
      </Section>

      <Section title="Typography: ขนาดตัวอักษร สี น้ำหนัก">
        <CodeBlock
          language="tsx"
          code={`{/* ขนาด: xs sm base lg xl 2xl 3xl 4xl 5xl 6xl */}
<p className="text-sm">เล็ก</p>
<p className="text-base">ปกติ</p>
<p className="text-xl">ใหญ่</p>
<p className="text-4xl">ใหญ่มาก</p>

{/* น้ำหนัก */}
<p className="font-normal">ปกติ</p>
<p className="font-medium">medium</p>
<p className="font-semibold">semibold</p>
<p className="font-bold">bold</p>

{/* สีตัวอักษร */}
<p className="text-slate-600">Slate</p>
<p className="text-blue-600">Blue</p>
<p className="text-red-500">Red</p>

{/* การจัด */}
<p className="text-center">กลาง</p>
<p className="text-right">ขวา</p>
<p className="leading-relaxed">line height กว้าง</p>
<p className="tracking-wide">letter spacing</p>
<p className="uppercase">ตัวใหญ่หมด</p>
<p className="truncate">ตัดข้อความถ้ายาวเกิน...</p>`}
        />
      </Section>

      <Section title="Colors: สีพื้นหลัง Border Shadow">
        <CodeBlock
          language="tsx"
          code={`{/* พื้นหลัง: สี-ความเข้ม (50=อ่อน, 500=กลาง, 900=เข้ม) */}
<div className="bg-white">       {/* ขาว */}
<div className="bg-slate-50">    {/* เทาอ่อนมาก */}
<div className="bg-blue-500">    {/* น้ำเงิน */}
<div className="bg-indigo-600">  {/* indigo เข้ม */}

{/* Border */}
<div className="border">                  {/* border ทุกด้าน */}
<div className="border border-blue-300">  {/* border สีน้ำเงิน */}
<div className="border-l-4 border-red-500"> {/* border ซ้ายหนา */}

{/* Rounded */}
<div className="rounded">      {/* เล็กน้อย */}
<div className="rounded-lg">   {/* กลาง */}
<div className="rounded-xl">   {/* ใหญ่ */}
<div className="rounded-full"> {/* วงกลม */}

{/* Shadow */}
<div className="shadow">       {/* เล็ก */}
<div className="shadow-md">    {/* กลาง */}
<div className="shadow-lg">    {/* ใหญ่ */}
<div className="shadow-xl">    {/* ใหญ่มาก */}`}
        />
      </Section>

      <Section title="Responsive Design — Mobile First">
        <p>
          Tailwind ใช้ <strong>Mobile-First</strong> approach — class ที่ไม่มี prefix ใช้กับทุกขนาด
          prefix เพิ่ม rule สำหรับขนาดนั้นขึ้นไป
        </p>
        <CodeBlock
          language="tsx"
          code={`{/* Breakpoints: sm=640px, md=768px, lg=1024px, xl=1280px */}

<div className="
  w-full          /* มือถือ: เต็มความกว้าง */
  md:w-1/2        /* tablet: ครึ่งหน้า */
  lg:w-1/3        /* desktop: 1 ใน 3 */
">

{/* ซ่อน/แสดงตามขนาด */}
<div className="block lg:hidden">  {/* แสดงบนมือถือ/tablet */}
<div className="hidden lg:block">  {/* แสดงเฉพาะ desktop */}

{/* Grid responsive */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

{/* Font size responsive */}
<h1 className="text-2xl md:text-4xl lg:text-6xl font-bold">`}
        />
      </Section>

      <Section title="States: Hover, Focus, Active">
        <CodeBlock
          language="tsx"
          code={`{/* Hover */}
<button className="bg-blue-500 hover:bg-blue-600 transition-colors">
  Hover me
</button>

{/* Focus — สำคัญสำหรับ accessibility */}
<input className="border focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" />

{/* Active */}
<button className="bg-blue-500 active:bg-blue-700">Click me</button>

{/* Disabled */}
<button className="bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed" disabled>

{/* Group hover — hover parent → เปลี่ยน child */}
<div className="group p-4 hover:bg-blue-50">
  <p className="text-gray-600 group-hover:text-blue-600">
    Hover parent เพื่อเปลี่ยนสีฉัน
  </p>
</div>

{/* Transition */}
<div className="transition-all duration-300 ease-in-out">
<div className="transform hover:scale-105 transition-transform">`}
        />
      </Section>

      <Section title="Arbitrary Values — ค่า Custom">
        <CodeBlock
          language="tsx"
          code={`{/* ใช้ [] เมื่อต้องการค่าที่ไม่อยู่ใน scale ปกติ */}
<div className="w-[350px]">          {/* width: 350px */}
<div className="h-[calc(100vh-64px)]">  {/* calc */}
<div className="bg-[#ff6b6b]">       {/* hex color */}
<div className="text-[14px]">        {/* font-size: 14px */}
<div className="top-[72px]">         {/* top: 72px */}

{/* ใน Tailwind v4 ยืดหยุ่นกว่าเดิมมาก */}`}
        />
        <Callout type="tip" title="Tailwind v4 (ที่ใช้ในโปรเจคนี้)">
          เราใช้ Tailwind CSS v4 ซึ่งไม่ต้องมี tailwind.config.js
          แค่ import <code>@import "tailwindcss"</code> ใน CSS ก็พร้อมใช้เลย
        </Callout>
      </Section>

      <Section title="Demo: สร้าง Component ด้วย Tailwind">
        <DemoBox title="Card Builder — ปรับ Tailwind classes แบบ live">
          <div className="space-y-4">
            {/* Controls */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="font-medium text-slate-600 block mb-1">สี</label>
                <div className="flex flex-wrap gap-1">
                  {colorOptions.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`w-5 h-5 rounded border-2 ${selectedColor === c ? 'border-slate-800' : 'border-transparent'}`}
                      style={{ backgroundColor: `var(--color-${c}-500, ${c})` }}
                      title={c}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="font-medium text-slate-600 block mb-1">ขนาดตัวอักษร</label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value as typeof size)}
                  className="border border-slate-300 rounded px-1 py-0.5 text-xs w-full"
                >
                  <option value="sm">sm</option>
                  <option value="base">base</option>
                  <option value="lg">lg</option>
                  <option value="xl">xl</option>
                </select>
              </div>
              <div>
                <label className="font-medium text-slate-600 block mb-1">Rounded</label>
                <select
                  value={rounded}
                  onChange={(e) => setRounded(e.target.value as typeof rounded)}
                  className="border border-slate-300 rounded px-1 py-0.5 text-xs w-full"
                >
                  <option value="none">none</option>
                  <option value="md">md</option>
                  <option value="xl">xl</option>
                  <option value="full">full</option>
                </select>
              </div>
              <div>
                <label className="font-medium text-slate-600 block mb-1">Dark Mode</label>
                <button
                  onClick={() => setIsDark(!isDark)}
                  className={`px-2 py-1 rounded text-xs ${isDark ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'}`}
                >
                  {isDark ? '🌙 Dark' : '☀️ Light'}
                </button>
              </div>
            </div>

            {/* Preview Card */}
            <div className={`p-6 rounded-${rounded} shadow-lg ${isDark ? 'bg-slate-800' : 'bg-white'} border border-slate-200`}>
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 bg-${selectedColor}-100 text-${selectedColor}-700`}>
                {selectedColor}
              </div>
              <h3 className={`text-${size} font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                Tailwind Card Component
              </h3>
              <p className={`text-${size} ${isDark ? 'text-slate-300' : 'text-slate-600'} leading-relaxed mb-4`}>
                Card นี้สร้างด้วย Tailwind utility classes ล้วนๆ ไม่มี custom CSS เลย
              </p>
              <button className={`px-4 py-2 bg-${selectedColor}-600 hover:bg-${selectedColor}-700 text-white rounded-${rounded} text-${size} font-medium transition-colors`}>
                Action Button
              </button>
            </div>

            {/* Generated classes */}
            <div className="bg-slate-900 rounded-lg p-3 text-xs font-mono text-slate-300">
              <div className="text-slate-500 mb-1">// Generated Tailwind classes:</div>
              <div className="text-green-400 break-all">
                {`className="p-6 rounded-${rounded} shadow-lg ${isDark ? 'bg-slate-800' : 'bg-white'} border border-slate-200"`}
              </div>
            </div>
          </div>
        </DemoBox>
      </Section>

      <Exercise lessonId="tailwind" questions={questions} onPass={onPass} />
    </div>
  )
}
