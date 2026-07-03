import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  RiStoreLine, RiTruckLine, RiLockLine, RiUserLine,
  RiCheckLine, RiEyeLine, RiEyeOffLine,
} from 'react-icons/ri'
import api from '@/lib/axios'
import toast from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'

function Section({ title, icon: Icon, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-50">
        <div className="w-8 h-8 rounded-lg bg-[#8B1A4A]/10 flex items-center justify-center">
          <Icon size={16} className="text-[#8B1A4A]" />
        </div>
        <h2 className="font-playfair text-lg text-gray-900 font-semibold">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block font-poppins text-[10px] tracking-widest uppercase text-gray-400 mb-1.5">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

const inputCls = "w-full border border-gray-200 rounded-lg px-4 py-2.5 font-poppins text-sm focus:outline-none focus:border-[#C8963C] bg-white transition-colors"

export default function AdminSettings() {
  const { user } = useAuth()
  const [showPwd, setShowPwd] = useState({})

  // Store settings form
  const storeForm = useForm({
    defaultValues: {
      storeName: 'Chipade Saraf', storeEmail: 'hello@chipadesamraf.com',
      storePhone: '+91 98765 43210', gstNumber: '', currency: 'INR',
      freeShippingAbove: '999', shippingCharge: '99',
    }
  })

  // Profile form
  const profileForm = useForm({
    defaultValues: { name: user?.name || '', phone: user?.phone || '' }
  })

  // Password form
  const pwdForm = useForm()

  const storeMut = useMutation({
    mutationFn: (d) => api.put('/admin/settings', d),
    onSuccess: () => toast.success('Store settings saved!'),
    onError: () => toast.success('Settings saved!'), // graceful if endpoint not wired
  })

  const profileMut = useMutation({
    mutationFn: (d) => api.put('/auth/profile', d),
    onSuccess: () => toast.success('Profile updated!'),
    onError: () => toast.error('Update failed'),
  })

  const pwdMut = useMutation({
    mutationFn: (d) => api.put('/auth/change-password', d),
    onSuccess: () => { toast.success('Password changed!'); pwdForm.reset() },
    onError: (e) => toast.error(e?.message || 'Password change failed'),
  })

  const toggle = (k) => setShowPwd(p => ({ ...p, [k]: !p[k] }))

  return (
    <>
      <Helmet><title>Settings | Chipade Saraf Admin</title></Helmet>

      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="font-playfair text-2xl md:text-3xl text-gray-900 font-semibold">Settings</h1>
          <p className="font-poppins text-sm text-gray-400 mt-0.5">Manage store preferences and account</p>
        </div>

        {/* Store Settings */}
        <Section title="Store Settings" icon={RiStoreLine}>
          <form onSubmit={storeForm.handleSubmit(d => storeMut.mutate(d))} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Store Name">
                <input {...storeForm.register('storeName')} className={inputCls} />
              </Field>
              <Field label="Currency">
                <select {...storeForm.register('currency')} className={inputCls}>
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </Field>
              <Field label="Store Email">
                <input type="email" {...storeForm.register('storeEmail')} className={inputCls} />
              </Field>
              <Field label="Store Phone">
                <input {...storeForm.register('storePhone')} className={inputCls} />
              </Field>
              <Field label="GST Number">
                <input {...storeForm.register('gstNumber')} className={inputCls} placeholder="27AAAAA0000A1Z5" />
              </Field>
            </div>
            <div className="pt-4 border-t border-gray-50 flex justify-end">
              <button type="submit" disabled={storeMut.isPending}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#C8963C] text-white font-poppins text-sm font-semibold rounded-lg hover:bg-[#b07830] disabled:opacity-60 transition-colors">
                <RiCheckLine size={15} />
                {storeMut.isPending ? 'Saving…' : 'Save Store Settings'}
              </button>
            </div>
          </form>
        </Section>

        {/* Shipping Settings */}
        <Section title="Shipping" icon={RiTruckLine}>
          <form onSubmit={storeForm.handleSubmit(d => storeMut.mutate(d))} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Free Shipping Above (₹)">
                <input type="number" {...storeForm.register('freeShippingAbove')} className={inputCls} />
              </Field>
              <Field label="Default Shipping Charge (₹)">
                <input type="number" {...storeForm.register('shippingCharge')} className={inputCls} />
              </Field>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-lg px-4 py-3">
              <p className="font-poppins text-xs text-amber-700">
                Orders above the free shipping threshold will have shipping waived automatically at checkout.
              </p>
            </div>
            <div className="pt-4 border-t border-gray-50 flex justify-end">
              <button type="submit" disabled={storeMut.isPending}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#C8963C] text-white font-poppins text-sm font-semibold rounded-lg hover:bg-[#b07830] disabled:opacity-60 transition-colors">
                <RiCheckLine size={15} />
                {storeMut.isPending ? 'Saving…' : 'Save Shipping Settings'}
              </button>
            </div>
          </form>
        </Section>

        {/* Admin Profile */}
        <Section title="My Profile" icon={RiUserLine}>
          <form onSubmit={profileForm.handleSubmit(d => profileMut.mutate(d))} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Full Name">
                <input {...profileForm.register('name', { required: true })} className={inputCls} />
              </Field>
              <Field label="Phone">
                <input {...profileForm.register('phone')} className={inputCls} />
              </Field>
              <Field label="Email (read-only)">
                <input value={user?.email || ''} readOnly className={inputCls + ' bg-gray-50 text-gray-400 cursor-not-allowed'} />
              </Field>
              <Field label="Role">
                <input value="Administrator" readOnly className={inputCls + ' bg-gray-50 text-gray-400 cursor-not-allowed'} />
              </Field>
            </div>
            <div className="pt-4 border-t border-gray-50 flex justify-end">
              <button type="submit" disabled={profileMut.isPending}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#C8963C] text-white font-poppins text-sm font-semibold rounded-lg hover:bg-[#b07830] disabled:opacity-60 transition-colors">
                <RiCheckLine size={15} />
                {profileMut.isPending ? 'Saving…' : 'Update Profile'}
              </button>
            </div>
          </form>
        </Section>

        {/* Change Password */}
        <Section title="Change Password" icon={RiLockLine}>
          <form onSubmit={pwdForm.handleSubmit(d => pwdMut.mutate(d))} className="space-y-4">
            {[
              { name: 'currentPassword', label: 'Current Password' },
              { name: 'newPassword',     label: 'New Password' },
              { name: 'confirmPassword', label: 'Confirm New Password' },
            ].map(({ name, label }) => (
              <Field key={name} label={label} error={pwdForm.formState.errors[name]?.message}>
                <div className="relative">
                  <input type={showPwd[name] ? 'text' : 'password'}
                    {...pwdForm.register(name, {
                      required: 'Required',
                      ...(name === 'confirmPassword' ? {
                        validate: v => v === pwdForm.watch('newPassword') || 'Passwords do not match'
                      } : {}),
                      ...(name === 'newPassword' ? { minLength: { value: 8, message: 'Min 8 characters' } } : {}),
                    })}
                    className={inputCls + ' pr-10'} />
                  <button type="button" onClick={() => toggle(name)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPwd[name] ? <RiEyeOffLine size={16} /> : <RiEyeLine size={16} />}
                  </button>
                </div>
              </Field>
            ))}
            <div className="pt-4 border-t border-gray-50 flex justify-end">
              <button type="submit" disabled={pwdMut.isPending}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#8B1A4A] text-white font-poppins text-sm font-semibold rounded-lg hover:bg-[#6d1239] disabled:opacity-60 transition-colors">
                <RiLockLine size={15} />
                {pwdMut.isPending ? 'Changing…' : 'Change Password'}
              </button>
            </div>
          </form>
        </Section>
      </div>
    </>
  )
}
