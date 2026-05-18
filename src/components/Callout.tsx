interface CalloutProps {
  type?: 'info' | 'tip' | 'warning' | 'danger' | 'definition'
  title?: string
  children: React.ReactNode
}

const config = {
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    icon: 'ℹ️',
    titleColor: 'text-blue-800',
    textColor: 'text-blue-700',
  },
  tip: {
    bg: 'bg-green-50',
    border: 'border-green-300',
    icon: '💡',
    titleColor: 'text-green-800',
    textColor: 'text-green-700',
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-300',
    icon: '⚠️',
    titleColor: 'text-yellow-800',
    textColor: 'text-yellow-700',
  },
  danger: {
    bg: 'bg-red-50',
    border: 'border-red-300',
    icon: '🚫',
    titleColor: 'text-red-800',
    textColor: 'text-red-700',
  },
  definition: {
    bg: 'bg-indigo-50',
    border: 'border-indigo-300',
    icon: '📖',
    titleColor: 'text-indigo-800',
    textColor: 'text-indigo-700',
  },
}

export default function Callout({ type = 'info', title, children }: CalloutProps) {
  const c = config[type]
  return (
    <div className={`my-4 p-4 rounded-lg border-l-4 ${c.bg} ${c.border}`}>
      <div className={`flex items-center gap-2 font-semibold mb-1 ${c.titleColor}`}>
        <span>{c.icon}</span>
        <span>{title ?? type.charAt(0).toUpperCase() + type.slice(1)}</span>
      </div>
      <div className={`text-sm leading-relaxed ${c.textColor}`}>{children}</div>
    </div>
  )
}
