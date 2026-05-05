import { Outlet, NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function AppLayout() {
  const { user, toggleTheme, theme } = useAuth()
  return (
    <div>
      <header className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="text-xl font-bold">DailyCart</span>
            {user && (
              <nav className="hidden md:flex items-center gap-4 text-sm">
                <NavLink to="/dashboard">Dashboard</NavLink>
                <NavLink to="/products">Products</NavLink>
                <NavLink to="/products/add">Add Product</NavLink>
                <NavLink to="/sales/record">Record Sale</NavLink>
                <NavLink to="/invoices">Invoices</NavLink>
                <NavLink to="/ai-insights">AI Insights</NavLink>
                <NavLink to="/reports">Reports</NavLink>
                <NavLink to="/notifications">Notifications</NavLink>
                <NavLink to="/ai-assistant">AI Assistant</NavLink>
                {/* <NavLink to="/settings">Settings</NavLink> */}
              </nav>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button className="btn" onClick={toggleTheme}>{theme === 'dark' ? '🌙' : '☀️'}</button>
            <NavLink className="btn" to="/logout">Logout</NavLink>
          </div>
        </div>
      </header>
      <main className="container py-6">
        <Outlet />
      </main>
    </div>
  )
}
