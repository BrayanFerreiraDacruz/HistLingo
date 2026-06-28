import { HeaderStats } from "./HeaderStats"
import { Sidebar } from "./Sidebar"
import { RightPanel } from "./RightPanel"
import { ReactNode } from "react"

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-(--color-background)">
      {/* Left sidebar — desktop */}
      <Sidebar />

      {/* Center content */}
      <main className="flex-1 flex flex-col min-h-screen lg:max-w-[680px] xl:max-w-[720px] w-full mx-auto">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-40 lg:hidden bg-(--color-background)/95 backdrop-blur-md border-b-2 border-(--color-border) flex items-center justify-between px-4 h-14 shrink-0">
          <span className="text-xl font-black text-(--color-primary) tracking-tighter select-none">HistLingo</span>
          <HeaderStats />
        </header>

        {/* Page content */}
        <div className="flex-1 px-4 pt-5 pb-24 lg:pb-8 lg:px-8 overflow-y-auto no-scrollbar">
          {children}
        </div>
      </main>

      {/* Right panel — desktop only */}
      <aside className="hidden xl:flex w-[320px] shrink-0 sticky top-0 h-screen overflow-y-auto no-scrollbar border-l-2 border-(--color-border)">
        <RightPanel />
      </aside>
    </div>
  )
}
