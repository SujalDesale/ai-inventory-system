import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import { deduct } from '../controllers/usageController.js'
const r = Router()
r.use(auth)
r.post('/deduct', deduct)
export default r
