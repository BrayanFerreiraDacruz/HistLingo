import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"

// ── SVG characters ────────────────────────────────────────────────────────

function Indigena() {
  return (
    <svg viewBox="0 0 64 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Feathers */}
      <ellipse cx="16" cy="20" rx="5" ry="13" fill="#E53935" transform="rotate(-35 16 20)" />
      <ellipse cx="24" cy="12" rx="5" ry="14" fill="#FFD600" transform="rotate(-15 24 12)" />
      <ellipse cx="32" cy="9"  rx="5" ry="15" fill="#43A047" transform="rotate(0 32 9)" />
      <ellipse cx="40" cy="12" rx="5" ry="14" fill="#FF9800" transform="rotate(15 40 12)" />
      <ellipse cx="48" cy="20" rx="5" ry="13" fill="#1E88E5" transform="rotate(35 48 20)" />
      {/* Feather tips */}
      <ellipse cx="16" cy="10" rx="3" ry="5" fill="#B71C1C" transform="rotate(-35 16 10)" />
      <ellipse cx="24" cy="5"  rx="3" ry="5" fill="#F9A825" transform="rotate(-15 24 5)" />
      <ellipse cx="32" cy="2"  rx="3" ry="6" fill="#1B5E20" transform="rotate(0 32 2)" />
      <ellipse cx="40" cy="5"  rx="3" ry="5" fill="#E65100" transform="rotate(15 40 5)" />
      <ellipse cx="48" cy="10" rx="3" ry="5" fill="#0D47A1" transform="rotate(35 48 10)" />
      {/* Head band */}
      <rect x="14" y="27" width="36" height="7" rx="3.5" fill="#4E342E" />
      <circle cx="24" cy="30" r="3" fill="#E53935" />
      <circle cx="32" cy="30" r="3" fill="#FFD600" />
      <circle cx="40" cy="30" r="3" fill="#43A047" />
      {/* Head */}
      <ellipse cx="32" cy="40" rx="17" ry="16" fill="#8D5524" />
      {/* 3D shading on face */}
      <ellipse cx="26" cy="38" rx="8" ry="10" fill="#9E6432" opacity="0.4" />
      {/* Eyes */}
      <ellipse cx="25" cy="38" rx="3.5" ry="4" fill="#1A1A1A" />
      <ellipse cx="39" cy="38" rx="3.5" ry="4" fill="#1A1A1A" />
      <circle cx="26" cy="37" r="1.5" fill="white" />
      <circle cx="40" cy="37" r="1.5" fill="white" />
      <circle cx="26.5" cy="37" r="0.8" fill="#1A1A1A" />
      <circle cx="40.5" cy="37" r="0.8" fill="#1A1A1A" />
      {/* Nose */}
      <ellipse cx="32" cy="42" rx="3" ry="2" fill="#6D4C41" />
      {/* Smile */}
      <path d="M25 48 Q32 53 39 48" stroke="#4E342E" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Body paint marks */}
      <line x1="21" y1="35" x2="17" y2="44" stroke="#E53935" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="43" y1="35" x2="47" y2="44" stroke="#E53935" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="22" y1="38" x2="19" y2="41" stroke="#E53935" strokeWidth="1" strokeLinecap="round" />
      <line x1="42" y1="38" x2="45" y2="41" stroke="#E53935" strokeWidth="1" strokeLinecap="round" />
      {/* Neck */}
      <rect x="27" y="54" width="10" height="6" rx="3" fill="#8D5524" />
      {/* Body with tribal pattern */}
      <rect x="16" y="58" width="32" height="22" rx="10" fill="#6D4C41" />
      <ellipse cx="22" cy="58" rx="7" ry="5" fill="#6D4C41" />
      <ellipse cx="42" cy="58" rx="7" ry="5" fill="#6D4C41" />
      {/* Tribal zigzag */}
      <path d="M20 65 L24 61 L28 65 L32 61 L36 65 L40 61 L44 65" stroke="#FFD600" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 71 L24 67 L28 71 L32 67 L36 71 L40 67 L44 71" stroke="#E53935" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CapitaoEstevaoDias() {
  return (
    <svg viewBox="0 0 64 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Hat brim */}
      <ellipse cx="32" cy="22" rx="24" ry="6" fill="#1A1A2E" />
      <ellipse cx="32" cy="21" rx="22" ry="5" fill="#16213E" />
      {/* Hat body */}
      <rect x="16" y="6" width="32" height="18" rx="5" fill="#0F3460" />
      {/* Hat highlight (3D) */}
      <rect x="18" y="8" width="14" height="5" rx="2" fill="#1a4a7a" opacity="0.6" />
      {/* Portuguese cross on hat */}
      <rect x="29" y="8" width="6" height="14" rx="1" fill="#E8C547" />
      <rect x="23" y="12" width="18" height="5" rx="1" fill="#E8C547" />
      <rect x="30" y="9" width="4" height="12" rx="1" fill="#D4A017" />
      <rect x="24" y="13" width="16" height="3" rx="1" fill="#D4A017" />
      {/* Feather on hat */}
      <path d="M44 8 Q52 4 56 10 Q50 12 44 16Z" fill="#E0E0E0" />
      <path d="M44 8 Q50 6 52 12 Q48 12 44 14Z" fill="#F5F5F5" />
      {/* Face */}
      <ellipse cx="32" cy="37" rx="16" ry="15" fill="#FFCCBC" />
      {/* 3D shading */}
      <ellipse cx="26" cy="35" rx="7" ry="9" fill="#FFAB91" opacity="0.35" />
      {/* Beard */}
      <ellipse cx="32" cy="46" rx="13" ry="8" fill="#5D4037" />
      <ellipse cx="32" cy="43" rx="12" ry="6" fill="#FFCCBC" />
      {/* Mustache */}
      <path d="M20 41 Q24 44 28 42 Q32 44 36 42 Q40 44 44 41" fill="#4E342E" />
      {/* Eyes */}
      <ellipse cx="25" cy="34" rx="3" ry="3.5" fill="#3E2723" />
      <ellipse cx="39" cy="34" rx="3" ry="3.5" fill="#3E2723" />
      <circle cx="26" cy="33" r="1.5" fill="white" />
      <circle cx="40" cy="33" r="1.5" fill="white" />
      <circle cx="26.5" cy="33" r="0.7" fill="#3E2723" />
      <circle cx="40.5" cy="33" r="0.7" fill="#3E2723" />
      {/* Nose */}
      <ellipse cx="32" cy="38" rx="2.5" ry="2" fill="#FFAB91" />
      {/* Neck */}
      <rect x="27" y="50" width="10" height="7" rx="3" fill="#FFCCBC" />
      {/* Cape */}
      <path d="M12 57 L20 52 L32 74 L44 52 L52 57 L44 80 L20 80Z" fill="#0F3460" />
      {/* Cape highlight */}
      <path d="M20 53 L32 50 L44 53 L42 58 L32 56 L22 58Z" fill="#16213E" />
      {/* Cross on chest */}
      <rect x="29" y="57" width="6" height="14" rx="1" fill="#E8C547" />
      <rect x="24" y="62" width="16" height="5" rx="1" fill="#E8C547" />
      <rect x="30" y="58" width="4" height="12" rx="1" fill="#D4A017" />
      <rect x="25" y="63" width="14" height="3" rx="1" fill="#D4A017" />
    </svg>
  )
}

