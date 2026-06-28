import { Flame, Heart } from "lucide-react"

export function HeaderStats() {
  return (
    <div className="flex items-center gap-4 lg:gap-8 bg-(--color-background)/90 backdrop-blur-md py-3 px-4 lg:px-0 select-none border-b-2 lg:border-b-0 border-(--color-border)">
      
      <div className="flex items-center gap-2 group cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-colors">
        <Flame size={24} fill="#FFD700" color="#FFD700" className="group-hover:scale-110 transition-transform" />
        <span className="text-(--color-secondary) font-black text-xl tracking-tight">12</span>
      </div>

      <div className="flex items-center gap-2 group cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-colors">
        <div className="w-6 h-6 bg-(--color-primary) rounded-full border-2 border-(--color-primary-dark) flex items-center justify-center text-white text-[11px] font-black group-hover:rotate-12 transition-transform shadow-inner">
          $
        </div>
        <span className="text-(--color-primary) font-black text-xl tracking-tight">450</span>
      </div>

      <div className="flex items-center gap-2 group cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-colors">
        <Heart size={24} fill="#FF4B4B" color="#FF4B4B" className="group-hover:scale-110 transition-transform" />
        <span className="text-(--color-destructive) font-black text-xl tracking-tight">5</span>
      </div>

    </div>
  )
}
