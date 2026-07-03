import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar   from '@/components/layout/Navbar'
import Footer   from '@/components/layout/Footer'
import CartDrawer    from '@/components/cart/CartDrawer'
import SearchModal   from '@/components/shared/SearchModal'

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0,  transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } },
}

export default function MainLayout() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname])

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FDF8F0' }}>
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="flex-1"
          style={{ paddingTop: isHome ? 0 : 'clamp(84px, 9vw, 108px)' }}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
      <CartDrawer />
      <SearchModal />
    </div>
  )
}
