interface DemoBoxProps {
  title?: string
  children: React.ReactNode
}

export default function DemoBox({ title = 'Live Demo', children }: DemoBoxProps) {
  return (
    <div className="my-6 rounded-xl border-2 border-dashed border-indigo-300 overflow-hidden">
      <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2.5 border-b border-indigo-200">
        <span className="text-lg">🎮</span>
        <span className="font-semibold text-indigo-700 text-sm">{title}</span>
        <span className="ml-auto text-xs text-indigo-400 bg-indigo-100 px-2 py-0.5 rounded-full">Interactive</span>
      </div>
      <div className="p-5 bg-white">{children}</div>
    </div>
  )
}
