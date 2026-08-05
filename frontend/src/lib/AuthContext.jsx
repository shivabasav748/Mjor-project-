import React, { createContext, useContext, useEffect, useState } from 'react'
import { api } from './api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('viq_token')
    if (!token) {
      setLoading(false)
      return
    }
    api
      .me()
      .then(setUser)
      .catch(() => localStorage.removeItem('viq_token'))
      .finally(() => setLoading(false))
  }, [])

  async function login(email, password) {
    const { access_token } = await api.login({ email, password })
    localStorage.setItem('viq_token', access_token)
    const me = await api.me()
    setUser(me)
  }

  async function signup(full_name, email, password) {
    const { access_token } = await api.signup({ full_name, email, password })
    localStorage.setItem('viq_token', access_token)
    const me = await api.me()
    setUser(me)
  }

  function logout() {
    localStorage.removeItem('viq_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
