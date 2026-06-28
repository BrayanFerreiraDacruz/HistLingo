import { useState } from "react"
import { useLocation } from "wouter"
import { X, Heart, CheckCircle, XCircle, ChevronRight, Info, Lightbulb } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"

type BlockType = 'THEORY' | 'WHO_AM_I' | 'DECISION_SCENARIO'

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

const MOCK_LESSON_BLOCKS: LessonBlock[] = [
  {
    id: "t1",
    type: "THEORY",
    title: "Os Primeiros Habitantes",
    content: "Muito antes de 1500, o Brasil não era um vazio demográfico. Estima-se que mais de 3 milhões de indígenas viviam no território, divididos em centenas de povos e culturas complexas.",
    highlight: "A maior diversidade se organizava em grandes troncos linguísticos, sendo os principais o Macro-Jê (mais ao interior) e o Tupi (litoral)."
  },
  {
    id: "q1",
    type: "WHO_AM_I",
    title: "Pratique: Identificação",
    content: "Sou um dos maiores troncos linguísticos da América do Sul. Meus povos habitavam grande parte da vasta costa brasileira antes da chegada europeia.",
    options: ["Macro-Jê", "Tupi", "Aruaque", "Karib"],
    correctAnswer: "Tupi",
    explanation: "Como você acabou de ler, o tronco Tupi era predominante no litoral brasileiro, sendo os primeiros a terem contato com os portugueses."
  },
  {
    id: "t2",
    type: "THEORY",
    title: "O Primeiro Contato: Escambo",
    content: "O encontro inicial entre europeus e indígenas teve foco comercial. Os portugueses queriam a cobiçada madeira avermelhada (Pau-Brasil) para tingir tecidos na Europa, e não tinham mão de obra para extraí-la.",
    highlight: "A solução foi o 'Escambo': os indígenas cortavam e transportavam a madeira em troca de artefatos de metal (facões, machados, espelhos)."
  },
  {
    id: "q2",
    type: "DECISION_SCENARIO",
    title: "Cenário de Decisão",
    content: "Você é um líder de uma aldeia litorânea em 1501. Estranhos em caravelas oferecem objetos brilhantes e lâminas afiadas em troca de toras de madeira. O que você decide?",
    options: [
      "Ataca imediatamente a frota invasora.",
      "Aceita a troca (Escambo) pelas ferramentas de metal.",
      "Abandona a aldeia e foge para o interior.",
      "Exige moedas de ouro e prata pela madeira."
    ],
    correctAnswer: "Aceita a troca (Escambo) pelas ferramentas de metal.",
    explanation: "Historicamente, o Escambo foi adotado pacificamente no início. Ferramentas de metal representavam um avanço tecnológico gigantesco para derrubar árvores e trabalhar a terra."
  }
]

