import { useState } from 'react'
import CodeBlock from './CodeBlock'

// ---- Types ----

interface ChoiceQuestion {
  type: 'choice'
  question: string
  code?: string
  codeLanguage?: string
  choices: string[]
  correct: number
  explanation: string
}

interface FillQuestion {
  type: 'fill'
  question: string
  code?: string
  codeLanguage?: string
  hint?: string
  correct: string[]   // any of these strings is accepted (case-insensitive, trimmed)
  explanation: string
}

export type ExQuestion = ChoiceQuestion | FillQuestion

interface ExerciseProps {
  lessonId: string
  questions: ExQuestion[]
  onPass?: () => void
}

// ---- Helper ----

function normalize(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, ' ')
}

// ---- Sub-components ----

function ProgressBar({ current, total, score }: { current: number; total: number; score: number }) {
  return (
    <div className="flex items-center justify-between mb-1">
      <div className="flex gap-1.5">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i < current
                ? 'w-5 bg-green-400'
                : i === current
                ? 'w-5 bg-indigo-400'
                : 'w-5 bg-slate-600'
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-slate-400">
        ข้อ {current + 1}/{total} · ถูกแล้ว {score}/{current}
      </span>
    </div>
  )
}

function Explanation({ text, isCorrect }: { text: string; isCorrect: boolean }) {
  return (
    <div className={`mt-4 p-3 rounded-lg border text-sm leading-relaxed ${
      isCorrect
        ? 'bg-green-900/40 border-green-600 text-green-300'
        : 'bg-red-900/40 border-red-600 text-red-300'
    }`}>
      <div className="font-semibold mb-1">{isCorrect ? '✅ ถูกต้อง!' : '❌ ยังไม่ถูก'}</div>
      <div className="text-slate-300 text-xs">{text}</div>
    </div>
  )
}

// ---- Main Component ----

