import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  RiUserLine, RiShoppingBagLine, RiHeartLine,
  RiMapPinLine, RiBellLine, RiLogoutBoxLine,
} from 'react-icons/ri'
import { useAuth } from '@/contexts/AuthContext'
import { useForm } from 'react-hook-form'
import api from '@/lib/axios'
import toast from 'react-hot-toast'

const TABS = [
  { key: 'profile',   label: 'Profile',        icon: RiUserLine        },
  { key: 'orders',    label: 'My Orders',       icon: RiShoppingBagLine },
  { key: 'wishlist',  label: 'Wishlist',        icon: RiHeartLine       },
  { key: 'addresses', label: 'Addresses',       icon: RiMapPinLine      },
  { key: 'notifications', label: 'Notifications', icon: RiBellLine     },
]

export default function Account() {
  const [activeTab, setActiveTab] = useState('profile')
  const { user, logout, updateUser } = useAuth()
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName:  user?.lastName  || '',
      phone:     user?.phone     || '',
    },
  })

  const onSave = async (data) => {
    try {
      const updated = await api.put('/auth/profile', data)
      updateUser(updated.user)
      toast.success('Profile updated!')
    } catch {
      toast.error('Update failed')
    }
  }

  return (
    <>
      <Helmet><title>My Account | Chipade Saraf</title></Helmet>
      <div className="min-h-screen bg-cream dark:bg-dark py-10">
        <div className="section-padding max-w-6xl mx-auto">
          <h1 className="font-playfair text-4xl text-dark dark:text-cream mb-10">My Account</h1>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div>
              {/* User card */}
              <div className="bg-white dark:bg-charcoal p-5 mb-4 text-center">
                <div className="w-16 h-16 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="font-playfair text-2xl text-gold-500">
                    {user?.firstName?.[0]?.toUpperCase()}
                  </span>
                </div>
                <p className="font-playfair text-lg text-dark dark:text-cream">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="font-inter text-xs text-dark/40 dark:text-cream/40">{user?.email}</p>
              </div>

              <nav className="flex flex-col gap-1">
                {TABS.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`flex items-center gap-3 px-4 py-3 text-left font-poppins text-sm transition-colors
                      ${activeTab === key
                        ? 'bg-gold-500 text-dark'
                        : 'text-dark/60 dark:text-cream/60 hover:text-dark dark:hover:text-cream hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                  >
                    <Icon size={16} />
                    {label}
                  </button>
                ))}
                <button
                  onClick={logout}
                  className="flex items-center gap-3 px-4 py-3 font-poppins text-sm
                             text-dark/40 dark:text-cream/40 hover:text-red-400 transition-colors mt-2"
                >
                  <RiLogoutBoxLine size={16} />
                  Logout
                </button>
              </nav>
            </div>

            {/* Content */}
            <div className="md:col-span-3">
              {activeTab === 'profile' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white dark:bg-charcoal p-6 md:p-8">
                  <h2 className="font-playfair text-2xl text-dark dark:text-cream mb-6">Personal Information</h2>
                  <form onSubmit={handleSubmit(onSave)} className="grid sm:grid-cols-2 gap-5 max-w-lg">
                    {[
                      { name: 'firstName', label: 'First Name' },
                      { name: 'lastName',  label: 'Last Name'  },
                    ].map(({ name, label }) => (
                      <div key={name}>
                        <label className="font-poppins text-[10px] tracking-widest uppercase text-dark/40 dark:text-cream/40 block mb-1.5">{label}</label>
                        <input {...register(name)} className="input-luxury border border-dark/15 dark:border-cream/15 px-3 py-3 w-full" />
                      </div>
                    ))}
                    <div className="sm:col-span-2">
                      <label className="font-poppins text-[10px] tracking-widest uppercase text-dark/40 dark:text-cream/40 block mb-1.5">Email</label>
                      <input value={user?.email} readOnly className="input-luxury border border-dark/5 dark:border-cream/5 px-3 py-3 w-full opacity-50 cursor-not-allowed" />
                    </div>
                    <div>
                      <label className="font-poppins text-[10px] tracking-widest uppercase text-dark/40 dark:text-cream/40 block mb-1.5">Phone</label>
                      <input {...register('phone')} className="input-luxury border border-dark/15 dark:border-cream/15 px-3 py-3 w-full" />
                    </div>
                    <div className="sm:col-span-2">
                      <button type="submit" disabled={isSubmitting} className="btn-gold">
                        {isSubmitting ? 'Saving…' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {activeTab === 'orders' && (
                <div className="bg-white dark:bg-charcoal p-6 md:p-8">
                  <h2 className="font-playfair text-2xl text-dark dark:text-cream mb-6">Order History</h2>
                  <Link to="/account/orders" className="btn-gold">View All Orders</Link>
                </div>
              )}

              {activeTab === 'addresses' && (
                <div className="bg-white dark:bg-charcoal p-6 md:p-8">
                  <h2 className="font-playfair text-2xl text-dark dark:text-cream mb-6">Saved Addresses</h2>
                  <p className="font-cormorant text-xl text-dark/30 dark:text-cream/30 italic">No saved addresses yet.</p>
                </div>
              )}

              {(activeTab === 'wishlist' || activeTab === 'notifications') && (
                <div className="bg-white dark:bg-charcoal p-6 md:p-8">
                  <h2 className="font-playfair text-2xl text-dark dark:text-cream mb-6 capitalize">{activeTab}</h2>
                  <p className="font-cormorant text-xl text-dark/30 dark:text-cream/30 italic">Coming soon…</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
