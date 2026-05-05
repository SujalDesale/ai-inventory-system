import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import { list, create } from '../controllers/notificationController.js'
const r = Router()
r.use(auth)
r.get('/', list)
r.post('/', create)
export default r
