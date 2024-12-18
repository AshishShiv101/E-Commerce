import Redis from "ioredis";
import User from "../models/user.models.js"
import jwt from "jsonwebtoken"

const generateTokens = (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    return { accessToken, refreshToken}
}

const storeRefreshToken = async (userId, refreshToken) => {
    await redis.set(`refresh_token_${userId}`, refreshToken,"EX",7*24*60*60)
}
const setCookies = (res,accessToken,refreshToken) => {
    res.cookie('access-token', accessToken, { httpOnly: true,
        secure:process.env.NODE_ENV ==="production", 
        sameSite:"strict",
        maxAge: 15* 60 * 1000,
});
    res.cookie('refresh-token', refreshToken, {
         httpOnly: true,
         secure: process.env.NODE_ENV ==="production", 
         sameSite:"strict",
         maxAge: 7*24*60*60*1000,
        });
}
export const signup = async (req, res) => {
    const {email,password,name} = req.body
    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: "User already exists" })
        }
        const user = await User.create({ name, email, password });

        const [accessToken,refreshToken] = generateTokens(user._id)
        await storeRefreshToken(user._id, refreshToken);

        setCookies(res,accessToken,refreshToken)

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
    });

    } catch (error) {
        res.status(500).json({ message:error.message});
    }
}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({ email });

        if(user && (await user.completePassword(password))) {
            const {accessToken, refreshToken} = await storeRefreshToken(user._id)

            await storeRefreshToken(user._id, refreshToken)
            setCookies(res, accessToken, refreshToken)

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                message: "Logged in successfully"
            })
        } else{
            res.status(401).json({message: "Authentication failed"})
        }

    } catch (error) {
        console.log("Error in login controller",error.message)
        res.status(500).json({ message: error.message });
    }
}

export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refresh-token;
        if(refreshToken){
            const decoded = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET)
            await Redis.del(`refresh_token:${decoded.userId}`)
        }

        res.clearCookie('access-token');
        res.clearCookie('refresh-token');
        res.json({ message: "Logged out" });
    } catch (error) {
        console.log("Error in logout controller",error.message)
        res.status(500).json({message:"Server Error",error:error.message})
    }
}

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refresh-token;

        if(!refreshToken){
            return res.status(403).json({message: "Refresh token is missing"})
        }
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        const storedToken = await redis.get('refresh_token:${decoded.userId}');
        if(!storedToken || storedToken!== refreshToken){
            return res.status(403).json({message: "Refresh token is invalid"})
        }

        const accessToken = jwt.sign({userId: decoded.userId},process.env.ACCESS_TOKEN_SECRET,{expiresIn:"15m"})
        
        res.cookie("accessToken",accessToken,{
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite:"strict",
            maxAge: 15* 60 * 1000,
        })

        res.json({message:"token refreshed successfully"})
    } catch (error) {
        console.log("Error in refreshToken controller",error.message)
        res.status(500).json({message:"Server Error",error:error.message})
    }
}


//export const getProfile = async (req, res) =>