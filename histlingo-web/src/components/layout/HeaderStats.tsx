import { Flame, Star } from "lucide-react"
import { useAuth } from "../../lib/AuthContext"
import { Link } from "wouter"

function getLeague(xp: number): { icon: string; label: string; color: string } {
  if (xp >= 10000) return { icon: '👑', label: 'Mestre', color: 'text-purple-400' }
  if (xp >= 5000) return { icon: '💎', label: 'Diamante', color: 'text-cyan-400' }
  if (xp >= 2000) return { icon: '🥇', label: 'Ouro', color: 'text-yellow-400' }
  if (xp >= 500) return { icon: '🥈', label: 'Prata', color: 'text-gray-300' }
  return { icon: '🥉', label: 'Bronze', color: 'text-amber-600' }
}

export function HeaderStats() {
  const { user } = useAuth()

  if (!user) return null

  const league = getLeague(user.xpTotal)

  return (
    <div className="flex items-center gap-2 sm:gap-4 select-none">
      {/* Streak */}
      <Link href="/profile" className="flex items-center gap-1.5 hover:bg-white/5 px-2 py-1.5 rounded-xl transition-colors group">
        <Flame size={22} fill="#FF8C00" color="#FF8C00" className="group-hover:scale-110 transition-transform shrink-0" />
        <span className="text-orange-400 font-black text-lg leading-none">{user.streakCount}</span>
      </Link>

      {/* XP */}
      <Link href="/profile" className="flex items-center gap-1.5 hover:bg-white/5 px-2 py-1.5 rounded-xl transition-colors group">
        <Star size={22} fill="#FFD700" color="#FFD700" className="group-hover:scale-110 transition-transform shrink-0" />
        <span className="text-yellow-400 font-black text-lg leading-none">{user.xpTotal.toLocaleString()}</span>
      </Link>

      {/* League */}
      <Link href="/leaderboard" className="flex items-center gap-1.5 hover:bg-white/5 px-2 py-1.5 rounded-xl transition-colors">
        <span className="text-xl leading-none">{league.icon}</span>
        <span className={`font-black text-sm leading-none hidden sm:block ${league.color}`}>{league.label}</span>
      </Link>

      {/* Avatar */}
      <Link href="/profile" className="text-2xl w-9 h-9 rounded-full bg-[#1A2633] border-2 border-(--color-border) flex items-center justify-center hover:border-(--color-primary) transition-colors shrink-0">
        {user.avatarEmoji}
      </Link>
    </div>
  )
}
