import { lessons } from '../data/lessons'

interface SidebarProps {
  activeId: string
  onSelect: (id: string) => void
  completed: Set<string>
}

export default function Sidebar({ activeId, onSelect, completed }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 flex flex-col z-10">
      {/* Header */}
      <div className="px-5 py-5 border-b border-slate-700">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">⚛️</span>
          <span className="text-white font-bold text-lg">React Course</span>
        </div>
        <p className="text-slate-400 text-xs">React + TypeScript ครบวงจร</p>
      </div>

      {/* Progress */}
      <div className="px-5 py-3 border-b border-slate-700">
        <div className="flex justify-between text-xs text-slate-400 mb-1.5">
          <span>Progress</span>
          <span>{completed.size} / {lessons.length} บท</span>
        </div>
        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${(completed.size / lessons.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Lesson List */}
      <nav className="flex-1 overflow-y-auto py-3">
        {lessons.map((lesson) => {
          const isActive = activeId === lesson.id
          const isDone = completed.has(lesson.id)
          return (
            <button
              key={lesson.id}
              onClick={() => onSelect(lesson.id)}
              className={`w-full text-left px-5 py-3 flex items-start gap-3 transition-colors group ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span
                className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${
                  isDone
                    ? 'bg-green-500 text-white'
                    : isActive
                    ? 'bg-white text-indigo-600'
                    : 'bg-slate-700 text-slate-400 group-hover:bg-slate-600'
                }`}
              >
                {isDone ? '✓' : lesson.number}
              </span>
              <div className="min-w-0">
                <div className={`text-sm font-medium truncate ${isActive ? 'text-white' : ''}`}>
                  {lesson.title}
                </div>
                <div className={`text-xs truncate mt-0.5 ${isActive ? 'text-indigo-200' : 'text-slate-500'}`}>
                  {lesson.duration}
                </div>
              </div>
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-slate-700">
        <p className="text-xs text-slate-500 text-center">
          React + TypeScript + Tailwind
        </p>
      </div>
    </aside>
  )
}