function DomPedroII() {
  return (
    <svg viewBox="0 0 64 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Crown base */}
      <rect x="14" y="22" width="36" height="9" rx="3" fill="#E8C547" />
      <rect x="14" y="22" width="36" height="4" rx="2" fill="#D4A017" />
      {/* Crown spires */}
      <polygon points="14,22 19,7 24,22" fill="#E8C547" />
      <polygon points="27,22 32,4 37,22" fill="#E8C547" />
      <polygon points="40,22 45,7 50,22" fill="#E8C547" />
      {/* Crown gems */}
      <circle cx="19" cy="12" r="4" fill="#E53935" />
      <circle cx="19" cy="12" r="2.5" fill="#FF6B6B" />
      <circle cx="32" cy="9"  r="4.5" fill="#1E88E5" />
      <circle cx="32" cy="9"  r="3"   fill="#64B5F6" />
      <circle cx="45" cy="12" r="4" fill="#43A047" />
      <circle cx="45" cy="12" r="2.5" fill="#81C784" />
      {/* Band gems */}
      <circle cx="22" cy="26" r="2.5" fill="#E53935" />
      <circle cx="32" cy="26" r="2.5" fill="#1E88E5" />
      <circle cx="42" cy="26" r="2.5" fill="#43A047" />
      {/* Face */}
      <ellipse cx="32" cy="40" rx="16" ry="15" fill="#FFCCBC" />
      <ellipse cx="26" cy="38" rx="7" ry="9" fill="#FFAB91" opacity="0.3" />
      {/* Beard - royal style */}
      <ellipse cx="32" cy="48" rx="13" ry="8" fill="#795548" />
      <ellipse cx="32" cy="45" rx="12" ry="7" fill="#FFCCBC" />
      {/* Sideburns */}
      <ellipse cx="17" cy="42" rx="4" ry="8" fill="#795548" />
      <ellipse cx="47" cy="42" rx="4" ry="8" fill="#795548" />
      {/* Eyes */}
      <ellipse cx="25" cy="37" rx="3" ry="3.5" fill="#37474F" />
      <ellipse cx="39" cy="37" rx="3" ry="3.5" fill="#37474F" />
      <circle cx="26" cy="36" r="1.5" fill="white" />
      <circle cx="40" cy="36" r="1.5" fill="white" />
      {/* Nose */}
      <ellipse cx="32" cy="41" rx="2.5" ry="2" fill="#FFAB91" />
      {/* Smile regal */}
      <path d="M26 47 Q32 51 38 47" stroke="#5D4037" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Neck */}
      <rect x="27" y="53" width="10" height="6" rx="3" fill="#FFCCBC" />
      {/* Imperial robe */}
      <path d="M10 60 L20 56 L32 78 L44 56 L54 60 L46 80 L18 80Z" fill="#6A1B9A" />
      <path d="M20 57 L32 54 L44 57" stroke="#E8C547" strokeWidth="2" fill="none" />
      {/* Ermine pattern */}
      <path d="M14 66 Q16 64 18 66 Q20 64 22 66" stroke="#F5F5F5" strokeWidth="1.5" fill="none" />
      <path d="M42 66 Q44 64 46 66 Q48 64 50 66" stroke="#F5F5F5" strokeWidth="1.5" fill="none" />
      {/* Brazil coat emblem hint */}
      <ellipse cx="32" cy="66" rx="8" ry="9" fill="#2E7D32" opacity="0.4" />
      <ellipse cx="32" cy="66" rx="6" ry="7" fill="#1565C0" opacity="0.5" />
      <path d="M27 65 L32 62 L37 65 L35 70 L29 70Z" fill="#E8C547" opacity="0.8" />
    </svg>
  )
}

