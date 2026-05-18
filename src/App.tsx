import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import { lessons } from './data/lessons'

import L01 from './lessons/L01_WhatIsReact'
import L02 from './lessons/L02_ComponentsJSX'
import L03 from './lessons/L03_TypeScript'
import L04 from './lessons/L04_useState'
import L05 from './lessons/L05_Props'
import L06 from './lessons/L06_useEffect'
import L07 from './lessons/L07_AsyncFunctions'
import L08 from './lessons/L08_Axios'
import L09 from './lessons/L09_CustomHooks'
import L10 from './lessons/L10_PromiseAll'
import L11 from './lessons/L11_Definitions'
import L12 from './lessons/L12_Tailwind'

const lessonComponents: Record<string, React.ComponentType> = {
  'what-is-react': L01,
  'components-jsx': L02,
  typescript: L03,
  usestate: L04,
  props: L05,
  useeffect: L06,
  'async-functions': L07,
  axios: L08,
  'custom-hooks': L09,
  'promise-all': L10,
  definitions: L11,
  tailwind: L12,
}

function HomePage({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="text-7xl mb-4">⚛️</div>
          <h1 className="text-5xl font-bold text-white mb-3">
            React + TypeScript
          </h1>
          <h2 className="text-2xl font-medium text-indigo-300 mb-4">
            คอร์สเรียนครบวงจร
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
            เรียน React และ TypeScript ตั้งแต่พื้นฐาน — Component, Hooks, API, Async
            พร้อม Live Demo ทุกบท
          </p>
          <div className="flex gap-3 justify-center mt-3 flex-wrap">
            {['React 18', 'TypeScript', 'Tailwind CSS', 'Axios', 'Vite'].map((t) => (
              <span key={t} className="px-3 py-1 bg-indigo-800/60 text-indigo-200 rounded-full text-sm border border-indigo-700">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Lesson Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all hover:border-indigo-500/50 cursor-default"
            >
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {lesson.number}
                </span>
                <div>
                  <h3 className="text-white font-semibold text-sm">{lesson.title}</h3>
                  <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">{lesson.description}</p>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {lesson.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-xs text-indigo-300 bg-indigo-900/50 px-1.5 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={onStart}
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-lg font-semibold rounded-xl transition-all hover:scale-105 shadow-lg shadow-indigo-900"
          >
            เริ่มเรียนเลย →
          </button>
          <p className="text-slate-500 text-sm mt-3">เริ่มจากบทที่ 1 หรือเลือกบทที่สนใจได้เลย</p>
        </div>
      </div>
    </div>
  )
}

function LessonHeader({ lessonId, onPrev, onNext, onMarkDone, isDone }: {
  lessonId: string
  onPrev: () => void
  onNext: () => void
  onMarkDone: () => void
  isDone: boolean
}) {
  const lesson = lessons.find((l) => l.id === lessonId)
  if (!lesson) return null
  return (
    <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-slate-200 px-8 py-4">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 bg-indigo-600 text-white rounded-md flex items-center justify-center text-xs font-bold">
              {lesson.number}
            </span>
            <h1 className="text-lg font-bold text-slate-800">{lesson.title}</h1>
          </div>
          <p className="text-slate-400 text-xs mt-0.5">{lesson.subtitle} • {lesson.duration}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onPrev} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors" title="บทก่อนหน้า">←</button>
          <button onClick={onNext} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors" title="บทถัดไป">→</button>
          <button
            onClick={onMarkDone}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              isDone ? 'bg-green-100 text-green-700' : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {isDone ? '✓ เสร็จแล้ว' : 'ทำเครื่องหมาย เสร็จ'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [view, setView] = useState<'home' | 'lesson'>('home')
  const [activeLesson, setActiveLesson] = useState(lessons[0].id)
  const [completed, setCompleted] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem('react-course-completed')
      return stored ? new Set(JSON.parse(stored)) : new Set()
    } catch {
      return new Set()
    }
  })

  useEffect(() => {
    localStorage.setItem('react-course-completed', JSON.stringify([...completed]))
  }, [completed])

  const currentIndex = lessons.findIndex((l) => l.id === activeLesson)
  const LessonComponent = lessonComponents[activeLesson]

  const selectLesson = (id: string) => {
    setActiveLesson(id)
    setView('lesson')
    window.scrollTo(0, 0)
  }

  const goNext = () => {
    if (currentIndex < lessons.length - 1) selectLesson(lessons[currentIndex + 1].id)
  }

  const goPrev = () => {
    if (currentIndex > 0) selectLesson(lessons[currentIndex - 1].id)
  }

  const toggleDone = () => {
    const next = new Set(completed)
    if (next.has(activeLesson)) next.delete(activeLesson)
    else next.add(activeLesson)
    setCompleted(next)
  }

  if (view === 'home') {
    return <HomePage onStart={() => selectLesson(lessons[0].id)} />
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        activeId={activeLesson}
        onSelect={selectLesson}
        completed={completed}
      />

      <main className="ml-64 flex-1 min-h-screen">
        <LessonHeader
          lessonId={activeLesson}
          onPrev={goPrev}
          onNext={goNext}
          onMarkDone={toggleDone}
          isDone={completed.has(activeLesson)}
        />

        <div className="max-w-3xl mx-auto px-8 py-8">
          {LessonComponent ? <LessonComponent /> : (
            <p className="text-slate-400">ไม่พบบทเรียนนี้</p>
          )}

          {/* Bottom Navigation */}
          <div className="mt-12 pt-6 border-t border-slate-200 flex justify-between items-center">
            <button
              onClick={goPrev}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← {currentIndex > 0 ? lessons[currentIndex - 1].title : 'ไม่มีบทก่อนหน้า'}
            </button>
            {!completed.has(activeLesson) && (
              <button
                onClick={() => { toggleDone(); if (currentIndex < lessons.length - 1) setTimeout(goNext, 200) }}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                เสร็จแล้ว → บทถัดไป
              </button>
            )}
            <button
              onClick={goNext}
              disabled={currentIndex === lessons.length - 1}
              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {currentIndex < lessons.length - 1 ? lessons[currentIndex + 1].title : 'จบคอร์สแล้ว!'} →
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
