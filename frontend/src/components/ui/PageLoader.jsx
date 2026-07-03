import { motion } from 'framer-motion'
import { APP_NAME } from '@/constants'

export default function PageLoader() {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-dark"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center gap-6"
      >
        <div className="relative">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
            <motion.path
              d="M30 5 L55 20 L55 40 L30 55 L5 40 L5 20 Z"
              stroke="#C8A165"
              strokeWidth="1"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
            />
            <motion.path
              d="M30 15 L45 23 L45 37 L30 45 L15 37 L15 23 Z"
              stroke="#C8A165"
              strokeWidth="0.5"
              fill="none"
              strokeOpacity="0.4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.3, ease: 'easeInOut' }}
            />
          </svg>
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <span className="text-gold-500 font-cormorant text-xl font-light">A</span>
          </motion.div>
        </div>

        <motion.h1
          className="font-playfair text-3xl text-cream font-light tracking-[0.3em]"
          initial={{ opacity: 0, letterSpacing: '0.5em' }}
          animate={{ opacity: 1, letterSpacing: '0.3em' }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {APP_NAME.toUpperCase()}
        </motion.h1>

        {/* Progress bar */}
        <div className="w-32 h-px bg-white/10 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-gold"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}
