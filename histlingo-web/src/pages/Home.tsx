import { Check, Star, Lock } from "lucide-react"
import { motion } from "framer-motion"
import { Link } from "wouter"

function PathNode({ status, position, label, href = "#" }: { status: "completed" | "active" | "locked", position: number, label?: string, href?: string }) {
  // Sinuous layout positions (0 = center, -1 = left, 1 = right)
  const posMap: Record<number, string> = {
    0: "right-0",
    [-1]: "right-8",
    [-2]: "right-12",
    1: "-right-8",
    2: "-right-12",
  }

  const isCompleted = status === "completed"
  const isActive = status === "active"
  
  const content = (
    <div className={`relative flex flex-col items-center justify-center my-6 w-full ${posMap[position]}`}>
      
      {/* Tooltip for Active Node */}
      {isActive && (
        <motion.div 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
          className="absolute -top-14 bg-white text-(--color-primary-dark) border-2 border-(--color-border) px-5 py-2 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg z-30"
        >
          Começar!
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b-2 border-r-2 border-(--color-border) rotate-45"></div>
        </motion.div>
      )}

      {/* Progress Ring and Node */}
      <div className="relative z-20">
        {/* Mocking the circular progress */}
        <div className={`absolute -inset-3 rounded-full border-4 ${isCompleted ? 'border-(--color-secondary)' : isActive ? 'border-t-(--color-secondary) border-r-(--color-secondary) border-b-(--color-secondary) border-l-[#2B3B4C] rotate-45' : 'border-transparent'}`}></div>

        <button className={`
          node-btn relative
          ${isCompleted ? 'bg-(--color-secondary) text-(--color-secondary-dark) border-white shadow-neo-secondary hover:brightness-110' : ''}
          ${isActive ? 'bg-(--color-primary) text-white border-white shadow-neo-primary -rotate-45 hover:brightness-110 scale-110' : ''}
          ${status === 'locked' ? 'bg-(--color-input) text-gray-500 border-gray-600 shadow-neo-card cursor-not-allowed' : ''}
        `}>
          {isCompleted && <Check size={36} strokeWidth={3.5} />}
          {isActive && <Star size={36} fill="white" strokeWidth={0} />}
          {status === 'locked' && <Lock size={32} strokeWidth={3} />}
        </button>
      </div>

      {/* Node Label */}
      {label && (
        <div className="absolute -left-32 top-1/2 -translate-y-1/2 text-right w-24">
          <span className="text-gray-400 font-bold text-sm tracking-wide bg-(--color-background) px-2 py-1 rounded-lg border border-(--color-border)">
            {label}
          </span>
        </div>
      )}
    </div>
  )

  if (isActive) {
    return <Link href={href} className="w-full flex justify-center outline-none">{content}</Link>
  }
  return <div className="w-full flex justify-center outline-none">{content}</div>
}

export function Home() {
  return (
    <div className="flex flex-col gap-16 pb-24 w-full max-w-[500px] mx-auto relative pt-4">
      
      {/* Background Central Line */}
      <div className="absolute left-1/2 top-10 bottom-0 w-3 bg-[#1A2633] -translate-x-1/2 rounded-full -z-10"></div>
      
      {/* Active Line (Gold) */}
      <div className="absolute left-1/2 top-10 h-[380px] w-3 bg-(--color-secondary) -translate-x-1/2 rounded-t-full -z-10 shadow-[0_0_15px_rgba(255,215,0,0.4)]"></div>

      {/* ERA 1 */}
      <section className="relative w-full z-10">
        <div className="bg-(--color-primary) text-white p-7 rounded-[2rem] mb-10 shadow-neo-primary flex items-center justify-between overflow-hidden relative border-2 border-[#007F5F]">
          <div className="z-10">
            <h2 className="m-0 text-3xl font-black mb-1 tracking-tight drop-shadow-md">Unidade 1</h2>
            <p className="m-0 text-lg font-bold opacity-90 drop-shadow-sm">Raízes Profundas</p>
            <p className="m-0 mt-3 text-sm font-bold bg-black/20 self-start inline-block px-3 py-1 rounded-xl">Povos Originários</p>
          </div>
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-5xl z-10 border-4 border-white/30 backdrop-blur-sm" title="Indígena">
            🏹
          </div>
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full z-0 blur-xl"></div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <PathNode status="completed" position={0} label="Lição 1" />
          <PathNode status="completed" position={-1} label="Lição 2" />
          <PathNode status="completed" position={-2} label="História" />
          <PathNode status="active" position={-1} label="Lição 4" href="/quiz" />
          <PathNode status="locked" position={0} label="Chefe" />
        </div>
      </section>

      {/* ERA 2 */}
      <section className="relative w-full z-10">
        <div className="bg-(--color-accent) text-white p-7 rounded-[2rem] mb-10 shadow-neo-accent flex items-center justify-between overflow-hidden relative border-2 border-(--color-accent-dark)">
          <div className="z-10">
            <h2 className="m-0 text-3xl font-black mb-1 tracking-tight drop-shadow-md">Unidade 2</h2>
            <p className="m-0 text-lg font-bold opacity-90 drop-shadow-sm">O Encontro e o Choque</p>
            <p className="m-0 mt-3 text-sm font-bold bg-white/10 text-white/80 self-start inline-block px-3 py-1 rounded-xl">Período Colonial</p>
          </div>
          <div className="w-24 h-24 bg-black/20 rounded-full flex items-center justify-center text-5xl z-10 border-4 border-black/10 backdrop-blur-sm" title="Caravela">
            ⛵
          </div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <PathNode status="locked" position={0} />
          <PathNode status="locked" position={1} />
          <PathNode status="locked" position={2} />
          <PathNode status="locked" position={1} />
          <PathNode status="locked" position={0} />
        </div>
      </section>
    </div>
  )
}
