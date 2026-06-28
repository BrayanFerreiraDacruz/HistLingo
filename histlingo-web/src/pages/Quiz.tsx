import { useState, useEffect } from "react"
import { useLocation, useParams } from "wouter"
import { X, Heart, CheckCircle, XCircle, ChevronRight, Lightbulb } from "lucide-react"
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
  highlight?: string
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

function buildBlocks(lesson: Lesson, challenges: Challenge[]): LessonBlock[] {
  const theory: LessonBlock = {
    id: 'theory',
    type: 'THEORY',
    title: lesson.title,
    content: lesson.content,
  }
  const challengeBlocks: LessonBlock[] = challenges.map(c => ({
    id: c.id,
    type: c.type as BlockType,
    title: TYPE_LABELS[c.type] || c.type,
    content: c.content,
    options: c.options || undefined,
    correctAnswer: c.correctAnswer,
    explanation: c.explanation || undefined,
  }))
  return [theory, ...challengeBlocks]
}

export function Quiz() {
  const params = useParams<{ lessonId: string }>()
  const lessonId = params.lessonId
  const [, setLocation] = useLocation()
  const { user } = useAuth()

  const [blocks, setBlocks] = useState<LessonBlock[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [hearts, setHearts] = useState(5)
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
    return (
      <div className="fixed inset-0 bg-(--color-background) z-[100] flex flex-col items-center justify-center p-8 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }} className="text-8xl mb-6">🏆</motion.div>
        <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Lição completa!</h1>
        <p className="text-xl font-bold text-(--color-secondary) mb-8">+{xpGained} XP conquistados</p>
        <div className="flex gap-4">
          <button className="btn-secondary" onClick={() => setLocation('/')}>MAPA</button>
          <button className="btn-primary" onClick={() => { setLocation('/leaderboard') }}>VER LIGAS</button>
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
        <button className="btn-primary w-full max-w-sm" onClick={() => setLocation('/')}>VOLTAR AO MAPA</button>
      </div>
    )
  }

  const block = blocks[currentIndex]
  if (!block) return null
  const progress = ((currentIndex + 1) / blocks.length) * 100
  const isTheory = block.type === 'THEORY'

  const handleSelect = (option: string) => { if (!isChecking) setSelectedOption(option) }

  const advanceSequence = () => {
    if (currentIndex < blocks.length - 1) {
      setCurrentIndex(p => p + 1)
      setSelectedOption(null)
      setIsChecking(false)
      setIsCorrect(null)
    } else {
      // Lesson complete!
      confetti({ particleCount: 200, spread: 90, origin: { y: 0.6 }, colors: ['#00A651', '#FFD700', '#003566', '#FFFFFF'] })
      if (user && lessonId) {
        users.completeLesson(user.id, lessonId)
          .then(res => { setXpGained(res.xpGained) })
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
      if (!correct) setHearts(p => Math.max(0, p - 1))
      // Record answer XP
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
      <div className="flex items-center p-6 md:p-10 gap-6">
        <button onClick={() => setLocation('/')} className="p-2 rounded-full hover:bg-white/5 transition-colors cursor-pointer">
          <X size={36} className="text-gray-500" strokeWidth={3} />
        </button>
        <div className="flex-1 h-5 bg-[#1A2633] rounded-full overflow-hidden relative border-2 border-[#2B3B4C] shadow-inner">
          <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-(--color-primary) rounded-full relative">
            <div className="absolute top-1 left-2 right-2 h-1.5 bg-white/30 rounded-full"></div>
          </motion.div>
        </div>
        <div className="flex items-center gap-2.5">
          <Heart size={36} fill="#FF4B4B" color="#FF4B4B" className={hearts === 1 ? 'animate-pulse' : ''} />
          <span className="text-(--color-destructive) font-black text-2xl">{hearts}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 md:px-20 py-4 overflow-y-auto pb-64 flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.div key={block.id} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }} className="w-full max-w-[640px] flex flex-col items-start">

            {isTheory ? (
              <>
                <div className="flex items-center gap-4 mb-10 w-full bg-[#1A2633] p-5 rounded-3xl border-2 border-[#2B3B4C] shadow-neo-card">
                  <div className="bg-(--color-secondary) p-3 rounded-2xl text-black"><Lightbulb size={36} strokeWidth={2.5} /></div>
                  <h1 className="text-2xl font-black text-white uppercase tracking-wider m-0">Novo Conhecimento</h1>
                </div>
                <h2 className="text-4xl font-black text-(--color-secondary) mb-8 tracking-tighter leading-tight drop-shadow-md">{block.title}</h2>
                <p className="text-2xl font-bold text-white/90 leading-relaxed mb-10">{block.content}</p>
              </>
            ) : (
              <>
                <h1 className="text-3xl font-black text-white mb-10 leading-tight tracking-tight drop-shadow-sm w-full">{block.title}</h1>
                {block.type === 'WHO_AM_I' && (
                  <div className="flex items-end gap-6 mb-12 w-full">
                    <div className="text-7xl drop-shadow-2xl">🏹</div>
                    <div className="flex-1 bg-(--color-card) border-2 border-(--color-border) p-6 rounded-[2rem] rounded-bl-sm text-xl font-bold text-white leading-relaxed shadow-neo-card relative">
                      {block.content}
                      <div className="absolute -left-4 bottom-2 w-0 h-0 border-t-[10px] border-t-transparent border-r-[15px] border-r-(--color-border) border-b-[10px] border-b-transparent"></div>
                    </div>
                  </div>
                )}
                {(block.type === 'DECISION_SCENARIO') && (
                  <div className="bg-(--color-accent)/20 border-2 border-(--color-accent) p-8 rounded-[2rem] text-xl font-bold text-white leading-relaxed mb-12 shadow-neo-accent w-full">
                    <p className="m-0 italic">"{block.content}"</p>
                  </div>
                )}
                {(block.type === 'WORKS_AND_RELICS' || block.type === 'TIMELINE') && (
                  <div className="bg-[#1A2633] border-2 border-[#2B3B4C] p-8 rounded-[2rem] text-xl font-bold text-white leading-relaxed mb-12 w-full">
                    <p className="m-0">{block.content}</p>
                  </div>
                )}
                {block.options && (
                  <div className="grid grid-cols-1 gap-4 w-full">
                    {block.options.map((opt, i) => {
                      let cls = 'bg-(--color-card) border-(--color-border) text-white shadow-neo-card hover:bg-white/5'
                      const isSelected = selectedOption === opt
                      if (isChecking && isSelected) {
                        cls = isCorrect ? 'bg-(--color-primary)/20 border-(--color-primary) text-(--color-primary) shadow-neo-primary' : 'bg-(--color-destructive)/20 border-(--color-destructive) text-(--color-destructive) shadow-neo-destructive'
                      } else if (isChecking && opt === block.correctAnswer) {
                        cls = 'border-(--color-primary) bg-(--color-background) shadow-neo-primary'
                      } else if (isSelected && !isChecking) {
                        cls = 'bg-(--color-accent)/20 border-(--color-accent) text-(--color-accent-foreground) shadow-neo-accent'
                      }
                      return (
                        <button key={i} disabled={isChecking}
                          className={`group relative p-5 rounded-2xl text-left text-lg md:text-xl font-black border-2 transition-all duration-150 active:translate-y-1 active:shadow-none outline-none ${cls}`}
                          onClick={() => handleSelect(opt)}>
                          <div className="flex items-center gap-4">
                            <span className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center text-sm font-black ${isSelected ? 'bg-current text-white' : 'text-gray-500 border-(--color-border) group-hover:border-gray-500'}`}>{i + 1}</span>
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
      <div className="absolute bottom-0 left-0 right-0 w-full z-50">
        <AnimatePresence>
          {(!isTheory && isChecking) && (
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className={`absolute bottom-0 left-0 right-0 p-8 pt-10 pb-36 rounded-t-[40px] shadow-[0_-20px_40px_rgba(0,0,0,0.5)] ${isCorrect ? 'bg-(--color-primary-dark)' : 'bg-(--color-destructive-dark)'}`}>
              <div className="max-w-[640px] mx-auto flex items-start gap-6 text-white">
                <div className="p-3 rounded-2xl shadow-neo-card bg-white/20 backdrop-blur-md">
                  {isCorrect ? <CheckCircle size={48} strokeWidth={3} className="text-white" /> : <XCircle size={48} strokeWidth={3} className="text-white" />}
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-black m-0 mb-3 uppercase tracking-tight drop-shadow-md">
                    {isCorrect ? 'Esplêndido!' : 'Fato Histórico:'}
                  </h2>
                  <p className="text-[17px] font-bold text-white/90 leading-snug drop-shadow-sm">{block.explanation}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className={`relative z-20 p-8 border-t-2 bg-(--color-background) transition-colors duration-300 ${!isTheory && isChecking ? (isCorrect ? 'bg-(--color-primary-dark) border-transparent' : 'bg-(--color-destructive-dark) border-transparent') : 'border-(--color-border)'}`}>
          <div className="max-w-[640px] mx-auto">
            <button
              className={`w-full py-5 text-xl tracking-widest ${isTheory ? 'btn-secondary' : (!selectedOption && !isChecking ? 'btn-disabled' : isChecking ? (isCorrect ? 'btn-primary border-white/20' : 'btn-danger border-white/20') : 'btn-secondary')}`}
              onClick={handleAction}
              disabled={!isTheory && !selectedOption && !isChecking}>
              <div className="flex items-center justify-center gap-3">
                <span>{isTheory ? 'ENTENDI' : (isChecking ? 'CONTINUAR' : 'VERIFICAR')}</span>
                {(isTheory || isChecking) && <ChevronRight size={24} strokeWidth={4} />}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
