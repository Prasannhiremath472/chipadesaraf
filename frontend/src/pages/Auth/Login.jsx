import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { useAuth } from '@contexts/AuthContext'

export default function Login() {
  const [showPwd, setShowPwd] = useState(false)
  const { login } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const from      = location.state?.from?.pathname || '/'

  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm()

  const onSubmit = async (data) => {
    try {
      await login(data)
      navigate(from, { replace: true })
    } catch (e) {
      setError('root', { message: e?.message || 'Invalid credentials' })
    }
  }

  return (
    <>
      <Helmet><title>Sign In — Chipade Saraf</title></Helmet>

      <div className="min-h-screen grid lg:grid-cols-2">
        {/* Left visual */}
        <div className="hidden lg:flex flex-col relative overflow-hidden" style={{ backgroundColor: '#8B1A4A' }}>
          <img
            src="/images/imgi_5_111_jpg.jpg"
            alt="Chipade Saraf"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
          <div className="relative z-10 flex flex-col items-center justify-center h-full p-12 text-center">
            <img src="/images/imgi_1_CHIPADE_LOGO_PNG.png" alt="Chipade Saraf" className="h-40 w-auto object-contain mb-8" />
            <h2 className="font-serif text-3xl text-white leading-tight mb-3">
              Welcome Back
            </h2>
            <p className="font-sans text-gold-300 text-sm tracking-wide">
              Kolhapur's Golden Legacy Since 1904
            </p>
          </div>
        </div>

        {/* Right form */}
        <div className="flex items-center justify-center p-8 bg-brand-cream">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <div className="lg:hidden mb-8 flex justify-center">
              <img src="/images/imgi_1_CHIPADE_LOGO_PNG.png" alt="Chipade Saraf" className="h-24 w-auto" />
            </div>

            <p className="label-gold mb-2">Welcome Back</p>
            <h1 className="font-serif text-3xl text-brand-dark mb-8">Sign In</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              <div>
                <label className="block text-xs font-sans font-semibold tracking-widest uppercase text-gray-500 mb-1.5">
                  Email Address
                </label>
                <input
                  {...register('email', { required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } })}
                  type="email"
                  autoComplete="email"
                  className="input-base"
                  placeholder="you@example.com"
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-sans font-semibold tracking-widest uppercase text-gray-500 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    {...register('password', { required: 'Password is required' })}
                    type={showPwd ? 'text' : 'password'}
                    autoComplete="current-password"
                    className="input-base pr-10"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPwd(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gold-500">
                    {showPwd ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
              </div>

              <div className="flex justify-end">
                <Link to="/auth/forgot-password" className="text-xs text-gold-500 hover:text-gold-600 font-sans">
                  Forgot Password?
                </Link>
              </div>

              {errors.root && (
                <div className="p-3 bg-red-50 border border-red-200 text-sm text-red-600 font-sans">
                  {errors.root.message}
                </div>
              )}

              <button type="submit" disabled={isSubmitting} className="btn-crimson justify-center mt-2">
                {isSubmitting ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            <p className="mt-8 text-center font-sans text-sm text-gray-500">
              Don't have an account?{' '}
              <Link to="/auth/register" state={{ from: location.state?.from }}
                className="text-crimson-800 hover:text-gold-500 font-semibold transition-colors">
                Create Account
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  )
}
