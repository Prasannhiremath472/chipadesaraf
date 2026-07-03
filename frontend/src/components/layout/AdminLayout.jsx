import { useState } from 'react'
import { NavLink, Outlet, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RiDashboardLine, RiShoppingBagLine, RiBox3Line, RiUserLine,
  RiCoupon2Line, RiImageLine, RiArticleLine, RiStarLine,
  RiSettingsLine, RiMenuLine, RiCloseLine, RiLogoutBoxLine,
} from 'react-icons/ri'
import { useAuth } from '@/contexts/AuthContext'
import Logo from '@/components/ui/Logo'

const ADMIN_LINKS = [
  { label: 'Dashboard', href: '/admin',           icon: RiDashboardLine  },
  { label: 'Products',  href: '/admin/products',  icon: RiBox3Line       },
  { label: 'Orders',    href: '/admin/orders',    icon: RiShoppingBagLine},
  { label: 'Customers', href: '/admin/customers', icon: RiUserLine       },
  { label: 'Coupons',   href: '/admin/coupons',   icon: RiCoupon2Line    },
  { label: 'Banners',   href: '/admin/banners',   icon: RiImageLine      },
  { label: 'Blogs',     href: '/admin/blogs',     icon: RiArticleLine    },
  { label: 'Reviews',   href: '/admin/reviews',   icon: RiStarLine       },
  { label: 'Settings',  href: '/admin/settings',  icon: RiSettingsLine   },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* ── Sidebar ── */}
      <>
        {/* Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            />
          )}
        </AnimatePresence>

        <aside className={`
          fixed top-0 left-0 h-full w-64 bg-dark z-50 flex flex-col
          transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          {/* Logo */}
          <div className="p-6 border-b border-white/5">
            <Logo className="text-cream" />
            <p className="font-poppins text-xs text-cream/30 mt-1 tracking-wider">Admin Panel</p>
          </div>

          {/* Nav */}
          <nav className="flex-1 py-6 px-3 overflow-y-auto">
            {ADMIN_LINKS.map(({ label, href, icon: Icon }) => (
              <NavLink
                key={href}
                to={href}
                end={href === '/admin'}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 mb-1 rounded text-sm font-poppins
                  transition-all duration-200
                  ${isActive
                    ? 'bg-gold-500/10 text-gold-400 border-l-2 border-gold-500'
                    : 'text-cream/50 hover:text-cream hover:bg-white/5'
                  }
                `}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </nav>

          {/* User / Logout */}
          <div className="p-4 border-t border-white/5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center">
                <span className="text-gold-400 font-poppins text-xs font-semibold">
                  {(user?.name || user?.firstName || 'A')[0].toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-poppins text-xs text-cream font-medium">
                  {user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Admin'}
                </p>
                <p className="font-inter text-[10px] text-cream/30">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 w-full px-3 py-2 font-poppins text-xs
                         text-cream/40 hover:text-red-400 transition-colors"
            >
              <RiLogoutBoxLine />
              Logout
            </button>
          </div>
        </aside>
      </>

      {/* ── Main Content ── */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-100 px-6 py-4
                           flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
          >
            <RiMenuLine size={20} />
          </button>
          <div />
          <div className="flex items-center gap-3">
            <Link to="/" className="font-poppins text-xs text-gray-400 hover:text-gold-600 transition-colors">
              ← View Store
            </Link>
          </div>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
