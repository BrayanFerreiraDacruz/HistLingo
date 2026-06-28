import { useState, useEffect } from "react"
import { useLocation, useParams } from "wouter"
import { X, Heart, CheckCircle, XCircle, ChevronRight, Lightbulb, RotateCcw } from "lucide-react"
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
  const theory: LessonBlock = {
    id: 'theory',
    type: 'THEORY',
    title: lesson.title,
    content: lesson.content,
  }
  const challengeBlocks: LessonBlock[] = challenges
    .filter(c => {
      const opts = c.options as string[] | null | undefined
      return Array.isArray(opts) && opts.length >= 2 && c.correctAnswer
    })
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

  useEffect(() => {
    if (!lessonId) { setLocation('/'); return }
    Promise.all([content.getLesson(lessonId), content.getChallenges(lessonId)])
      .then(([lesson, challenges]) => setBlocks(buildBlocks(lesson!, challenges)))
      .catch(() => setLocation('/'))
      .finally(() => setLoading(false))
  }, [lessonId])

  if (loading) {
    return (
      <div className="fixed inset-0 bg-(--color-background) flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="text-6xl">⚙️</motion.div>
      </div>
    )
  }

  if (showVictory) {
    const accuracy = blocks.length > 1
      ? Math.round(((blocks.length - 1 - wrongCount) / (blocks.length - 1)) * 100)
      : 100
    return (
      <div className="fixed inset-0 bg-(--color-background) z-[100] flex flex-col items-center justify-center p-8 text-center gap-4">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }} className="text-8xl mb-2">🏆</motion.div>
        <h1 className="text-4xl font-black text-white tracking-tight">Lição completa!</h1>
        <p className="text-xl font-bold text-(--color-secondary)">+{xpGained} XP conquistados</p>
        {wrongCount > 0 && (
          <p className="text-sm text-gray-400 font-bold">
            {wrongCount} erro{wrongCount > 1 ? 's' : ''} — XP reduzido em {Math.round((1 - Math.max(0.5, 1 - wrongCount * 0.15)) * 100)}%
          </p>
        )}
        <div className="flex items-center gap-3 bg-(--color-card) border-2 border-(--color-border) rounded-2xl px-6 py-3 mt-2">
          <span className="text-2xl">{accuracy >= 80 ? '🎯' : accuracy >= 60 ? '👍' : '📚'}</span>
          <div className="text-left">
            <p className="text-white font-black text-lg">{accuracy}% de acerto</p>
            <p className="text-gray-400 text-sm font-bold">{accuracy >= 80 ? 'Excelente!' : accuracy >= 60 ? 'Bom trabalho!' : 'Continue praticando!'}</p>
          </div>
        </div>
        <div className="flex gap-4 mt-4">
          <button className="btn-base btn-secondary px-8 py-4" onClick={() => setLocation('/')}>MAPA</button>
          <button className="btn-base btn-primary px-8 py-4" onClick={() => setLocation('/leaderboard')}>VER LIGAS</button>
        </div>
      </div>
    )
  }

  if (hearts <= 0) {
    return (
      <div className="fixed inset-0 bg-(--color-background) z-[100] flex flex-col items-center justify-center p-8 text-center">
        <div className="text-8xl mb-8 drop-shadow-lg">💔</div>
        <h1 className="text-4xl font-black text-white mb-4 tracking-tight">Vidas esgotadas!</h1>
        <p className="text-lg font-bold text-gray-400 mb-12">Você pode tentar novamente. Cada erro é um aprendizado!</p>
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
          .then(async res => {
            setXpGained(res.xpGained)
            await refreshUser()
          })
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
      if (!correct) {
        setHearts(p => Math.max(0, p - 1))
        setWrongCount(p => p + 1)
      }
      if (user) {
        users.submitAnswer(user.id, block.id, correct ? 5 : 2).catch(() => {})
      }
    } else {
      advanceSequence()
    }
  }

  return (
    <div className="flex flex-col h-screen max-w-[900px] mx-auto bg-(--color-background) relative overflow-hidden select-none">

      {/* Header */}
      <div className="flex items-center p-4 md:p-8 gap-4 md:gap-6 shrink-0">
        <button onClick={() => setLocation('/')} className="p-2 rounded-full hover:bg-white/5 transition-colors">
          <X size={32} className="text-gray-500" strokeWidth={3} />
        </button>
        <div className="flex-1 h-4 md:h-5 bg-[#1A2633] rounded-full overflow-hidden border-2 border-[#2B3B4C] shadow-inner">
          <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-(--color-primary) rounded-full relative">
            <div className="absolute top-1 left-2 right-2 h-1 bg-white/30 rounded-full"></div>
          </motion.div>
        </div>
        <div className="flex items-center gap-2">
          <Heart size={28} fill="#FF4B4B" color="#FF4B4B" className={hearts === 1 ? 'animate-pulse' : ''} />
          <span className="text-(--color-destructive) font-black text-xl">{hearts}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 md:px-16 lg:px-24 py-2 overflow-y-auto pb-52 flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.div key={`${block.id}-${retriedSet.size}`}
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }} className="w-full max-w-[640px] flex flex-col items-start">

            {isTheory ? (
              <>
                <div className="flex items-center gap-4 mb-8 w-full bg-[#1A2633] p-4 md:p-5 rounded-3xl border-2 border-[#2B3B4C]">
                  <div className="bg-(--color-secondary) p-3 rounded-2xl text-black shrink-0"><Lightbulb size={32} strokeWidth={2.5} /></div>
                  <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider">Novo Conhecimento</h1>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-(--color-secondary) mb-6 tracking-tighter leading-tight">{block.title}</h2>
                <p className="text-xl md:text-2xl font-bold text-white/90 leading-relaxed">{block.content}</p>
              </>
            ) : (
              <>
                <h1 className="text-2xl md:text-3xl font-black text-white mb-8 leading-tight tracking-tight w-full">{block.title}</h1>
                {block.type === 'WHO_AM_I' && (
                  <div className="flex items-end gap-4 md:gap-6 mb-10 w-full">
                    <div className="text-6xl md:text-7xl drop-shadow-2xl">🏹</div>
                    <div className="flex-1 bg-(--color-card) border-2 border-(--color-border) p-5 rounded-[2rem] rounded-bl-sm text-lg md:text-xl font-bold text-white leading-relaxed relative">
                      {block.content}
                      <div className="absolute -left-4 bottom-2 w-0 h-0 border-t-[10px] border-t-transparent border-r-[15px] border-r-(--color-border) border-b-[10px] border-b-transparent"></div>
                    </div>
                  </div>
                )}
                {block.type === 'DECISION_SCENARIO' && (
                  <div className="bg-(--color-accent)/20 border-2 border-(--color-accent) p-6 md:p-8 rounded-[2rem] text-lg md:text-xl font-bold text-white leading-relaxed mb-10 w-full">
                    <p className="italic">"{block.content}"</p>
                  </div>
                )}
                {(block.type === 'WORKS_AND_RELICS' || block.type === 'TIMELINE') && (
                  <div className="bg-[#1A2633] border-2 border-[#2B3B4C] p-6 md:p-8 rounded-[2rem] text-lg md:text-xl font-bold text-white leading-relaxed mb-10 w-full">
                    <p>{block.content}</p>
                  </div>
                )}
                {block.options && (
                  <div className="grid grid-cols-1 gap-3 w-full">
                    {block.options.map((opt, i) => {
                      let cls = 'bg-(--color-card) border-(--color-border) text-white hover:bg-white/5'
                      const isSelected = selectedOption === opt
                      if (isChecking && isSelected) {
                        cls = isCorrect
                          ? 'bg-(--color-primary)/20 border-(--color-primary) text-(--color-primary)'
                          : 'bg-(--color-destructive)/20 border-(--color-destructive) text-(--color-destructive)'
                      } else if (isChecking && opt === block.correctAnswer) {
                        cls = 'border-(--color-primary) bg-(--color-background) text-(--color-primary)'
                      } else if (isSelected && !isChecking) {
                        cls = 'bg-(--color-accent)/20 border-(--color-accent) text-(--color-accent-foreground)'
                      }
                      return (
                        <button key={i} disabled={isChecking}
                          className={`group p-4 md:p-5 rounded-2xl text-left text-base md:text-lg font-black border-2 transition-all duration-150 active:translate-y-0.5 outline-none ${cls}`}
                          onClick={() => handleSelect(opt)}>
                          <div className="flex items-center gap-3">
                            <span className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center text-xs font-black shrink-0 ${isSelected ? 'border-current' : 'text-gray-500 border-(--color-border)'}`}>{i + 1}</span>
                            <span className="flex-1">{opt}</span>
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

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 z-50">
        <AnimatePresence>
          {(!isTheory && isChecking) && (
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: "spring", stiffness: 220, damping: 26 }}
              className={`absolute bottom-0 left-0 right-0 p-6 pt-8 pb-36 rounded-t-[36px] shadow-[0_-20px_40px_rgba(0,0,0,0.5)] ${isCorrect ? 'bg-(--color-primary-dark)' : 'bg-(--color-destructive-dark)'}`}>
              <div className="max-w-[640px] mx-auto flex items-start gap-4 text-white px-2 md:px-4">
                <div className="p-3 rounded-2xl bg-white/20 shrink-0 mt-0.5">
                  {isCorrect ? <CheckCircle size={36} strokeWidth={2.5} /> : <XCircle size={36} strokeWidth={2.5} />}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-black mb-2 uppercase tracking-tight">
                    {isCorrect ? 'Esplêndido! +5 XP' : 'Resposta incorreta'}
                  </h2>
                  <p className="text-base font-bold text-white/90 leading-snug">{block.explanation}</p>
                  {!isCorrect && canRetry && (
                    <p className="text-sm font-bold text-white/70 mt-2">💡 Você tem 1 chance de tentar novamente</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={`relative z-20 p-5 md:p-6 border-t-2 transition-colors duration-300 ${!isTheory && isChecking ? (isCorrect ? 'bg-(--color-primary-dark) border-transparent' : 'bg-(--color-destructive-dark) border-transparent') : 'bg-(--color-background) border-(--color-border)'}`}>
          <div className="max-w-[640px] mx-auto flex flex-col gap-3">

            {/* Retry button — shown when wrong and can still retry */}
            {!isTheory && isChecking && canRetry && (
              <button
                className="btn-base btn-outline w-full py-4 text-base flex items-center justify-center gap-2 border-white/30 text-white"
                onClick={handleRetry}>
                <RotateCcw size={18} strokeWidth={3} />
                TENTAR NOVAMENTE
              </button>
            )}

            {/* Main action button */}
            <button
              className={`btn-base w-full py-4 md:py-5 text-lg tracking-widest ${
                isTheory ? 'btn-secondary' :
                (!selectedOption && !isChecking ? 'btn-disabled' :
                isChecking ? (isCorrect ? 'btn-primary border-white/20' : 'btn-danger border-white/20') :
                'btn-secondary')
              }`}
              onClick={handleAction}
              disabled={!isTheory && !selectedOption && !isChecking}>
              <div className="flex items-center justify-center gap-3">
                <span>{isTheory ? 'ENTENDI' : (isChecking ? 'CONTINUAR' : 'VERIFICAR')}</span>
                {(isTheory || isChecking) && <ChevronRight size={22} strokeWidth={4} />}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
