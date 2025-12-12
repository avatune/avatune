import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
}

const Input = ({ label, hint, id, className = '', ...props }: InputProps) => {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block mb-2 font-medium text-slate-300">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:border-pink-400 focus:bg-white/15 disabled:opacity-50 ${className}`}
        {...props}
      />
      {hint && <p className="mt-2 text-sm text-slate-400">{hint}</p>}
    </div>
  )
}

export default Input