export function Quiz() {
  const [, setLocation] = useLocation()
  
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  
  // States for Quiz Checking
  const [isChecking, setIsChecking] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [, setShowExplanation] = useState(false)
  const [hearts, setHearts] = useState(5)

  const block = MOCK_LESSON_BLOCKS[currentIndex]
  const progress = ((currentIndex + 1) / MOCK_LESSON_BLOCKS.length) * 100
  const isTheory = block.type === 'THEORY'

  const handleSelect = (option: string) => {
    if (isChecking) return
    setSelectedOption(option)
  }

  const advanceSequence = () => {
    if (currentIndex < MOCK_LESSON_BLOCKS.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      setSelectedOption(null)
      setIsChecking(false)
      setIsCorrect(null)
      setShowExplanation(false)
    } else {
      // Finish Lesson completely
      confetti({
        particleCount: 200,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#00A651', '#FFD700', '#003566', '#FFFFFF']
      })
      setTimeout(() => setLocation('/'), 2000)
    }
  }

  const handleAction = () => {
    if (isTheory) {
      advanceSequence()
      return
    }

    // It's a quiz question
    if (!selectedOption) return

    if (!isChecking) {
      const correct = selectedOption === block.correctAnswer
      setIsCorrect(correct)
      setIsChecking(true)
      
      if (!correct) {
        setHearts((prev) => Math.max(0, prev - 1))
      }
    } else {
      // Already checked, clicking continue
      advanceSequence()
    }
  }

  if (hearts <= 0) {
    return (
      <div className="fixed inset-0 bg-(--color-background) z-[100] flex flex-col items-center justify-center p-8 text-center">
        <div className="text-8xl mb-8 drop-shadow-lg">💔</div>
        <h1 className="text-4xl font-black text-white mb-4 tracking-tight">Vidas esgotadas!</h1>
        <p className="text-lg font-bold text-gray-400 mb-12">Você não pode aprender sem energia. Descanse um pouco ou recupere vidas praticando conteúdos antigos.</p>
        <button className="btn-primary w-full max-w-sm" onClick={() => setLocation('/')}>VOLTAR AO MAPA</button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen max-w-[900px] mx-auto bg-(--color-background) relative overflow-hidden select-none">
      
      {/* Quiz Header */}
      <div className="flex items-center p-6 md:p-10 gap-6">
        <button onClick={() => setLocation('/')} className="p-2 rounded-full hover:bg-white/5 transition-colors cursor-pointer">
          <X size={36} className="text-gray-500" strokeWidth={3} />
        </button>
        
        <div className="flex-1 h-5 bg-[#1A2633] rounded-full overflow-hidden relative border-2 border-[#2B3B4C] shadow-inner">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-(--color-primary) rounded-full relative" 
          >
            <div className="absolute top-1 left-2 right-2 h-1.5 bg-white/30 rounded-full"></div>
          </motion.div>
        </div>

        <div className="flex items-center gap-2.5">
          <Heart size={36} fill="#FF4B4B" color="#FF4B4B" className={hearts === 1 ? 'animate-pulse' : ''} />
          <span className="text-(--color-destructive) font-black text-2xl">{hearts}</span>
        </div>
      </div>

      {/* Challenge Engine / Theory Viewer */}
      <div className="flex-1 px-6 md:px-20 py-4 overflow-y-auto pb-64 flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.div 
            key={block.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-[640px] flex flex-col items-start"
          >
            
            {/* Header Content */}
            {isTheory ? (
              <div className="flex items-center gap-4 mb-10 w-full bg-[#1A2633] p-5 rounded-3xl border-2 border-[#2B3B4C] shadow-neo-card">
                <div className="bg-(--color-secondary) p-3 rounded-2xl text-black">
                  <Lightbulb size={36} strokeWidth={2.5} />
                </div>
                <h1 className="text-2xl font-black text-white uppercase tracking-wider m-0">Novo Conhecimento</h1>
              </div>
            ) : (
              <h1 className="text-3xl font-black text-white mb-10 leading-tight tracking-tight drop-shadow-sm w-full">
                {block.title}
              </h1>
            )}

            {/* Main Content Area */}
            {isTheory && (
              <div className="flex flex-col w-full">
                <h2 className="text-4xl font-black text-(--color-secondary) mb-8 tracking-tighter leading-tight drop-shadow-md">
                  {block.title}
                </h2>
                <p className="text-2xl font-bold text-white/90 leading-relaxed mb-10">
                  {block.content}
                </p>
                {block.highlight && (
                  <div className="bg-(--color-primary)/10 border-l-4 border-(--color-primary) p-6 rounded-r-3xl">
                    <p className="text-xl font-bold text-(--color-primary-foreground) leading-relaxed m-0 italic">
                      "{block.highlight}"
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {block.type === 'WHO_AM_I' && (
              <div className="flex items-end gap-6 mb-12 w-full">
                <div className="text-7xl drop-shadow-2xl">🏹</div>
                <div className="flex-1 bg-(--color-card) border-2 border-(--color-border) p-6 rounded-[2rem] rounded-bl-sm text-xl font-bold text-white leading-relaxed shadow-neo-card relative">
                  {block.content}
                  <div className="absolute -left-4 bottom-2 w-0 h-0 border-t-[10px] border-t-transparent border-r-[15px] border-r-(--color-border) border-b-[10px] border-b-transparent"></div>
                </div>
              </div>
            )}

            {block.type === 'DECISION_SCENARIO' && (
              <div className="bg-(--color-accent)/20 border-2 border-(--color-accent) p-8 rounded-[2rem] text-xl font-bold text-white leading-relaxed mb-12 shadow-neo-accent w-full">
                <p className="m-0 italic">"{block.content}"</p>
              </div>
            )}

            {/* Options Area (Only for non-theory) */}
            {!isTheory && block.options && (
              <div className="grid grid-cols-1 gap-4 w-full">
                {block.options.map((opt, i) => {
                  const isSelected = selectedOption === opt
                  let statusClasses = 'bg-(--color-card) border-(--color-border) text-white shadow-neo-card hover:bg-white/5'
                  
                  if (isChecking && isSelected) {
                    statusClasses = isCorrect 
                      ? 'bg-(--color-primary)/20 border-(--color-primary) text-(--color-primary) shadow-neo-primary' 
                      : 'bg-(--color-destructive)/20 border-(--color-destructive) text-(--color-destructive) shadow-neo-destructive'
                  } else if (isChecking && opt === block.correctAnswer) {
                    statusClasses = 'border-(--color-primary) bg-(--color-background) shadow-neo-primary'
                  } else if (isSelected && !isChecking) {
                    statusClasses = 'bg-(--color-accent)/20 border-(--color-accent) text-(--color-accent-foreground) shadow-neo-accent'
                  }

                  return (
                    <button
                      key={i}
                      className={`group relative p-5 rounded-2xl text-left text-lg md:text-xl font-black border-2 transition-all duration-150 active:translate-y-1 active:shadow-none outline-none ${statusClasses}`}
                      onClick={() => handleSelect(opt)}
                      disabled={isChecking}
                    >
                      <div className="flex items-center gap-4">
                        <span className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center text-sm font-black ${isSelected ? 'bg-current text-white' : 'text-gray-500 border-(--color-border) group-hover:border-gray-500'}`}>
                          {i + 1}
                        </span>
                        <span className="flex-1">{opt}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Action Footer & Feedback */}
      <div className="absolute bottom-0 left-0 right-0 w-full z-50">
        
        {/* Verification Slide-up Banner */}
        <AnimatePresence>
          {(!isTheory && isChecking) && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className={`absolute bottom-0 left-0 right-0 p-8 pt-10 pb-36 rounded-t-[40px] shadow-[0_-20px_40px_rgba(0,0,0,0.5)] ${isCorrect ? 'bg-(--color-primary-dark)' : 'bg-(--color-destructive-dark)'}`}
            >
              <div className="max-w-[640px] mx-auto flex items-start gap-6 text-white">
                <div className={`p-3 rounded-2xl shadow-neo-card bg-white/20 backdrop-blur-md`}>
                  {isCorrect ? <CheckCircle size={48} strokeWidth={3} className="text-white" /> : <XCircle size={48} strokeWidth={3} className="text-white" />}
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-black m-0 mb-3 uppercase tracking-tight drop-shadow-md">
                    {isCorrect ? 'Explêndido!' : 'Fato Histórico:'}
                  </h2>
                  <p className="text-[17px] font-bold text-white/90 leading-snug drop-shadow-sm">
                    {block.explanation}
                  </p>
                </div>
                {!isCorrect && (
                  <button onClick={() => setShowExplanation(true)} className="p-2 hover:bg-black/20 rounded-full transition-colors">
                    <Info size={28} className="text-white" />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Base */}
        <div className={`relative z-20 p-8 border-t-2 bg-(--color-background) transition-colors duration-300 ${!isTheory && isChecking ? (isCorrect ? 'bg-(--color-primary-dark) border-transparent' : 'bg-(--color-destructive-dark) border-transparent') : 'border-(--color-border)'}`}>
          <div className="max-w-[640px] mx-auto">
            <button 
              className={`w-full ${isTheory ? 'btn-secondary' : (!selectedOption && !isChecking ? 'btn-disabled' : isChecking ? (isCorrect ? 'btn-primary border-white/20' : 'btn-danger border-white/20') : 'btn-secondary')} py-5 text-xl tracking-widest`}
              onClick={handleAction}
              disabled={!isTheory && !selectedOption && !isChecking}
            >
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