export default function Exercise({ lessonId, questions, onPass }: ExerciseProps) {
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null)
  const [fillInput, setFillInput] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [allDone, setAllDone] = useState(false)
  const [passed, setPassed] = useState(() => {
    return localStorage.getItem(`ex-pass-${lessonId}`) === '1'
  })

  const q = questions[current]
  const totalQ = questions.length

  const handleChoiceSelect = (idx: number) => {
    if (submitted) return
    setSelectedChoice(idx)
    const correct = idx === (q as ChoiceQuestion).correct
    setIsCorrect(correct)
    if (correct) setScore((s) => s + 1)
    setSubmitted(true)
  }

  const handleFillSubmit = () => {
    if (submitted || !fillInput.trim()) return
    const fq = q as FillQuestion
    const correct = fq.correct.some((ans) => normalize(ans) === normalize(fillInput))
    setIsCorrect(correct)
    if (correct) setScore((s) => s + 1)
    setSubmitted(true)
  }

  const handleNext = () => {
    if (current === totalQ - 1) {
      const finalScore = score + (isCorrect ? 0 : 0) // score already updated
      const pass = score >= Math.ceil(totalQ * 0.6)
      setAllDone(true)
      if (pass) {
        localStorage.setItem(`ex-pass-${lessonId}`, '1')
        setPassed(true)
        onPass?.()
      }
    } else {
      setCurrent((c) => c + 1)
      setSelectedChoice(null)
      setFillInput('')
      setSubmitted(false)
      setIsCorrect(false)
    }
  }

  const handleRetry = () => {
    setCurrent(0)
    setScore(0)
    setSelectedChoice(null)
    setFillInput('')
    setSubmitted(false)
    setIsCorrect(false)
    setAllDone(false)
  }

  // ---- All Done Screen ----
  if (allDone) {
    const passThreshold = Math.ceil(totalQ * 0.6)
    const didPass = score >= passThreshold
    return (
      <div className="my-8 rounded-2xl overflow-hidden border-2 border-indigo-800">
        <div className="bg-slate-900 px-5 py-3 flex items-center gap-2 border-b border-slate-700">
          <span className="text-lg">🧪</span>
          <span className="text-indigo-300 font-semibold text-sm">ผลการทำแบบฝึกหัด</span>
        </div>
        <div className="bg-slate-950 p-8 text-center">
          <div className="text-6xl mb-4">{didPass ? '🎉' : '📚'}</div>
          <div className={`text-2xl font-bold mb-2 ${didPass ? 'text-green-400' : 'text-yellow-400'}`}>
            {didPass ? 'ผ่านแล้ว!' : 'ลองใหม่อีกครั้ง'}
          </div>
          <div className="text-slate-400 text-sm mb-6">
            ตอบถูก <span className="text-white font-bold">{score}</span> จาก{' '}
            <span className="text-white font-bold">{totalQ}</span> ข้อ
            {' '}(ต้องถูก {passThreshold} ข้อขึ้นไป)
          </div>

          {didPass ? (
            <div className="space-y-3">
              <div className="inline-block bg-green-900/50 border border-green-600 rounded-xl px-6 py-3 text-green-300 text-sm">
                ✅ บทนี้ถูกทำเครื่องหมายว่าเสร็จแล้วอัตโนมัติ
              </div>
              <div>
                <button
                  onClick={handleRetry}
                  className="mt-3 text-slate-400 hover:text-slate-200 text-xs underline block mx-auto"
                >
                  ทำใหม่อีกครั้ง
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleRetry}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-colors"
            >
              ลองใหม่อีกครั้ง →
            </button>
          )}
        </div>
      </div>
    )
  }

  // ---- Already Passed Banner ----
  const alreadyPassedBanner = passed && !allDone && (
    <div className="mb-3 flex items-center gap-2 text-xs text-green-400 bg-green-900/30 border border-green-700 rounded-lg px-3 py-2">
      <span>✅</span>
      <span>คุณผ่านแบบฝึกหัดนี้แล้ว — ทำใหม่ได้เพื่อทบทวน</span>
    </div>
  )

  // ---- Question Screen ----
  return (
    <div className="my-8">
      <div className="rounded-2xl overflow-hidden border-2 border-indigo-800 shadow-xl">
        {/* Header */}
        <div className="bg-slate-900 px-5 py-3 border-b border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">🧪</span>
              <span className="text-indigo-300 font-semibold text-sm">แบบฝึกหัดท้ายบท</span>
            </div>
            <span className="text-xs text-slate-500">
              {q.type === 'choice' ? 'เลือกคำตอบ' : 'เติมคำตอบ'}
            </span>
          </div>
          <ProgressBar current={current} total={totalQ} score={score} />
        </div>

        {/* Body */}
        <div className="bg-slate-950 p-5">
          {alreadyPassedBanner}

          {/* Question text */}
          <p className="text-white font-medium mb-4 leading-relaxed">{q.question}</p>

          {/* Optional code context */}
          {q.code && (
            <div className="mb-4">
              <CodeBlock code={q.code} language={q.codeLanguage ?? 'tsx'} />
            </div>
          )}

          {/* Choice question */}
          {q.type === 'choice' && (
            <div className="space-y-2">
              {(q as ChoiceQuestion).choices.map((choice, idx) => {
                const isSelected = selectedChoice === idx
                const isCorrectChoice = idx === (q as ChoiceQuestion).correct
                let cls = 'w-full text-left px-4 py-3 rounded-xl border text-sm transition-all '
                if (!submitted) {
                  cls += 'border-slate-700 text-slate-300 hover:border-indigo-500 hover:text-white hover:bg-indigo-900/30'
                } else if (isCorrectChoice) {
                  cls += 'border-green-500 bg-green-900/40 text-green-300 font-semibold'
                } else if (isSelected && !isCorrectChoice) {
                  cls += 'border-red-500 bg-red-900/40 text-red-300'
                } else {
                  cls += 'border-slate-800 text-slate-600'
                }
                return (
                  <button key={idx} onClick={() => handleChoiceSelect(idx)} className={cls}>
                    <span className="mr-3 text-slate-500">{String.fromCharCode(65 + idx)}.</span>
                    {choice}
                    {submitted && isCorrectChoice && <span className="ml-2">✓</span>}
                    {submitted && isSelected && !isCorrectChoice && <span className="ml-2">✗</span>}
                  </button>
                )
              })}
            </div>
          )}

          {/* Fill question */}
          {q.type === 'fill' && (
            <div className="space-y-3">
              {(q as FillQuestion).hint && (
                <p className="text-slate-400 text-xs">💡 Hint: {(q as FillQuestion).hint}</p>
              )}
              <div className="flex gap-2">
                <input
                  value={fillInput}
                  onChange={(e) => setFillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleFillSubmit()}
                  disabled={submitted}
                  placeholder="พิมพ์คำตอบ..."
                  className="flex-1 bg-slate-800 border border-slate-600 rounded-xl px-4 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-indigo-400 disabled:opacity-50"
                />
                <button
                  onClick={handleFillSubmit}
                  disabled={submitted || !fillInput.trim()}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl text-sm font-medium transition-colors"
                >
                  ▶ ตรวจ
                </button>
              </div>
              {submitted && !isCorrect && (
                <p className="text-xs text-slate-400">
                  คำตอบที่ถูก: <code className="text-green-400">{(q as FillQuestion).correct[0]}</code>
                </p>
              )}
            </div>
          )}

          {/* Explanation */}
          {submitted && <Explanation text={q.explanation} isCorrect={isCorrect} />}

          {/* Next button */}
          {submitted && (
            <button
              onClick={handleNext}
              className="mt-4 w-full py-2.5 bg-indigo-700 hover:bg-indigo-600 text-white rounded-xl font-semibold text-sm transition-colors"
            >
              {current === totalQ - 1 ? 'ดูผลคะแนน →' : 'ข้อถัดไป →'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
