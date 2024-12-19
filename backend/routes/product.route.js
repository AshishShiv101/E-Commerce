import express from 'express'
import { adminRoute, protectRoute } from '../middleware/auth.middleware'
import { createProduct, deleteProduct, getAllProducts, getFeaturedProducts, getProductsByCategory, getRecommendationProducts, toggleFeaturedProduct } from '../controllers/product.controller'

const router = express.Router()

router.get("/",protectRoute,adminRoute, getAllProducts)
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct)

router.get("/featured",getFeaturedProducts)
router.get("/category/:category", getProductsByCategory)
router.get("/recommendation",getRecommendationProducts)
router.post("/products",adminRoute,adminRoute,createProduct)
router.delete("/:id",protectRoute,adminRoute,deleteProduct)
export default router