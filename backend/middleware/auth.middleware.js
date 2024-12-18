import jwt from "jsonwebtoken"
import User from "../models/user.models.js";

export const protectRoute = async (req,res,next) => {
    try {
        const accessToken = req.cookies.accessToken;
        if(!accessToken) {
            return res.status(401).json({message: "Access token is missing"})
        }
    try {
        const decoded = jwt.verify(accessToken, req.cookies.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decoded.userId).select("-password")
        if (!user) {
            return res.status(401).json({ message: "User not found" })
        }
        req.user = user

        next();
    } catch (error) {
        if(error.name==="TokenExpiredError"){
            return res.status(401).json({message: "Access token has expired"})
        }
        throw error;
    }
    } catch (error) {
        console.group("Error in protectRoute ",error.message)
        return res.status(500).json({message:"Unauthorized - invalid token"})      
    }
}


export const adminRoute = (req, res,next) => {
    if(!req.user && req.user.role === 'admin' ){
        next()
    }else{
        return res.status(403).json({message: "Unauthorized - admin only"}) 
    }

}