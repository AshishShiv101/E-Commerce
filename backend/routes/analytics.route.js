import express from 'express';
import { adminRoute, protectRoute } from '../middleware/auth.middleware.js';
import { getAnalyticsData } from '../controllers/analytics.controller.js';

const router = express.Router();

router.get("/",protectRoute,adminRoute,async(req,res)=> {
    try {
        const analytics = await getAnalyticsData()

        const endDate = new Date()
        const startDate = new Date(endDate.getTime()- 7*24*60*60*1000)

        const dailySaledData = await getDailySalesData(startDate, endDate)

        res.json({
            getAnalyticsData,
            dailySalesData
        })
    } catch (error) {
        console.log("Error in analyticsroute:  ",error)
        res.status(500).json({message: "Server error", error: error.message})
    }
})

export default router;