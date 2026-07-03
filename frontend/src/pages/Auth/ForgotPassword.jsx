import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import api from '@/lib/axios'
import Logo from '@/components/ui/Logo'

export default function ForgotPassword() {
  const [sent, setSent] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()

  const onSubmit = async (data) => {
    await api.post('/auth/forgot-password', data)
    setSent(true)
  }

  return (
    <>
      <Helmet><title>Reset Password | Chipade Saraf</title></Helmet>
      <div className="min-h-screen flex items-center justify-center bg-cream dark:bg-dark p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="mb-10"><Logo className="text-dark dark:text-cream" /></div>

          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-gold-500 text-2xl">✓</span>
              </div>
              <h2 className="font-playfair text-3xl text-dark dark:text-cream mb-3">Check Your Email</h2>
              <p className="font-cormorant text-xl text-dark/50 dark:text-cream/50 italic mb-6">
                We've sent password reset instructions to your email.
              </p>
              <Link to="/auth/login" className="btn-gold inline-flex">Back to Sign In</Link>
            </div>
          ) : (
            <>
              <p className="label-luxury mb-3">Account Recovery</p>
              <h1 className="font-playfair text-3xl text-dark dark:text-cream mb-4">Forgot Password?</h1>
              <p className="font-cormorant text-lg text-dark/50 dark:text-cream/50 italic mb-8">
                Enter your email and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <div>
                  <label className="font-poppins text-[10px] tracking-widest uppercase text-dark/40 dark:text-cream/40 block mb-1.5">
                    Email Address
                  </label>
                  <input
                    {...register('email', { required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } })}
                    type="email"
                    className="input-luxury border-b-2 border-dark/20 dark:border-cream/20 focus:border-gold-500 py-3 w-full"
                  />
                  {errors.email && <p className="font-inter text-xs text-red-400 mt-1">{errors.email.message}</p>}
                </div>

                <button type="submit" disabled={isSubmitting} className="btn-gold justify-center">
                  {isSubmitting ? 'Sending…' : 'Send Reset Link'}
                </button>
              </form>

              <p className="mt-6 text-center font-inter text-sm text-dark/50 dark:text-cream/50">
                Remember your password?{' '}
                <Link to="/auth/login" className="text-gold-500 hover:text-gold-600 font-medium">Sign In</Link>
              </p>
            </>
          )}
        </motion.div>
      </div>
    </>
  )
}
