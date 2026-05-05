// import { useState } from 'react'
// import { useAuth } from '../../contexts/AuthContext.jsx'
// import { useNavigate } from 'react-router-dom'

// export default function Register() {
//   const { register } = useAuth()
//   const nav = useNavigate()
//   const [form, setForm] = useState({
//     name: '',
//     organization: '',
//     email: '',
//     phone: '',
//     role: 'owner',
//     type: 'store',
//     password: ''
//   })
//   const [err, setErr] = useState('')

//   const submit = async (e) => {
//     e.preventDefault()
//     try {
//       await register(form)
//       nav('/dashboard', { replace: true })
//     } catch (e) {
//       setErr(e?.response?.data?.message || 'Register failed')
//     }
//   }

//   return (
//     <div className="container mx-auto py-10 max-w-xl">
//       <form 
//         onSubmit={submit} 
//         className="bg-white shadow-lg rounded-2xl p-6 grid gap-4 border"
//       >
//         <h1 className="text-2xl font-semibold text-gray-800">Create Account</h1>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="label">Name</label>
//             <input 
//               className="input border rounded-md w-full p-2"
//               value={form.name} 
//               onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
//             />
//           </div>

//           <div>
//             <label className="label">Organization</label>
//             <input 
//               className="input border rounded-md w-full p-2"
//               value={form.organization} 
//               onChange={e => setForm(f => ({ ...f, organization: e.target.value }))} 
//             />
//           </div>

//           <div>
//             <label className="label">Email</label>
//             <input 
//               className="input border rounded-md w-full p-2"
//               value={form.email} 
//               onChange={e => setForm(f => ({ ...f, email: e.target.value }))} 
//             />
//           </div>

//           <div>
//             <label className="label">Phone</label>
//             <input 
//               className="input border rounded-md w-full p-2"
//               value={form.phone} 
//               onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} 
//             />
//           </div>

//           <div>
//             <label className="label">Role</label>
//             <select 
//               className="input border rounded-md w-full p-2"
//               value={form.role} 
//               onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
//               <option>owner</option>
//               <option>staff</option>
//               <option>family</option>
//             </select>
//           </div>

//           <div>
//             <label className="label">Type</label>
//             <select 
//               className="input border rounded-md w-full p-2"
//               value={form.type} 
//               onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
//               <option>store</option>
//               <option>family</option>
//             </select>
//           </div>

//           <div className="md:col-span-2">
//             <label className="label">Password</label>
//             <input 
//               type="password"
//               className="input border rounded-md w-full p-2"
//               value={form.password} 
//               onChange={e => setForm(f => ({ ...f, password: e.target.value }))} 
//             />
//           </div>
//         </div>

//         {err && <div className="text-red-600 text-sm">{err}</div>}
        
//         <button className="btn btn-primary w-full">Register</button>
//       </form>
//     </div>
//   )
// }


import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const { register } = useAuth()
  const nav = useNavigate()
  const [form, setForm] = useState({
    name: '',
    organization: '',
    email: '',
    phone: '',
    role: 'owner',
    type: 'store',
    password: ''
  })
  const [err, setErr] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    try {
      await register(form)
      nav('/dashboard', { replace: true })
    } catch (e) {
      setErr(e?.response?.data?.message || 'Register failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <form
        onSubmit={submit}
        className="bg-white/10 backdrop-blur-lg shadow-xl rounded-2xl p-8 w-full max-w-2xl border border-white/20"
      >
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Create Account</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-200 mb-1">Name</label>
            <input
              className="w-full p-2 rounded-md bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter your name"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-200 mb-1">Organization</label>
            <input
              className="w-full p-2 rounded-md bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter organization"
              value={form.organization}
              onChange={e => setForm(f => ({ ...f, organization: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-200 mb-1">Email</label>
            <input
              type="email"
              className="w-full p-2 rounded-md bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-200 mb-1">Phone</label>
            <input
              className="w-full p-2 rounded-md bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter phone"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-200 mb-1">Role</label>
            <select
              className="w-full p-2 rounded-md bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={form.role}
              onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
            >
              <option className="text-black">owner</option>
              <option className="text-black">staff</option>
              <option className="text-black">family</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-200 mb-1">Type</label>
            <select
              className="w-full p-2 rounded-md bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={form.type}
              onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
            >
              <option className="text-black">store</option>
              <option className="text-black">family</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-gray-200 mb-1">Password</label>
            <input
              type="password"
              className="w-full p-2 rounded-md bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            />
          </div>
        </div>

        {err && <div className="text-red-400 text-sm mt-2">{err}</div>}

        <button
          type="submit"
          className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition"
        >
          Register
        </button>
      </form>
    </div>
  )
}
