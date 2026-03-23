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
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      <div>
        <label htmlFor="signup-username">Username</label>
        <input
          id="signup-username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Choose a username"
        />
      </div>
      <div>
        <label htmlFor="signup-password">Password</label>
        <input
          id="signup-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 6 characters"
        />
      </div>
      {error && <p>{error}</p>}
      <button type="submit">Create Account</button>
    </form>
  )
}

export default SignUpForm
