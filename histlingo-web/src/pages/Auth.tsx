import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, AlertCircle, CheckCircle } from "lucide-react"
import { useAuth } from "../lib/AuthContext"
import { auth } from "../lib/api"
import { useSearch } from "wouter"

type Screen = 'landing' | 'form' | 'forgot' | 'reset'

export function Auth() {
  const { login, register } = useAuth()
  const search = useSearch()
  const resetToken = new URLSearchParams(search).get('token')

  const [screen, setScreen] = useState<Screen>(resetToken ? 'reset' : 'landing')
  const [isLogin, setIsLogin] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleAuthSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

  const handleForgot = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const form = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
    try {
      const res = await auth.forgotPassword(email)
      setSuccess(res.message)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const form = e.currentTarget
    const password = (form.elements.namedItem('password') as HTMLInputElement).value
    const confirm = (form.elements.namedItem('confirm') as HTMLInputElement).value
    if (password !== confirm) {
      setError('As senhas não coincidem.')
      setLoading(false)
      return
    }
    try {
      const res = await auth.resetPassword(resetToken!, password)
      setSuccess(res.message)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao redefinir.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full bg-[#1A2633] border-2 border-[#2B3B4C] px-5 py-4 rounded-2xl text-lg font-bold text-white outline-none focus:border-(--color-primary) transition-colors placeholder:text-gray-500 shadow-inner"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A1118] overflow-hidden">
      <AnimatePresence mode="wait">

        {/* Landing Screen */}
        {screen === 'landing' && (
          <motion.div key="landing" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -40 }} transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center text-center p-6 w-full max-w-md relative z-10">
            <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="text-[9rem] mb-6 leading-none select-none drop-shadow-2xl">🏹</motion.div>
            <h1 className="text-4xl font-black text-white mb-10 leading-tight drop-shadow-md">
              A história do Brasil.<br /><span className="text-(--color-primary)">Como um jogo.</span>
            </h1>
            <div className="flex flex-col gap-5 w-full px-2">
              <button className="btn-primary w-full" onClick={() => { setIsLogin(false); setScreen('form') }}>COMEÇAR JORNADA</button>
              <button className="btn-outline w-full" onClick={() => { setIsLogin(true); setScreen('form') }}>JÁ TENHO UMA CONTA</button>
            </div>
          </motion.div>
        )}

        {/* Auth Form */}
        {screen === 'form' && (
          <motion.div key="form" initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute inset-0 bg-(--color-background) z-50 flex flex-col items-center pt-24 px-6 sm:relative sm:inset-auto sm:max-w-md sm:h-auto sm:border-2 sm:border-(--color-border) sm:rounded-[2rem] sm:shadow-[0_10px_40px_rgba(0,0,0,0.5)] sm:p-10 sm:bg-(--color-card)">
            <button className="absolute top-6 left-6 p-3 rounded-full hover:bg-white/5" onClick={() => { setScreen('landing'); setError(null) }}>
              <X size={28} className="text-gray-400" strokeWidth={3} />
            </button>
            <h2 className="text-3xl font-black text-white mb-8 w-full text-center tracking-tight">
              {isLogin ? 'Bem-vindo de volta' : 'Crie seu perfil'}
            </h2>
            <form onSubmit={handleAuthSubmit} className="flex flex-col gap-5 w-full">
              {!isLogin && <input name="username" type="text" placeholder="Nome de explorador" required minLength={3} maxLength={30} className={inputClass} />}
              <input name="email" type="email" placeholder="Email" required className={inputClass} />
              <input name="password" type="password" placeholder="Senha" required minLength={6} className={inputClass} />
              {error && <div className="flex items-center gap-3 bg-red-900/30 border-2 border-red-500/50 rounded-2xl px-4 py-3">
                <AlertCircle size={20} className="text-red-400 shrink-0" />
                <p className="text-red-300 font-bold text-sm">{error}</p>
              </div>}
              <button type="submit" disabled={loading} className="btn-secondary w-full mt-4 disabled:opacity-50">
                {loading ? 'AGUARDE...' : (isLogin ? 'ENTRAR' : 'CRIAR CONTA')}
              </button>
            </form>
            <div className="mt-6 text-center text-gray-500 font-bold flex flex-col gap-3">
              <p className="flex flex-col items-center gap-1">
                {isLogin ? 'Ainda não tem conta?' : 'Já tem uma conta?'}
                <button type="button" className="text-(--color-secondary) uppercase font-black tracking-widest hover:brightness-110"
                  onClick={() => { setIsLogin(!isLogin); setError(null) }}>
                  {isLogin ? 'CRIAR PERFIL' : 'ENTRAR'}
                </button>
              </p>
              {isLogin && (
                <button type="button" className="text-(--color-primary) text-sm font-bold hover:underline"
                  onClick={() => { setScreen('forgot'); setError(null) }}>
                  Esqueci minha senha
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* Forgot Password */}
        {screen === 'forgot' && (
          <motion.div key="forgot" initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", damping: 25 }}
            className="absolute inset-0 bg-(--color-background) z-50 flex flex-col items-center pt-24 px-6 sm:relative sm:inset-auto sm:max-w-md sm:border-2 sm:border-(--color-border) sm:rounded-[2rem] sm:p-10 sm:bg-(--color-card)">
            <button className="absolute top-6 left-6 p-3 rounded-full hover:bg-white/5" onClick={() => { setScreen('form'); setError(null); setSuccess(null) }}>
              <X size={28} className="text-gray-400" strokeWidth={3} />
            </button>
            <div className="text-5xl mb-6">🔑</div>
            <h2 className="text-3xl font-black text-white mb-2 text-center">Recuperar senha</h2>
            <p className="text-gray-400 font-bold text-sm text-center mb-8">Digite seu email e enviaremos as instruções.</p>
            {success ? (
              <div className="flex flex-col items-center gap-4 text-center">
                <CheckCircle size={48} className="text-green-400" />
                <p className="text-white font-bold">{success}</p>
                <button className="btn-primary mt-4" onClick={() => { setScreen('form'); setSuccess(null) }}>VOLTAR AO LOGIN</button>
              </div>
            ) : (
              <form onSubmit={handleForgot} className="flex flex-col gap-5 w-full">
                <input name="email" type="email" placeholder="Seu email" required className={inputClass} />
                {error && <div className="flex items-center gap-3 bg-red-900/30 border-2 border-red-500/50 rounded-2xl px-4 py-3">
                  <AlertCircle size={20} className="text-red-400 shrink-0" />
                  <p className="text-red-300 font-bold text-sm">{error}</p>
                </div>}
                <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
                  {loading ? 'ENVIANDO...' : 'ENVIAR INSTRUÇÕES'}
                </button>
              </form>
            )}
          </motion.div>
        )}

        {/* Reset Password */}
        {screen === 'reset' && (
          <motion.div key="reset" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 bg-(--color-background) z-50 flex flex-col items-center pt-24 px-6 sm:relative sm:inset-auto sm:max-w-md sm:border-2 sm:border-(--color-border) sm:rounded-[2rem] sm:p-10 sm:bg-(--color-card)">
            <div className="text-5xl mb-6">🔒</div>
            <h2 className="text-3xl font-black text-white mb-2 text-center">Nova senha</h2>
            {success ? (
              <div className="flex flex-col items-center gap-4 text-center mt-6">
                <CheckCircle size={48} className="text-green-400" />
                <p className="text-white font-bold">{success}</p>
                <button className="btn-primary mt-4" onClick={() => { setScreen('form'); setIsLogin(true); setSuccess(null) }}>IR PARA LOGIN</button>
              </div>
            ) : (
              <form onSubmit={handleReset} className="flex flex-col gap-5 w-full mt-6">
                <input name="password" type="password" placeholder="Nova senha" required minLength={6} className={inputClass} />
                <input name="confirm" type="password" placeholder="Confirmar nova senha" required minLength={6} className={inputClass} />
                {error && <div className="flex items-center gap-3 bg-red-900/30 border-2 border-red-500/50 rounded-2xl px-4 py-3">
                  <AlertCircle size={20} className="text-red-400 shrink-0" />
                  <p className="text-red-300 font-bold text-sm">{error}</p>
                </div>}
                <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
                  {loading ? 'SALVANDO...' : 'SALVAR NOVA SENHA'}
                </button>
              </form>
            )}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
