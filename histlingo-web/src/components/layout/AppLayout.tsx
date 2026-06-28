import { HeaderStats } from "./HeaderStats"
import { Sidebar } from "./Sidebar"
import { RightPanel } from "./RightPanel"
import { ReactNode } from "react"

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col lg:flex-row lg:justify-center min-h-screen bg-(--color-background) max-w-[1400px] mx-auto lg:gap-8">
      
      {/* Navigation (Left Sidebar on Desktop) */}
      <Sidebar />

      {/* Main Center Area */}
      <main className="flex-1 w-full max-w-[640px] bg-(--color-background) flex flex-col relative pb-24 lg:pb-0 mx-auto">
        
        {/* Universal Top Header */}
        <header className="sticky top-0 z-40 bg-(--color-background)/90 backdrop-blur-md border-b-2 border-(--color-border) flex items-center justify-between px-6 py-4 lg:py-6 lg:border-b-0 lg:absolute lg:right-[-350px] lg:w-[320px] lg:bg-transparent lg:px-0">
          <div className="lg:hidden text-2xl font-black text-(--color-primary) tracking-tighter">
            HistLingo
          </div>
          <HeaderStats />
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto no-scrollbar pt-20 lg:pt-8 w-full">
          {children}
        </div>
      </main>

      {/* Right Sidebar (Desktop only) */}
      <div className="hidden lg:block w-[320px] sticky top-0 h-screen pt-24 pr-8">
        <RightPanel />
      </div>
    </div>
  )
}
