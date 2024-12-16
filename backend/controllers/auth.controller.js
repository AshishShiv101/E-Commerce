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

        res.status(201).json({ user:{
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        }, message: "User created" });
    } catch (error) {
        res.status(500).json({ message:error.message});
    }
}

export const login = async (req, res) => {
    res.send('login');
}

export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refresh-token;
        if(refreshToken){
            const decoded = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET)
            await redis.del(`refresh_token:${decoded.userId}`)
        }

        res.clearCookie('access-token');
        res.clearCookie('refresh-token');
        res.json({ message: "Logged out" });
    } catch (error) {
        res.status(500).json({message:"Server Error",error:error.message})
    }
}