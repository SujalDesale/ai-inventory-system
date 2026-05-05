import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import logger from './utils/logger.js'

import authRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productRoutes.js'
import saleRoutes from './routes/saleRoutes.js'
import invoiceRoutes from './routes/invoiceRoutes.js'
import usageRoutes from './routes/usageRoutes.js'
import reportRoutes from './routes/reportRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'
import aiRoutes from './routes/aiRoutes.js'

const app = express()
app.use(cors({ origin: process.env.CLIENT_URL?.split(',') || '*', credentials: true }))
app.use(express.json())
app.use(morgan('dev'))

app.get('/api/health', (req,res)=>res.json({ ok:true, time:new Date().toISOString() }))

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/sales', saleRoutes)
app.use('/api/invoices', invoiceRoutes)
app.use('/api/usage', usageRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/ai', aiRoutes)

app.use((req,res)=>res.status(404).json({ message:'Route not found' }))
app.use((err, req, res, next) => {
  logger.error(err)
  res.status(err.status || 500).json({ message: err.message || 'Server error' })
})
export default app
