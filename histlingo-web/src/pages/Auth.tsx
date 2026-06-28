import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, AlertCircle } from "lucide-react"
import { useAuth } from "../lib/AuthContext"

export function Auth() {
  const { login, register } = useAuth()
  const [isLogin, setIsLogin] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const form = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
    const password = (form.elements.namedItem('password') as HTMLInputElement).value

    try {
      if (isLogin) {
        await login(email, password)
      } else {
        const username = (form.elements.namedItem('username') as HTMLInputElement).value
        await register(username, email, password)
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A1118] overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]">
      <AnimatePresence mode="wait">
        {!showForm ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -40, filter: "blur(10px)" }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center text-center p-6 w-full max-w-md relative z-10"
          >
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="text-[9rem] mb-6 leading-none select-none drop-shadow-2xl"
            >
              🏹
            </motion.div>
            <h1 className="text-4xl font-black text-white mb-10 leading-tight drop-shadow-md">
              A história do Brasil.<br />
              <span className="text-(--color-primary)">Como um jogo.</span>
            </h1>

            <div className="flex flex-col gap-5 w-full px-2">
              <button className="btn-primary w-full" onClick={() => { setIsLogin(false); setShowForm(true) }}>COMEÇAR JORNADA</button>
              <button className="btn-outline w-full" onClick={() => { setIsLogin(true); setShowForm(true) }}>JÁ TENHO UMA CONTA</button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute inset-0 bg-(--color-background) z-50 flex flex-col items-center pt-24 px-6 sm:relative sm:inset-auto sm:max-w-md sm:h-auto sm:border-2 sm:border-(--color-border) sm:rounded-[2rem] sm:shadow-[0_10px_40px_rgba(0,0,0,0.5)] sm:p-10 sm:bg-(--color-card)"
          >
            <button
              className="absolute top-6 left-6 p-3 rounded-full hover:bg-white/5 transition-colors"
              onClick={() => { setShowForm(false); setError(null) }}
            >
              <X size={28} className="text-gray-400" strokeWidth={3} />
            </button>

            <h2 className="text-3xl font-black text-white mb-8 w-full text-center tracking-tight">
              {isLogin ? 'Bem-vindo de volta' : 'Crie seu perfil'}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
              {!isLogin && (
                <input
                  name="username"
                  type="text"
                  placeholder="Nome de explorador"
                  required
                  minLength={3}
                  maxLength={30}
                  className="w-full bg-[#1A2633] border-2 border-[#2B3B4C] px-5 py-4 rounded-2xl text-lg font-bold text-white outline-none focus:border-(--color-primary) transition-colors placeholder:text-gray-500 shadow-inner"
                />
              )}
              <input
                name="email"
                type="email"
                placeholder="Email"
                required
                className="w-full bg-[#1A2633] border-2 border-[#2B3B4C] px-5 py-4 rounded-2xl text-lg font-bold text-white outline-none focus:border-(--color-primary) transition-colors placeholder:text-gray-500 shadow-inner"
              />
              <input
                name="password"
                type="password"
                placeholder="Senha"
                required
                minLength={6}
                className="w-full bg-[#1A2633] border-2 border-[#2B3B4C] px-5 py-4 rounded-2xl text-lg font-bold text-white outline-none focus:border-(--color-primary) transition-colors placeholder:text-gray-500 shadow-inner"
              />

              {error && (
                <div className="flex items-center gap-3 bg-red-900/30 border-2 border-red-500/50 rounded-2xl px-4 py-3">
                  <AlertCircle size={20} className="text-red-400 shrink-0" />
                  <p className="text-red-300 font-bold text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-secondary w-full mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'AGUARDE...' : (isLogin ? 'ENTRAR' : 'CRIAR CONTA')}
              </button>
            </form>

            <div className="mt-8 text-center text-gray-500 font-bold">
              <p className="flex flex-col items-center justify-center gap-2">
                {isLogin ? 'Ainda não tem conta?' : 'Já tem uma conta?'}
                <button
                  type="button"
                  className="text-(--color-secondary) uppercase font-black tracking-widest hover:brightness-110"
                  onClick={() => { setIsLogin(!isLogin); setError(null) }}
                >
                  {isLogin ? 'CRIAR PERFIL' : 'ENTRAR'}
                </button>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
