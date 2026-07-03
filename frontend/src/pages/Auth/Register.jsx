import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { RiEyeLine, RiEyeOffLine } from 'react-icons/ri'
import { useAuth } from '@/contexts/AuthContext'
import Logo from '@/components/ui/Logo'

export default function Register() {
  const [showPwd, setShowPwd] = useState(false)
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const { register, handleSubmit, watch, setError, formState: { errors, isSubmitting } } = useForm()

  const onSubmit = async (data) => {
    try {
      await registerUser(data)
      navigate(from, { replace: true })
    } catch (e) {
      setError('root', { message: e?.message || 'Registration failed' })
    }
  }

  return (
    <>
      <Helmet><title>Create Account | Chipade Saraf</title></Helmet>

      <div className="min-h-screen grid lg:grid-cols-2">
        <div className="hidden lg:block relative overflow-hidden bg-dark">
          <img
            src="https://images.unsplash.com/photo-1573408301185-9519f94f97f3?w=900&auto=format&fit=crop&q=80"
            alt="Luxury jewellery"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark/80 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center p-12">
            <Logo className="text-cream mb-8" />
            <h2 className="font-playfair text-4xl text-cream font-light leading-tight mb-4">
              Join the world of<br />
              <em className="text-gold-400">Chipade Saraf</em>
            </h2>
            <p className="font-cormorant text-xl text-cream/40 italic">
              Exclusive access to new collections, early launches & member-only offers.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center p-8 bg-cream dark:bg-dark overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md py-8"
          >
            <div className="lg:hidden mb-8">
              <Logo className="text-dark dark:text-cream" />
            </div>

            <p className="label-luxury mb-3">Start Your Journey</p>
            <h1 className="font-playfair text-3xl text-dark dark:text-cream mb-8">Create Account</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'firstName', label: 'First Name' },
                  { name: 'lastName',  label: 'Last Name'  },
                ].map(({ name, label }) => (
                  <div key={name}>
                    <label className="font-poppins text-[10px] tracking-widest uppercase text-dark/40 dark:text-cream/40 block mb-1.5">
                      {label}
                    </label>
                    <input
                      {...register(name, { required: `${label} is required` })}
                      className="input-luxury border-b-2 border-dark/20 dark:border-cream/20 focus:border-gold-500 py-3 w-full"
                    />
                    {errors[name] && <p className="font-inter text-xs text-red-400 mt-1">{errors[name].message}</p>}
                  </div>
                ))}
              </div>

              {[
                { name: 'email', label: 'Email Address', type: 'email', validation: { required: 'Email required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } } },
                { name: 'phone', label: 'Mobile Number', type: 'tel', validation: { required: 'Phone required', minLength: { value: 10, message: 'Invalid phone' } } },
              ].map(({ name, label, type, validation }) => (
                <div key={name}>
                  <label className="font-poppins text-[10px] tracking-widest uppercase text-dark/40 dark:text-cream/40 block mb-1.5">
                    {label}
                  </label>
                  <input
                    {...register(name, validation)}
                    type={type}
                    className="input-luxury border-b-2 border-dark/20 dark:border-cream/20 focus:border-gold-500 py-3 w-full"
                  />
                  {errors[name] && <p className="font-inter text-xs text-red-400 mt-1">{errors[name].message}</p>}
                </div>
              ))}

              <div>
                <label className="font-poppins text-[10px] tracking-widest uppercase text-dark/40 dark:text-cream/40 block mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    {...register('password', {
                      required: 'Password required',
                      minLength: { value: 8, message: 'Min 8 characters' },
                    })}
                    type={showPwd ? 'text' : 'password'}
                    className="input-luxury border-b-2 border-dark/20 dark:border-cream/20 focus:border-gold-500 py-3 w-full pr-10"
                  />
                  <button type="button" onClick={() => setShowPwd(s => !s)}
                    className="absolute right-0 bottom-3 text-dark/40 dark:text-cream/40 hover:text-gold-500">
                    {showPwd ? <RiEyeOffLine /> : <RiEyeLine />}
                  </button>
                </div>
                {errors.password && <p className="font-inter text-xs text-red-400 mt-1">{errors.password.message}</p>}
              </div>

              <div>
                <label className="font-poppins text-[10px] tracking-widest uppercase text-dark/40 dark:text-cream/40 block mb-1.5">
                  Confirm Password
                </label>
                <input
                  {...register('confirmPassword', {
                    required: 'Please confirm password',
                    validate: v => v === watch('password') || 'Passwords do not match',
                  })}
                  type="password"
                  className="input-luxury border-b-2 border-dark/20 dark:border-cream/20 focus:border-gold-500 py-3 w-full"
                />
                {errors.confirmPassword && <p className="font-inter text-xs text-red-400 mt-1">{errors.confirmPassword.message}</p>}
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input {...register('terms', { required: 'Please accept terms' })} type="checkbox" className="accent-gold-500 mt-0.5" />
                <span className="font-inter text-xs text-dark/50 dark:text-cream/50 leading-relaxed">
                  I agree to Chipade Saraf's{' '}
                  <Link to="/terms" className="text-gold-500">Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="/privacy-policy" className="text-gold-500">Privacy Policy</Link>
                </span>
              </label>
              {errors.terms && <p className="font-inter text-xs text-red-400">{errors.terms.message}</p>}

              {errors.root && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="font-inter text-sm text-red-500">{errors.root.message}</p>
                </div>
              )}

              <button type="submit" disabled={isSubmitting} className="btn-gold justify-center">
                {isSubmitting ? 'Creating Account…' : 'Create Account'}
              </button>
            </form>

            <p className="mt-6 text-center font-inter text-sm text-dark/50 dark:text-cream/50">
              Already have an account?{' '}
              <Link to="/auth/login" className="text-gold-500 hover:text-gold-600 font-medium">Sign In</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  )
}
