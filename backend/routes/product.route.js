import express from 'express'
import { protectRoute } from '../middleware/auth.middleware'
import { getAllProducts, getFeaturedProducts } from '../controllers/product.controller'

const router = express.Router()

router.get("/",protectRoute,adminRoute, getAllProducts)
router.get("/products",getFeaturedProducts)

export default router