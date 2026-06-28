import { useState, useEffect, useRef } from "react"
import { useLocation, useParams } from "wouter"
import { X, Heart, CheckCircle, XCircle, ChevronRight, RotateCcw } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import { content, users, Lesson, Challenge } from "../lib/api"
import { useAuth } from "../lib/AuthContext"

type BlockType = 'THEORY' | 'WHO_AM_I' | 'WORKS_AND_RELICS' | 'TIMELINE' | 'DECISION_SCENARIO'

interface LessonBlock {
  id: string
  type: BlockType
  title: string
  content: string
  options?: string[]
  correctAnswer?: string
  explanation?: string
}

// ── Module characters ──────────────────────────────────────────────────────
interface Character {
  emoji: string
  name: string
  role: string
  colorClass: string
  bgClass: string
  correctMsg: string
  wrongMsg: string
}

const MODULE_CHARACTERS: Record<number, Character> = {
  1: {
    emoji: '🪶', name: 'Tupã', role: 'Guia dos Povos Originários',
    colorClass: 'text-emerald-400', bgClass: 'bg-emerald-900/30 border-emerald-600/40',
    correctMsg: 'Os espíritos ancestrais te guiam, guerreiro!',
    wrongMsg: 'A terra tem muitos saberes. Tente novamente!',
  },
  2: {
    emoji: '⚓', name: 'Navegador', role: 'Explorador Colonial',
    colorClass: 'text-sky-400', bgClass: 'bg-sky-900/30 border-sky-600/40',
    correctMsg: 'Ventos favoráveis! Você está no caminho certo.',
    wrongMsg: 'O oceano é traiçoeiro. Mas todo erro ensina.',
  },
  3: {
    emoji: '👑', name: 'D. Pedro', role: 'Voz do Império',
    colorClass: 'text-yellow-400', bgClass: 'bg-yellow-900/30 border-yellow-600/40',
    correctMsg: 'Pela honra do Império! Resposta magnífica.',
    wrongMsg: 'A história é complexa, mas você aprenderá.',
  },
  4: {
    emoji: '🏛️', name: 'Republicano', role: 'Arauto da República',
    colorClass: 'text-orange-400', bgClass: 'bg-orange-900/30 border-orange-600/40',
    correctMsg: 'Ordem e Progresso! Você conhece a história.',
    wrongMsg: 'A República foi construída com erros e acertos.',
  },
  5: {
    emoji: '✊', name: 'Resistente', role: 'Voz da Democracia',
    colorClass: 'text-rose-400', bgClass: 'bg-rose-900/30 border-rose-600/40',
    correctMsg: 'Diretas Já! A história do povo está em você.',
    wrongMsg: 'A luta continua. Cada erro nos torna mais fortes.',
  },
}

function getModuleNumber(lessonId: string): number {
  const m = lessonId.match(/^l-(\d+)-/)
  return m ? parseInt(m[1]) : 1
}

