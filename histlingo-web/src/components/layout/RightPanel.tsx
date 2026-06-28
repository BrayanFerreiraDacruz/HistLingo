import { Link } from "wouter"
import { Shield, Target, BookOpen, Award } from "lucide-react"

export function RightPanel() {
  return (
    <aside className="w-full flex flex-col gap-6 select-none pl-6 border-l-2 border-(--color-border) h-full sticky top-0 pt-8 pb-10 overflow-y-auto no-scrollbar">
      
      {/* Ligas Preview */}
      <div className="border-2 border-(--color-border) rounded-3xl p-6 bg-(--color-card) hover:border-gray-600 transition-colors cursor-pointer group shadow-neo-card">
        <div className="flex justify-between items-center mb-5">
          <h3 className="m-0 text-xl font-black text-white">Liga Inconfidência</h3>
          <Link href="/leaderboard" className="text-(--color-primary) font-black uppercase text-xs tracking-widest hover:brightness-110">VER TUDO</Link>
        </div>
        <div className="flex items-center gap-5">
          <div className="relative">
            <Shield size={64} fill="#FFD700" color="#D4B200" strokeWidth={1} className="drop-shadow-lg" />
            <Award size={24} className="absolute bottom-0 right-0 text-white fill-yellow-600 drop-shadow-md" />
          </div>
          <div className="flex-1">
            <p className="m-0 font-bold text-gray-400 text-sm leading-tight">Você está no <span className="text-(--color-primary) font-black">Top 3</span>. Continue assim para subir de liga!</p>
          </div>
        </div>
      </div>

      {/* Daily Quests */}
      <div className="border-2 border-(--color-border) rounded-3xl p-6 bg-(--color-card) shadow-neo-card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="m-0 text-xl font-black text-white">Missões Diárias</h3>
          <Link href="/quests" className="text-(--color-primary) font-black uppercase text-xs tracking-widest hover:brightness-110">VER TUDO</Link>
        </div>
        
        <div className="flex flex-col gap-6">
          <div className="flex gap-5 items-center">
            <div className="w-12 h-12 bg-yellow-500/10 border-2 border-yellow-500/20 rounded-2xl flex items-center justify-center shadow-inner">
              <Target size={28} className="text-(--color-secondary)" strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <p className="m-0 font-black text-white text-base mb-2">Conquiste 50 XP</p>
              <div className="h-3 bg-[#1A2633] rounded-full overflow-hidden border border-[#2B3B4C]">
                <div className="h-full bg-(--color-secondary) w-[60%] rounded-full shadow-inner"></div>
              </div>
              <p className="m-0 mt-2 text-xs font-bold text-gray-500 tracking-wide">30 / 50 XP</p>
            </div>
          </div>

          <div className="flex gap-5 items-center">
            <div className="w-12 h-12 bg-blue-500/10 border-2 border-blue-500/20 rounded-2xl flex items-center justify-center shadow-inner">
              <BookOpen size={28} className="text-blue-400" strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <p className="m-0 font-black text-white text-base mb-2">Leia 1 Verbete Wiki</p>
              <div className="h-3 bg-[#1A2633] rounded-full overflow-hidden border border-[#2B3B4C]">
                <div className="h-full bg-blue-500 w-[0%] rounded-full shadow-inner"></div>
              </div>
              <p className="m-0 mt-2 text-xs font-bold text-gray-500 tracking-wide">0 / 1</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-gray-500 font-bold uppercase tracking-widest pb-8">
        <a href="#" className="hover:text-white transition-colors">Sobre</a>
        <a href="#" className="hover:text-white transition-colors">Termos</a>
        <a href="#" className="hover:text-white transition-colors">Privacidade</a>
        <p className="w-full m-0 mt-2">© 2026 HistLingo. IFRS Farroupilha.</p>
      </div>
    </aside>
  )
}