function MarechalDeodoro() {
  return (
    <svg viewBox="0 0 64 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Military hat - kepi style */}
      <ellipse cx="32" cy="24" rx="22" ry="5" fill="#1B5E20" />
      <rect x="14" y="10" width="36" height="16" rx="5" fill="#2E7D32" />
      <rect x="16" y="12" width="16" height="6" rx="2" fill="#388E3C" opacity="0.5" />
      {/* Hat band */}
      <rect x="14" y="20" width="36" height="5" rx="2" fill="#1B5E20" />
      {/* Hat badge */}
      <ellipse cx="32" cy="17" rx="8" ry="7" fill="#E8C547" />
      <ellipse cx="32" cy="17" rx="6" ry="5" fill="#D4A017" />
      {/* Star on badge */}
      <path d="M32 12 L33.5 16.5 L38 16.5 L34.5 19 L36 23.5 L32 21 L28 23.5 L29.5 19 L26 16.5 L30.5 16.5Z" fill="#E8C547" />
      {/* Face */}
      <ellipse cx="32" cy="38" rx="15" ry="14" fill="#FFCCBC" />
      <ellipse cx="26" cy="36" rx="6" ry="8" fill="#FFAB91" opacity="0.3" />
      {/* Large commanding mustache */}
      <path d="M18 41 Q22 45 26 43 Q29 45 32 43 Q35 45 38 43 Q42 45 46 41" fill="#37474F" />
      <path d="M20 39 Q25 42 29 40 Q32 42 35 40 Q39 42 44 39 Q44 44 38 44 Q35 43 32 44 Q29 43 26 44 Q20 44 20 39Z" fill="#263238" />
      {/* Eyes - commanding gaze */}
      <ellipse cx="25" cy="34" rx="3" ry="3" fill="#1A237E" />
      <ellipse cx="39" cy="34" rx="3" ry="3" fill="#1A237E" />
      <circle cx="26" cy="33.5" r="1.2" fill="white" />
      <circle cx="40" cy="33.5" r="1.2" fill="white" />
      {/* Stern eyebrows */}
      <path d="M21 30 Q25 27 28 30" stroke="#263238" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M36 30 Q39 27 43 30" stroke="#263238" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Nose */}
      <ellipse cx="32" cy="38" rx="3" ry="2" fill="#FFAB91" />
      {/* Neck */}
      <rect x="27" y="50" width="10" height="6" rx="3" fill="#FFCCBC" />
      {/* Military uniform */}
      <rect x="14" y="54" width="36" height="26" rx="8" fill="#2E7D32" />
      {/* Shoulders/epaulettes */}
      <ellipse cx="14" cy="56" rx="9" ry="5" fill="#E8C547" />
      <ellipse cx="50" cy="56" rx="9" ry="5" fill="#E8C547" />
      <path d="M8 54 Q14 52 20 56" stroke="#D4A017" strokeWidth="1.5" fill="none" />
      <path d="M56 54 Q50 52 44 56" stroke="#D4A017" strokeWidth="1.5" fill="none" />
      {/* Medals row */}
      <circle cx="22" cy="62" r="4" fill="#E8C547" />
      <circle cx="22" cy="62" r="2.5" fill="#F57F17" />
      <circle cx="30" cy="62" r="4" fill="#C0C0C0" />
      <circle cx="30" cy="62" r="2.5" fill="#9E9E9E" />
      <circle cx="38" cy="62" r="4" fill="#E8C547" />
      <circle cx="38" cy="62" r="2.5" fill="#D4A017" />
      {/* Buttons */}
      <circle cx="32" cy="71" r="2" fill="#1B5E20" />
      <circle cx="32" cy="77" r="2" fill="#1B5E20" />
      {/* Belt */}
      <rect x="14" y="68" width="36" height="4" rx="2" fill="#1B5E20" />
      <rect x="29" y="67" width="6" height="6" rx="1" fill="#E8C547" />
    </svg>
  )
}

