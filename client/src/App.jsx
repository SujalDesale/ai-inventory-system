import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './layouts/AppLayout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'

import Dashboard from './pages/Dashboard.jsx'
import Products from './pages/Products.jsx'
import AddProduct from './pages/AddProduct.jsx'
import RecordSale from './pages/RecordSale.jsx'
import InvoiceDetails from './pages/InvoiceDetails.jsx'
import AIInsights from "./pages/AIInsights";
import Reports from './pages/Reports.jsx'
import Notifications from './pages/Notifications.jsx'
import AIAssistant from './pages/AIAssistant.jsx'
import Settings from './pages/Settings.jsx'
import Logout from './pages/Logout.jsx'
import EditProduct from "./pages/EditProduct";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/add" element={<AddProduct />} />
          <Route path="/sales/record" element={<RecordSale />} />
          <Route path="/invoices" element={<InvoiceDetails />} />
          <Route path="/ai-insights" element={<AIInsights />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/products/edit/:id" element={<EditProduct />} />
        </Route>
      </Route>

      <Route path="*" element={<div className="container py-6">404</div>} />
    </Routes>
  )
}
