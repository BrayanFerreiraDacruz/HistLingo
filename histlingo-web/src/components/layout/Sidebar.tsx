import { Link, useRoute } from "wouter"
import { Map, Trophy, User, Book, LogOut } from "lucide-react"
import { useAuth } from "../../lib/AuthContext"
import { HeaderStats } from "./HeaderStats"

const NAV = [
  { href: "/", icon: Map, label: "Jornada" },
  { href: "/leaderboard", icon: Trophy, label: "Ligas" },
  { href: "/wiki", icon: Book, label: "Wiki" },
  { href: "/profile", icon: User, label: "Perfil" },
]

function NavItem({ href, icon: Icon, label }: { href: string; icon: any; label: string }) {
  const [isActive] = useRoute(href === "/" ? href : `${href}*`)
  return (
    <Link href={href} className={`
      flex items-center gap-3 w-full py-3 px-4 rounded-2xl font-black text-sm tracking-widest uppercase transition-all border-2
      ${isActive
        ? 'bg-(--color-primary)/15 text-(--color-primary) border-(--color-primary)/30'
        : 'text-gray-400 border-transparent hover:bg-white/5 hover:text-white'}
    `}>
      <Icon size={24} strokeWidth={2.5} className="shrink-0" />
      <span className="hidden lg:block">{label}</span>
    </Link>
  )
}

export function Sidebar() {
  const { user, logout } = useAuth()

  return (
    <nav className="
      fixed bottom-0 left-0 right-0 z-50
      bg-(--color-background) border-t-2 border-(--color-border)
      flex items-center justify-around px-2 py-2
      lg:sticky lg:top-0 lg:bottom-auto lg:left-auto lg:right-auto lg:z-auto
      lg:w-64 lg:h-screen lg:flex-col lg:justify-between lg:items-stretch
      lg:border-t-0 lg:border-r-2 lg:px-4 lg:py-6 lg:shrink-0
    ">
      {/* Logo (desktop only) */}
      <div className="hidden lg:flex items-center gap-3 px-4 mb-6 shrink-0">
        <div className="w-9 h-9 bg-(--color-primary) rounded-xl flex items-center justify-center text-lg shadow-neo-primary">🏹</div>
        <span className="text-(--color-primary) font-black text-2xl tracking-tight">HistLingo</span>
      </div>

      {/* Nav links */}
      <div className="flex items-center justify-around w-full lg:flex-col lg:gap-1 lg:flex-1">
        {NAV.map(item => <NavItem key={item.href} {...item} />)}
      </div>

      {/* Bottom: stats + logout (desktop) */}
      <div className="hidden lg:flex flex-col gap-3 shrink-0">
        {/* User info */}
        {user && (
          <div className="flex items-center gap-3 px-4 py-3 bg-(--color-card) rounded-2xl border-2 border-(--color-border)">
            <span className="text-2xl shrink-0">{user.avatarEmoji}</span>
            <div className="flex-1 min-w-0">
              <p className="font-black text-white text-sm truncate">{user.username}</p>
              <p className="text-gray-500 text-xs font-bold truncate">{user.xpTotal.toLocaleString()} XP</p>
            </div>
          </div>
        )}
        <button onClick={logout}
          className="flex items-center gap-3 w-full py-3 px-4 rounded-2xl font-black text-sm tracking-widest uppercase text-gray-500 border-2 border-transparent hover:bg-red-900/20 hover:text-red-400 hover:border-red-500/20 transition-all">
          <LogOut size={22} strokeWidth={2.5} className="shrink-0" />
          <span>Sair</span>
        </button>
      </div>

      {/* Mobile: stats chip */}
      <div className="lg:hidden flex items-center">
        <HeaderStats />
      </div>
    </nav>
  )
}
