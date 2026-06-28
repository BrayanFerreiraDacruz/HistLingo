import { Switch, Route } from "wouter"
import { AuthProvider, useAuth } from "./lib/AuthContext"
import { AppLayout } from "./components/layout/AppLayout"
import { Home } from "./pages/Home"
import { Quiz } from "./pages/Quiz"
import { Auth } from "./pages/Auth"
import { Leaderboard } from "./pages/Leaderboard"
import { Profile } from "./pages/Profile"

function AppRoutes() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#0A1118] flex items-center justify-center">
        <div className="text-6xl animate-bounce">🏹</div>
      </div>
    )
  }

  // Reset password page doesn't require login
  const isResetRoute = window.location.pathname === '/reset-password' || window.location.search.includes('token=')

  if (!user && !isResetRoute) {
    return <Auth />
  }

  if (!user && isResetRoute) {
    return <Auth />
  }

  return (
    <Switch>
      <Route path="/quiz/:lessonId" component={Quiz} />
      <Route path="/quiz" component={Quiz} />

      <Route path="*">
        <AppLayout>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/leaderboard" component={Leaderboard} />
            <Route path="/profile" component={Profile} />
            <Route path="/wiki">
              <div className="text-center text-white p-10 font-bold text-2xl">Wiki em construção...</div>
            </Route>
          </Switch>
        </AppLayout>
      </Route>
    </Switch>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