function AnitiGaribaldi() {
  return (
    <svg viewBox="0 0 64 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Hair - wavy black */}
      <ellipse cx="32" cy="28" rx="19" ry="20" fill="#1A1A1A" />
      <ellipse cx="12" cy="40" rx="7" ry="16" fill="#1A1A1A" />
      <ellipse cx="52" cy="40" rx="7" ry="16" fill="#1A1A1A" />
      <path d="M12 30 Q8 40 10 52" stroke="#2A2A2A" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M52 30 Q56 40 54 52" stroke="#2A2A2A" strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* Headband Farroupilha */}
      <rect x="14" y="22" width="36" height="8" rx="4" fill="#009C3B" />
      <rect x="14" y="24" width="36" height="4" rx="2" fill="#FFDF00" />
      <ellipse cx="32" cy="26" rx="6" ry="4" fill="#009C3B" />
      <path d="M29 26 L32 22 L35 26 L33 29 L31 29Z" fill="#FFDF00" />
      {/* Face */}
      <ellipse cx="32" cy="40" rx="16" ry="15" fill="#C68642" />
      <ellipse cx="26" cy="38" rx="7" ry="9" fill="#BF7A3A" opacity="0.3" />
      {/* Eyes - determined */}
      <ellipse cx="25" cy="37" rx="3.5" ry="4" fill="#1A1A1A" />
      <ellipse cx="39" cy="37" rx="3.5" ry="4" fill="#1A1A1A" />
      <circle cx="26" cy="36" r="1.5" fill="white" />
      <circle cx="40" cy="36" r="1.5" fill="white" />
      <circle cx="26.5" cy="36" r="0.8" fill="#1A1A1A" />
      <circle cx="40.5" cy="36" r="0.8" fill="#1A1A1A" />
      {/* Nose */}
      <ellipse cx="32" cy="41" rx="2.5" ry="1.8" fill="#A0522D" />
      {/* Brave smile */}
      <path d="M25 46 Q32 51 39 46" stroke="#5D4037" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Neck */}
      <rect x="27" y="53" width="10" height="6" rx="3" fill="#C68642" />
      {/* Gaucho shirt/blouse - green and yellow */}
      <path d="M10 60 L22 55 L32 76 L42 55 L54 60 L46 80 L18 80Z" fill="#009C3B" />
      <path d="M22 56 L32 53 L42 56 L40 62 L32 60 L24 62Z" fill="#FFDF00" />
      {/* Raised fist with sword */}
      <rect x="42" y="28" width="8" height="18" rx="4" fill="#C68642" />
      <circle cx="46" cy="30" r="6" fill="#C68642" />
      {/* Sword */}
      <rect x="44" y="8" width="4" height="22" rx="2" fill="#C0C0C0" />
      <rect x="38" y="16" width="16" height="3" rx="1" fill="#E8C547" />
      <ellipse cx="46" cy="30" rx="5" ry="4" fill="#D4A017" />
      {/* Stars on shirt */}
      <path d="M22 66 L23.5 70.5 L28 70.5 L24.5 73 L26 77.5 L22 75 L18 77.5 L19.5 73 L16 70.5 L20.5 70.5Z" fill="#FFDF00" />
    </svg>
  )
}

