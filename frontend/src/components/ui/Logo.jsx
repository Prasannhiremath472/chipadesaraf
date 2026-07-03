import { APP_NAME } from '@/constants'

export default function Logo({ className = '' }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Geometric diamond mark */}
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <polygon
          points="14,2 26,9 26,21 14,28 2,21 2,9"
          stroke="#C8A165"
          strokeWidth="1.2"
          fill="none"
        />
        <polygon
          points="14,8 20,12 20,18 14,22 8,18 8,12"
          stroke="#C8A165"
          strokeWidth="0.6"
          fill="none"
          opacity="0.5"
        />
      </svg>

      {/* Brand name */}
      <span className="font-cormorant text-2xl font-light tracking-[0.15em]">
        {APP_NAME}
        <span className="text-gold-500">è</span>
      </span>
    </div>
  )
}
