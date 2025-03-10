import express from 'express'
import { adminRoute, protectRoute } from '../middleware/auth.middleware.js'
import { getAnalytics } from '../controllers/analytics.controller.js'
const router = express.Router()

router.get('/', protectRoute, getAnalytics)

export default router 