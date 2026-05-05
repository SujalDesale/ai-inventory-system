import { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext.jsx'
export default function Logout(){
  const { logout } = useAuth()
  useEffect(()=>{ logout() }, [])
  return <div className="card">Logged out.</div>
}
