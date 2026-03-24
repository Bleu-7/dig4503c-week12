import { useState } from 'react'
import { register } from '@/lib/authService'
import { useAuth } from '@/context/AuthContext'

function SignUpForm() {
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    try {
      register(username, password)
    } catch (err) {
      setError(err.message)
      return
    }
    try {
      login(username, password)
    } catch {
      setError('Account created but sign-in failed. Please log in manually.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold text-zinc-100">Create Account</h2>
      <div className="space-y-1.5">
        <label htmlFor="signup-username" className="block text-xs font-medium uppercase tracking-wider text-zinc-400">
          Username
        </label>
        <input
          id="signup-username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Choose a username"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 transition-colors focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="signup-password" className="block text-xs font-medium uppercase tracking-wider text-zinc-400">
          Password
        </label>
        <input
          id="signup-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 6 characters"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 transition-colors focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        className="w-full rounded-lg bg-violet-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-500"
      >
        Create Account
      </button>
    </form>
  )
}

export default SignUpForm
