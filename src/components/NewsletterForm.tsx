'use client'

import { useState } from 'react'

interface NewsletterFormProps {
  source?: string
  variant?: 'default' | 'dark'
}

export default function NewsletterForm({ source = 'website', variant = 'dark' }: NewsletterFormProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, source }),
      })

      const data = await response.json()

      if (!response.ok) {
        setStatus('error')
        setMessage(data.error || 'Wystąpił błąd')
        return
      }

      setStatus('success')
      setMessage(data.message || 'Dziękujemy za zapis!')
      setEmail('')
    } catch {
      setStatus('error')
      setMessage('Wystąpił błąd połączenia')
    }
  }

  if (status === 'success') {
    return (
      <div className={`rounded-lg p-4 text-center ${
        variant === 'dark'
          ? 'bg-white/10 border border-white/20'
          : 'bg-green-50 border border-green-200'
      }`}>
        <div className={`font-medium ${variant === 'dark' ? 'text-white' : 'text-green-600'}`}>
          {message}
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Twój adres email"
          required
          disabled={status === 'loading'}
          className={`flex-1 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
            variant === 'dark'
              ? 'bg-white/10 border border-white/20 text-white placeholder-white/60'
              : 'border border-gray-300 text-gray-900 placeholder-gray-400'
          }`}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className={`px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 ${
            variant === 'dark'
              ? 'bg-white text-blue-600 hover:bg-gray-100'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {status === 'loading' ? 'Zapisuję...' : 'Zapisz się'}
        </button>
      </div>
      {status === 'error' && (
        <p className={`text-sm ${variant === 'dark' ? 'text-red-300' : 'text-red-600'}`}>
          {message}
        </p>
      )}
    </form>
  )
}
