import { useEffect, useState } from "react"
import { Check, Star, Lock } from "lucide-react"
import { motion } from "framer-motion"
import { Link } from "wouter"
import { content, users, Module, Lesson } from "../lib/api"
import { useAuth } from "../lib/AuthContext"

const MODULE_ICONS: Record<number, string> = { 1: '🏹', 2: '⛵', 3: '👑', 4: '⚙️', 5: '✊' }
const MODULE_COLORS: Record<number, { bg: string; border: string; shadow: string }> = {
  1: { bg: 'bg-(--color-primary)', border: 'border-[#007F5F]', shadow: 'shadow-neo-primary' },
  2: { bg: 'bg-(--color-accent)', border: 'border-(--color-accent-dark)', shadow: 'shadow-neo-accent' },
  3: { bg: 'bg-[#7C3AED]', border: 'border-[#5B21B6]', shadow: 'shadow-[0_4px_0_#5B21B6]' },
  4: { bg: 'bg-[#DC2626]', border: 'border-[#991B1B]', shadow: 'shadow-[0_4px_0_#991B1B]' },
  5: { bg: 'bg-[#D97706]', border: 'border-[#92400E]', shadow: 'shadow-[0_4px_0_#92400E]' },
}
const SINUOUS = [0, -1, -2, -1, 0, 1, 2, 1, 0]

function PathNode({ status, position, label, href = "#" }: {
  status: "completed" | "active" | "locked", position: number, label?: string, href?: string
}) {
  const posMap: Record<number, string> = { 0: "right-0", [-1]: "right-8", [-2]: "right-12", 1: "-right-8", 2: "-right-12" }
  const isCompleted = status === "completed"
  const isActive = status === "active"

  const content = (
    <div className={`relative flex flex-col items-center justify-center my-6 w-full ${posMap[position] ?? 'right-0'}`}>
      {isActive && (
        <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
          className="absolute -top-14 bg-white text-(--color-primary-dark) border-2 border-(--color-border) px-5 py-2 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg z-30">
          Começar!
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b-2 border-r-2 border-(--color-border) rotate-45"></div>
        </motion.div>
      )}
      <div className="relative z-20">
        <div className={`absolute -inset-3 rounded-full border-4 ${isCompleted ? 'border-(--color-secondary)' : isActive ? 'border-t-(--color-secondary) border-r-(--color-secondary) border-b-(--color-secondary) border-l-[#2B3B4C] rotate-45' : 'border-transparent'}`}></div>
        <button className={`node-btn relative
          ${isCompleted ? 'bg-(--color-secondary) text-(--color-secondary-dark) border-white shadow-neo-secondary hover:brightness-110' : ''}
          ${isActive ? 'bg-(--color-primary) text-white border-white shadow-neo-primary -rotate-45 hover:brightness-110 scale-110' : ''}
          ${status === 'locked' ? 'bg-(--color-input) text-gray-500 border-gray-600 shadow-neo-card cursor-not-allowed' : ''}
        `}>
          {isCompleted && <Check size={36} strokeWidth={3.5} />}
          {isActive && <Star size={36} fill="white" strokeWidth={0} />}
          {status === 'locked' && <Lock size={32} strokeWidth={3} />}
        </button>
      </div>
      {label && (
        <div className="absolute -left-32 top-1/2 -translate-y-1/2 text-right w-24">
          <span className="text-gray-400 font-bold text-sm tracking-wide bg-(--color-background) px-2 py-1 rounded-lg border border-(--color-border)">{label}</span>
        </div>
      )}
    </div>
  )

  if (isActive) return <Link href={href} className="w-full flex justify-center outline-none">{content}</Link>
  return <div className="w-full flex justify-center outline-none">{content}</div>
}

function getLessonStatus(index: number, completedIds: string[], lessons: Lesson[], moduleUnlocked: boolean): "completed" | "active" | "locked" {
  if (!moduleUnlocked) return "locked"
  const lesson = lessons[index]
  if (!lesson) return "locked"
  if (completedIds.includes(lesson.id)) return "completed"
  // Active if previous lesson completed (or it's the first)
  if (index === 0) return "active"
  const prev = lessons[index - 1]
  if (prev && completedIds.includes(prev.id)) return "active"
  return "locked"
}

export function Home() {
  useAuth()
  const [modules, setModules] = useState<Module[]>([])
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([content.getModules(), users.getProgress()])
      .then(([mods, progress]) => {
        setModules(mods)
        setCompletedLessons(progress)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          className="text-5xl">⚙️</motion.div>
        <p className="text-gray-400 font-bold">Carregando mapa...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-16 pb-24 w-full max-w-[500px] mx-auto relative pt-4">
      <div className="absolute left-1/2 top-10 bottom-0 w-3 bg-[#1A2633] -translate-x-1/2 rounded-full -z-10"></div>
      <div className="absolute left-1/2 top-10 h-[380px] w-3 bg-(--color-secondary) -translate-x-1/2 rounded-t-full -z-10 shadow-[0_0_15px_rgba(255,215,0,0.4)]"></div>

      {modules.map((mod, modIdx) => {
        const colors = MODULE_COLORS[mod.order] || MODULE_COLORS[1]
        const icon = MODULE_ICONS[mod.order] || '📚'
        const lessons = mod.lessons || []

        // Module is unlocked if it's the first OR if prev module has at least its first lesson completed
        const prevMod = modIdx > 0 ? modules[modIdx - 1] : null
        const prevLessons = prevMod?.lessons || []
        const moduleUnlocked = modIdx === 0 || prevLessons.some(l => completedLessons.includes(l.id))

        return (
          <section key={mod.id} className="relative w-full z-10">
            <div className={`${colors.bg} text-white p-7 rounded-[2rem] mb-10 ${colors.shadow} flex items-center justify-between overflow-hidden relative border-2 ${colors.border} ${!moduleUnlocked ? 'opacity-50' : ''}`}>
              <div className="z-10">
                <h2 className="m-0 text-3xl font-black mb-1 tracking-tight drop-shadow-md">Unidade {mod.order}</h2>
                <p className="m-0 text-lg font-bold opacity-90 drop-shadow-sm">{mod.title}</p>
                <p className="m-0 mt-3 text-sm font-bold bg-black/20 self-start inline-block px-3 py-1 rounded-xl">
                  {!moduleUnlocked ? '🔒 Bloqueado' : `${lessons.filter(l => completedLessons.includes(l.id)).length}/${lessons.length} lições`}
                </p>
              </div>
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-5xl z-10 border-4 border-white/30 backdrop-blur-sm">
                {icon}
              </div>
              <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full z-0 blur-xl"></div>
            </div>

            <div className="flex flex-col items-center gap-1">
              {lessons.map((lesson, i) => {
                const status = getLessonStatus(i, completedLessons, lessons, moduleUnlocked)
                return (
                  <PathNode
                    key={lesson.id}
                    status={status}
                    position={SINUOUS[i % SINUOUS.length]}
                    label={lesson.title.length > 10 ? lesson.title.substring(0, 10) + '…' : lesson.title}
                    href={`/quiz/${lesson.id}`}
                  />
                )
              })}
              {/* Boss node */}
              <PathNode status={lessons.every(l => completedLessons.includes(l.id)) && moduleUnlocked ? "active" : "locked"} position={0} label="Chefe" />
            </div>
          </section>
        )
      })}

      {modules.length === 0 && (
        <div className="text-center text-gray-400 font-bold py-20">
          <p className="text-4xl mb-4">🏹</p>
          <p>Conteúdo carregando...</p>
        </div>
      )}
    </div>
  )
}
