import { Link, useRoute } from "wouter"
import { Map, Trophy, User, Book, Settings } from "lucide-react"

const NavItem = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => {
  const [isActive] = useRoute(href)
  
  return (
    <Link href={href} className={`
      flex items-center gap-4 w-full p-4 rounded-2xl font-black text-sm tracking-widest uppercase transition-all duration-200 border-2
      ${isActive 
        ? 'bg-(--color-primary)/10 text-(--color-primary) border-(--color-primary)/20' 
        : 'text-gray-400 border-transparent hover:bg-white/5 hover:text-white'}
    `}>
      <Icon size={26} strokeWidth={2.5} />
      <span className="hidden lg:block">{label}</span>
    </Link>
  )
}

export function Sidebar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-(--color-background) border-t-2 border-(--color-border) flex justify-around p-3 lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:flex-col lg:justify-start lg:items-start lg:border-t-0 lg:border-r-2 lg:px-6 lg:py-8">
      
      <div className="hidden lg:flex items-center gap-3 mb-10 px-4">
        <div className="w-10 h-10 bg-(--color-primary) rounded-xl flex items-center justify-center text-white text-xl">🏹</div>
        <span className="text-(--color-primary) font-black text-3xl tracking-tight">HistLingo</span>
      </div>
      
      <div className="flex w-full justify-around lg:flex-col lg:gap-3">
        <NavItem href="/" icon={Map} label="Jornada" />
        <NavItem href="/leaderboard" icon={Trophy} label="Ligas" />
        <NavItem href="/wiki" icon={Book} label="Wiki" />
        <NavItem href="/profile" icon={User} label="Perfil" />
        
        <div className="hidden lg:flex items-center gap-4 w-full p-4 rounded-2xl font-black text-sm tracking-widest uppercase text-gray-400 hover:bg-white/5 hover:text-white cursor-pointer transition-all mt-auto border-2 border-transparent">
          <Settings size={26} strokeWidth={2.5} />
          <span>Configurações</span>
        </div>
      </div>
    </nav>
  )
}
