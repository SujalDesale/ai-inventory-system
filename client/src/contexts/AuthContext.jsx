import { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api.js'

const Ctx = createContext()

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'))
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'))

  useEffect(() => { token ? localStorage.setItem('token', token) : localStorage.removeItem('token') }, [token])
  useEffect(() => { user ? localStorage.setItem('user', JSON.stringify(user)) : localStorage.removeItem('user') }, [user])

  const login = async (payload) => {
    const { data } = await api.post('/auth/login', payload)
    setToken(data.token); setUser(data.user); return data
  }
  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload)
    setToken(data.token); setUser(data.user); return data
  }
  const logout = () => { setToken(''); setUser(null) }

  return <Ctx.Provider value={{ token, user, login, register, logout, theme, toggleTheme }}>{children}</Ctx.Provider>
}

export function useAuth(){ return useContext(Ctx) }
