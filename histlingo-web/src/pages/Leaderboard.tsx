import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Flame, Trophy } from "lucide-react"
import { users, LeaderboardEntry } from "../lib/api"
import { useAuth } from "../lib/AuthContext"

const LEAGUE_COLORS: Record<string, { text: string; bg: string; icon: string }> = {
  'Bronze':   { text: 'text-amber-700', bg: 'bg-amber-900/30', icon: '🥉' },
  'Prata':    { text: 'text-gray-300', bg: 'bg-gray-700/30', icon: '🥈' },
  'Ouro':     { text: 'text-yellow-400', bg: 'bg-yellow-900/30', icon: '🥇' },
  'Diamante': { text: 'text-cyan-400', bg: 'bg-cyan-900/30', icon: '💎' },
  'Mestre':   { text: 'text-purple-400', bg: 'bg-purple-900/30', icon: '👑' },
}

const RANK_COLORS = ['text-yellow-400', 'text-gray-300', 'text-amber-600']

export function Leaderboard() {
  const { user } = useAuth()
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [myLeague, setMyLeague] = useState<string>('Bronze')

  useEffect(() => {
    users.getLeaderboard()
      .then(data => {
        setEntries(data)
        const me = data.find(e => e.id === user?.id)
        if (me) setMyLeague(me.league)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user?.id])

  const league = LEAGUE_COLORS[myLeague] || LEAGUE_COLORS['Bronze']

  return (
    <div className="flex flex-col w-full max-w-[600px] mx-auto pb-24">
      {/* League Banner */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className={`${league.bg} border-2 border-current ${league.text} rounded-[2rem] p-6 mb-8 flex items-center gap-6`}>
        <span className="text-6xl">{league.icon}</span>
        <div>
          <p className="text-sm font-black uppercase tracking-widest opacity-70 mb-1">Sua liga atual</p>
          <h2 className={`text-4xl font-black ${league.text}`}>Liga {myLeague}</h2>
          <p className="text-sm font-bold opacity-70 mt-1">
            {myLeague === 'Bronze' && 'Ganhe 500 XP para subir para Prata'}
            {myLeague === 'Prata' && 'Ganhe 2000 XP para subir para Ouro'}
            {myLeague === 'Ouro' && 'Ganhe 5000 XP para subir para Diamante'}
            {myLeague === 'Diamante' && 'Ganhe 10000 XP para atingir Mestre'}
            {myLeague === 'Mestre' && 'Você está no topo! Continue estudando!'}
          </p>
        </div>
      </motion.div>

      {/* Top 3 podium */}
      {entries.length >= 3 && (
        <div className="flex items-end justify-center gap-3 mb-8 px-4">
          {[1, 0, 2].map(idx => {
            const e = entries[idx]
            if (!e) return null
            const podiumH = ['h-28', 'h-36', 'h-24']
            const isMe = e.id === user?.id
            return (
              <motion.div key={e.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`flex-1 flex flex-col items-center ${isMe ? 'scale-105' : ''}`}>
                <div className={`text-4xl mb-1 ${isMe ? 'ring-2 ring-yellow-400 rounded-full' : ''}`}>{e.avatarEmoji}</div>
                <p className="text-white font-black text-sm mb-2 truncate max-w-[80px] text-center">{e.username}</p>
                <p className="text-(--color-secondary) font-black text-sm mb-1">{e.xpTotal.toLocaleString()} XP</p>
                <div className={`w-full ${podiumH[idx]} rounded-t-2xl flex items-start justify-center pt-2 border-t-4 ${
                  idx === 0 ? 'bg-yellow-900/40 border-yellow-400' :
                  idx === 1 ? 'bg-gray-700/40 border-gray-400' : 'bg-amber-900/40 border-amber-600'
                }`}>
                  <span className="text-2xl font-black">{['🥇','🥈','🥉'][idx]}</span>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Full list */}
      <div className="flex flex-col gap-2">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-(--color-card) rounded-2xl p-4 animate-pulse h-16 border border-(--color-border)"></div>
          ))
        ) : entries.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Trophy size={48} className="mx-auto mb-4 opacity-30" />
            <p className="font-bold">Nenhum jogador ainda. Seja o primeiro!</p>
          </div>
        ) : (
          entries.map((entry, i) => {
            const isMe = entry.id === user?.id
            const leagueInfo = LEAGUE_COLORS[entry.league] || LEAGUE_COLORS['Bronze']
            return (
              <motion.div key={entry.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                  isMe ? 'border-(--color-primary) bg-(--color-primary)/10 shadow-neo-primary' : 'border-(--color-border) bg-(--color-card)'
                }`}>
                <span className={`text-xl font-black w-8 text-center ${i < 3 ? RANK_COLORS[i] : 'text-gray-500'}`}>
                  {i < 3 ? ['🥇', '🥈', '🥉'][i] : `${i + 1}`}
                </span>
                <span className="text-3xl">{entry.avatarEmoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`font-black truncate ${isMe ? 'text-white' : 'text-gray-200'}`}>{entry.username}</p>
                    {isMe && <span className="text-xs bg-(--color-primary) text-white px-2 py-0.5 rounded-full font-black">VOCÊ</span>}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className={`text-xs font-bold ${leagueInfo.text}`}>{leagueInfo.icon} {entry.league}</span>
                    <span className="text-xs text-gray-500 font-bold">Nível {entry.level}</span>
                    {entry.streakCount > 0 && (
                      <span className="flex items-center gap-1 text-xs text-orange-400 font-bold">
                        <Flame size={12} />{entry.streakCount}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-(--color-secondary) font-black">{entry.xpTotal.toLocaleString()}</p>
                  <p className="text-gray-500 text-xs font-bold">XP</p>
                </div>
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  )
}