const CHAR_SVG: Record<number, () => React.ReactElement> = {
  1: Indigena,
  2: CapitaoEstevaoDias,
  3: DomPedroII,
  4: MarechalDeodoro,
  5: AnitiGaribaldi,
}

// ── Animations ────────────────────────────────────────────────────────────

const idleAnim = {
  y: [0, -8, 0],
  transition: { repeat: Infinity, duration: 2, ease: "easeInOut" as const },
}

const jumpAnim = {
  y: [0, -28, -10, -22, 0],
  scaleX: [1, 0.85, 1.1, 0.9, 1],
  scaleY: [1, 1.2, 0.9, 1.15, 1],
  transition: { duration: 0.7, ease: "easeOut" as const },
}

const celebrateAnim = {
  y: [0, -30, 0, -18, 0],
  rotate: [0, -15, 15, -10, 10, 0],
  scale: [1, 1.2, 1, 1.15, 1],
  transition: { duration: 1.1, ease: "easeOut" as const },
}

const sadAnim = {
  x: [0, -6, 6, -5, 5, -3, 3, 0],
  y: [0, 3, 3, 3, 3, 3, 3, 0],
  transition: { duration: 0.7, ease: "easeInOut" as const },
}

// ── Shadow component ──────────────────────────────────────────────────────
function Shadow() {
  return (
    <motion.div
      animate={{ scaleX: [1, 0.7, 1], opacity: [0.35, 0.2, 0.35] }}
      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      className="w-10 h-3 rounded-full bg-black/40 blur-sm mx-auto -mt-1"
    />
  )
}

// ── Main export ───────────────────────────────────────────────────────────
interface MapCharacterProps {
  moduleOrder: number
  state?: 'idle' | 'celebrate' | 'jump' | 'sad'
}

export function MapCharacter({ moduleOrder, state = 'idle' }: MapCharacterProps) {
  type AnimType = typeof idleAnim | typeof jumpAnim | typeof celebrateAnim | typeof sadAnim
  const [anim, setAnim] = useState<AnimType>(idleAnim)
  const CharSVG = CHAR_SVG[moduleOrder] || CHAR_SVG[1]

  useEffect(() => {
    if (state === 'celebrate') {
      setAnim(celebrateAnim)
      const t = setTimeout(() => setAnim(idleAnim), 1200)
      return () => clearTimeout(t)
    }
    if (state === 'jump') {
      setAnim(jumpAnim)
      const t = setTimeout(() => setAnim(idleAnim), 800)
      return () => clearTimeout(t)
    }
    if (state === 'sad') {
      setAnim(sadAnim)
      const t = setTimeout(() => setAnim(idleAnim), 800)
      return () => clearTimeout(t)
    }
    setAnim(idleAnim)
  }, [state])

  return (
    <div className="flex flex-col items-center select-none pointer-events-none">
      {/* Pseudo-3D container: slight perspective tilt */}
      <motion.div
        animate={anim}
        style={{ perspective: 180, transformStyle: 'preserve-3d' }}
        className="w-14 h-[72px]"
      >
        {/* Inner tilt for pseudo-3D feel */}
        <motion.div
          animate={{ rotateY: [-4, 4, -4] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          style={{ transformStyle: 'preserve-3d' }}
          className="w-full h-full drop-shadow-[3px_6px_8px_rgba(0,0,0,0.6)]"
        >
          <CharSVG />
        </motion.div>
      </motion.div>
      <Shadow />
    </div>
  )
}