const TYPE_LABELS: Record<string, string> = {
  WHO_AM_I: 'Quem Sou Eu?',
  WORKS_AND_RELICS: 'Obras e Relíquias',
  TIMELINE: 'Linha do Tempo',
  DECISION_SCENARIO: 'Decisão Histórica',
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildBlocks(lesson: Lesson, challenges: Challenge[]): LessonBlock[] {
  const theory: LessonBlock = { id: 'theory', type: 'THEORY', title: lesson.title, content: lesson.content }
  const challengeBlocks = challenges
    .filter(c => Array.isArray(c.options) && (c.options as string[]).length >= 2 && c.correctAnswer)
    .map(c => ({
      id: c.id,
      type: c.type as BlockType,
      title: TYPE_LABELS[c.type] || c.type,
      content: c.content,
      options: shuffle(c.options as string[]),
      correctAnswer: c.correctAnswer,
      explanation: c.explanation || undefined,
    }))
  return [theory, ...challengeBlocks]
}

export function Quiz() {
  const params = useParams<{ lessonId: string }>()
  const lessonId = params.lessonId
  const [, setLocation] = useLocation()
  const { user, refreshUser } = useAuth()
  const scrollRef = useRef<HTMLDivElement>(null)

  const [blocks, setBlocks] = useState<LessonBlock[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [hearts, setHearts] = useState(5)
  const [wrongCount, setWrongCount] = useState(0)
  const [retriedSet, setRetriedSet] = useState<Set<string>>(new Set())
  const [xpGained, setXpGained] = useState(0)
  const [showVictory, setShowVictory] = useState(false)

  const moduleNum = getModuleNumber(lessonId || 'l-1-1')
  const char = MODULE_CHARACTERS[moduleNum] || MODULE_CHARACTERS[1]

  useEffect(() => {
    if (!lessonId) { setLocation('/'); return }
    Promise.all([content.getLesson(lessonId), content.getChallenges(lessonId)])
      .then(([lesson, challenges]) => setBlocks(buildBlocks(lesson!, challenges)))
      .catch(() => setLocation('/'))
      .finally(() => setLoading(false))
  }, [lessonId])

  // Scroll content to top on each new block
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentIndex])

  if (loading) {
    return (
      <div className="fixed inset-0 bg-(--color-background) flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="text-6xl">{char.emoji}</motion.div>
      </div>
    )
  }

  if (showVictory) {
    const total = blocks.length - 1
    const accuracy = total > 0 ? Math.round(((total - wrongCount) / total) * 100) : 100
    return (
      <div className="fixed inset-0 bg-(--color-background) z-[100] flex flex-col items-center justify-center p-8 text-center gap-4">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}
          className="text-8xl mb-2">🏆</motion.div>
        <h1 className="text-4xl font-black text-white tracking-tight">Lição completa!</h1>
        <p className="text-xl font-bold text-(--color-secondary)">+{xpGained} XP conquistados</p>
        {wrongCount > 0 && (
          <p className="text-sm text-gray-400 font-bold">
            {wrongCount} erro{wrongCount !== 1 ? 's' : ''} · XP reduzido em {Math.round((1 - Math.max(0.5, 1 - wrongCount * 0.15)) * 100)}%
          </p>
        )}
        {/* Character congratulation */}
        <div className={`flex items-center gap-3 border rounded-2xl px-5 py-3 mt-1 ${char.bgClass}`}>
          <span className="text-3xl">{char.emoji}</span>
          <div className="text-left">
            <p className={`font-black text-sm ${char.colorClass}`}>{char.name}</p>
            <p className="text-white text-sm font-bold">{accuracy >= 80 ? char.correctMsg : 'Continue praticando!'}</p>
          </div>
        </div>
        <div className="flex gap-4 mt-2">
          <button className="btn-base btn-secondary px-8 py-4" onClick={() => setLocation('/')}>MAPA</button>
          <button className="btn-base btn-primary px-8 py-4" onClick={() => setLocation('/leaderboard')}>VER LIGAS</button>
        </div>
      </div>
    )
  }

  if (hearts <= 0) {
    return (
      <div className="fixed inset-0 bg-(--color-background) z-[100] flex flex-col items-center justify-center p-8 text-center gap-6">
        <div className="text-8xl">💔</div>
        <div>
          <h1 className="text-4xl font-black text-white mb-3 tracking-tight">Vidas esgotadas!</h1>
          <p className="text-lg font-bold text-gray-400">Cada erro é um aprendizado. Tente novamente!</p>
        </div>
        <div className={`flex items-center gap-3 border rounded-2xl px-5 py-3 ${char.bgClass}`}>
          <span className="text-3xl">{char.emoji}</span>
          <p className={`font-bold text-sm ${char.colorClass}`}>{char.wrongMsg}</p>
        </div>
        <button className="btn-base btn-primary w-full max-w-sm py-5" onClick={() => setLocation('/')}>VOLTAR AO MAPA</button>
      </div>
    )
  }

  const block = blocks[currentIndex]
  if (!block) return null

  const progress = ((currentIndex + 1) / blocks.length) * 100
  const isTheory = block.type === 'THEORY'
  const canRetry = !isCorrect && isChecking && !retriedSet.has(block.id)

  const handleSelect = (option: string) => { if (!isChecking) setSelectedOption(option) }

  const handleRetry = () => {
    setRetriedSet(prev => new Set(prev).add(block.id))
    setIsChecking(false)
    setSelectedOption(null)
    setIsCorrect(null)
  }

  const advanceSequence = () => {
    if (currentIndex < blocks.length - 1) {
      setCurrentIndex(p => p + 1)
      setSelectedOption(null)
      setIsChecking(false)
      setIsCorrect(null)
    } else {
      confetti({ particleCount: 200, spread: 90, origin: { y: 0.6 }, colors: ['#00A651', '#FFD700', '#003566', '#FFFFFF'] })
      if (user && lessonId) {
        users.completeLesson(user.id, lessonId, wrongCount)
          .then(async res => { setXpGained(res.xpGained); await refreshUser() })
          .catch(() => {})
          .finally(() => setShowVictory(true))
      } else {
        setShowVictory(true)
      }
    }
  }

  const handleAction = () => {
    if (isTheory) { advanceSequence(); return }
    if (!selectedOption) return
    if (!isChecking) {
      const correct = selectedOption === block.correctAnswer
      setIsCorrect(correct)
      setIsChecking(true)
      if (!correct) { setHearts(p => Math.max(0, p - 1)); setWrongCount(p => p + 1) }
      if (user) users.submitAnswer(user.id, block.id, correct ? 5 : 2).catch(() => {})
    } else {
      advanceSequence()
    }
  }

  // Footer bg changes when feedback is showing
  const footerBg = !isTheory && isChecking
    ? (isCorrect ? 'bg-(--color-primary-dark) border-transparent' : 'bg-(--color-destructive-dark) border-transparent')
    : 'bg-(--color-background) border-(--color-border)'

  return (
    // h-[100svh] = small viewport height — fixes iOS Safari where 100vh > visible area
    <div className="flex flex-col h-[100svh] max-w-[900px] mx-auto bg-(--color-background) select-none">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="shrink-0 flex items-center px-4 py-3 md:px-8 md:py-5 gap-4">
        <button onClick={() => setLocation('/')} className="p-2 rounded-full hover:bg-white/5 transition-colors">
          <X size={28} className="text-gray-500" strokeWidth={3} />
        </button>
        <div className="flex-1 h-4 bg-[#1A2633] rounded-full overflow-hidden border-2 border-[#2B3B4C]">
          <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }}
            className="h-full bg-(--color-primary) rounded-full">
            <div className="h-1 mt-1 mx-1 bg-white/25 rounded-full"></div>
          </motion.div>
        </div>
        <div className="flex items-center gap-1.5">
          <Heart size={24} fill="#FF4B4B" color="#FF4B4B" className={hearts === 1 ? 'animate-pulse' : ''} />
          <span className="text-(--color-destructive) font-black text-lg">{hearts}</span>
        </div>
      </div>

      {/* ── Scrollable content ─────────────────────────────────── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 md:px-14 lg:px-20 pt-2 pb-6 flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.div key={`${block.id}-${retriedSet.size}`}
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.22 }}
            className="w-full max-w-[640px] flex flex-col items-start">

            {isTheory ? (
              /* ── Theory: character presents the content ── */
              <>
                <div className="flex items-start gap-4 mb-6 w-full">
                  {/* Character avatar */}
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                    className="shrink-0 flex flex-col items-center gap-1">
                    <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full border-2 flex items-center justify-center text-3xl md:text-4xl ${char.bgClass}`}>
                      {char.emoji}
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-wide ${char.colorClass}`}>{char.name}</span>
                  </motion.div>

                  {/* Speech bubble with content */}
                  <div className={`flex-1 border-2 p-4 md:p-5 rounded-[1.5rem] rounded-tl-sm ${char.bgClass}`}>
                    <p className={`text-xs font-black uppercase tracking-widest mb-2 ${char.colorClass}`}>{char.role}</p>
                    <p className="text-base md:text-lg font-bold text-white leading-relaxed">{block.content}</p>
                  </div>
                </div>
                <h2 className={`text-2xl md:text-3xl font-black mb-4 tracking-tight ${char.colorClass}`}>{block.title}</h2>
              </>
            ) : (
              /* ── Challenge blocks ── */
              <>
                <h1 className="text-xl md:text-2xl font-black text-white mb-6 leading-tight tracking-tight w-full">{block.title}</h1>
                {block.type === 'WHO_AM_I' && (
                  <div className="flex items-end gap-4 mb-8 w-full">
                    <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center text-3xl shrink-0 ${char.bgClass}`}>{char.emoji}</div>
                    <div className="flex-1 bg-(--color-card) border-2 border-(--color-border) p-4 md:p-5 rounded-[1.5rem] rounded-bl-sm text-base md:text-lg font-bold text-white leading-relaxed relative">
                      {block.content}
                      <div className="absolute -left-3 bottom-3 w-0 h-0 border-t-[8px] border-t-transparent border-r-[12px] border-r-(--color-border) border-b-[8px] border-b-transparent"></div>
                    </div>
                  </div>
                )}
                {block.type === 'DECISION_SCENARIO' && (
                  <div className="bg-(--color-accent)/20 border-2 border-(--color-accent) p-5 md:p-7 rounded-[1.5rem] text-base md:text-lg font-bold text-white leading-relaxed mb-8 w-full">
                    <p className="italic">"{block.content}"</p>
                  </div>
                )}
                {(block.type === 'WORKS_AND_RELICS' || block.type === 'TIMELINE') && (
                  <div className="bg-[#1A2633] border-2 border-[#2B3B4C] p-5 md:p-7 rounded-[1.5rem] text-base md:text-lg font-bold text-white leading-relaxed mb-8 w-full">
                    <p>{block.content}</p>
                  </div>
                )}
                {block.options && (
                  <div className="grid grid-cols-1 gap-3 w-full">
                    {block.options.map((opt, i) => {
                      const isSelected = selectedOption === opt
                      let cls = 'bg-(--color-card) border-(--color-border) text-white hover:bg-white/5'
                      if (isChecking && isSelected)
                        cls = isCorrect ? 'bg-(--color-primary)/20 border-(--color-primary) text-(--color-primary)' : 'bg-(--color-destructive)/20 border-(--color-destructive) text-(--color-destructive)'
                      else if (isChecking && opt === block.correctAnswer)
                        cls = 'border-(--color-primary) bg-(--color-background) text-(--color-primary)'
                      else if (isSelected && !isChecking)
                        cls = 'bg-(--color-accent)/20 border-(--color-accent) text-(--color-accent-foreground)'
                      return (
                        <button key={i} disabled={isChecking} onClick={() => handleSelect(opt)}
                          className={`group p-4 md:p-5 rounded-2xl text-left text-sm md:text-base font-black border-2 transition-all duration-150 outline-none active:translate-y-0.5 ${cls}`}>
                          <div className="flex items-center gap-3">
                            <span className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center text-xs font-black shrink-0 ${isSelected ? 'border-current' : 'text-gray-500 border-(--color-border)'}`}>{i + 1}</span>
                            <span className="flex-1 leading-snug">{opt}</span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Footer (shrink-0 = always visible, never scrolls away) ── */}
      <div className="shrink-0 relative">

        {/* Feedback panel — slides UP from the footer */}
        <AnimatePresence>
          {(!isTheory && isChecking) && (
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: "spring", stiffness: 220, damping: 26 }}
              className={`absolute bottom-full left-0 right-0 px-5 pt-5 pb-4 rounded-t-[28px] shadow-[0_-16px_32px_rgba(0,0,0,0.5)] ${isCorrect ? 'bg-(--color-primary-dark)' : 'bg-(--color-destructive-dark)'}`}>
              <div className="max-w-[640px] mx-auto flex items-start gap-3 text-white">
                <div className="p-2.5 rounded-xl bg-white/20 shrink-0">
                  {isCorrect ? <CheckCircle size={30} strokeWidth={2.5} /> : <XCircle size={30} strokeWidth={2.5} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{char.emoji}</span>
                    <h2 className="text-base font-black uppercase tracking-tight">
                      {isCorrect ? char.correctMsg : char.wrongMsg}
                    </h2>
                  </div>
                  <p className="text-sm font-bold text-white/85 leading-snug">{block.explanation}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action buttons */}
        <div className={`px-4 py-3 md:px-6 md:py-4 border-t-2 transition-colors duration-300 ${footerBg}`}>
          <div className="max-w-[640px] mx-auto flex flex-col gap-2">
            {/* Retry button */}
            {!isTheory && isChecking && canRetry && (
              <button onClick={handleRetry}
                className="btn-base btn-outline w-full py-3 text-sm flex items-center justify-center gap-2 border-white/30 text-white">
                <RotateCcw size={16} strokeWidth={3} />
                TENTAR NOVAMENTE
              </button>
            )}
            {/* Main CTA */}
            <button onClick={handleAction} disabled={!isTheory && !selectedOption && !isChecking}
              className={`btn-base w-full py-4 text-base tracking-widest ${
                isTheory ? 'btn-secondary' :
                (!selectedOption && !isChecking) ? 'btn-disabled' :
                isChecking ? (isCorrect ? 'btn-primary border-white/20' : 'btn-danger border-white/20') :
                'btn-secondary'
              }`}>
              <span className="flex items-center justify-center gap-2">
                {isTheory ? 'ENTENDI' : isChecking ? 'CONTINUAR' : 'VERIFICAR'}
                {(isTheory || isChecking) && <ChevronRight size={20} strokeWidth={4} />}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
