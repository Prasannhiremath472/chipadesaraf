import { motion } from 'framer-motion'
import { useIntersection } from '@/hooks/useIntersection'

export default function SectionHeader({
  label,
  title,
  subtitle,
  centered = true,
  light = false,
}) {
  const [ref, inView] = useIntersection()

  return (
    <div
      ref={ref}
      className={`flex flex-col gap-3 ${centered ? 'items-center text-center' : ''}`}
    >
      {label && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className={`label-luxury ${light ? 'text-gold-400' : 'text-gold-500'}`}
        >
          {label}
        </motion.p>
      )}

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.1 }}
        className={`heading-md max-w-2xl ${light ? 'text-cream' : 'text-dark dark:text-cream'}`}
      >
        {title}
      </motion.h2>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`subheading max-w-xl ${light ? 'text-cream/50' : 'text-dark/50 dark:text-cream/50'}`}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  )
}
