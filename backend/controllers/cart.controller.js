import Product from '../models/product.mode.js'

export const getCartProducts = async (req, res, next) => {
    try {
        const products = await Product.find({_id:{$in:req.user.cartItems}})
    } catch (error) {
        
    }
}
export const addToCart = async (req, res, next) => {
    try {
        const {productId} = req.body;
        const user = req.user

        const existingItem = user.cartItems.find(item => item.id === productId)
        if(existingItem) {
        existingItem.quantity +=1;
        }
        else{
            user.cartItems.push(productId);
        }
        await user.save();
        res.json(user.cartItems)
    } 
    catch (error) {
        console.log("error in addtocart", error)
        res.status(500).json({message: "Server error", error: error.message})
    }
}
export const removeAllFromCart = async (req, res, next) => {
    try {
        const { productId } = req.body;
        const user = req.user

        if (!productId) {
            user.cartItems = []
        }
        else {
            user.cartItems = user.cartItems.filter((item) => item.id !== productId)
        }
        await user.save();
        res.json(user.cartItems)
    }
    catch (error) {
        console.log("error in removeAllFromCart", error)
        res.status(500).json({ message: "Server error", error: error.message })
    }
}


export const updateQuantity = async (req, res, next) => {
    try {
        const {id: productId} = req.params;
        const {quantity} = req.body;
        const user = req.user
        const existingItem = user.cartItems.find(item => item.id !== productId)
       if(existingItem ){
        if(quantity === 0 ){
            user.cartItems = user.cartItems.filter((item) => item.id!== productId)
            await user.save();
            return res.json(user.cartItems)
        }
        existingItem.quantity = quantity;
        await user.save();
        res.json(user.cartItems)
       }
       else{
        res.status(404).json({message:"Product not found"})
       }
    }
    catch (error) {
        console.log("error in updateQuantity", error)
        res.status(500).json({ message: "Server error", error: error.message})   
    }
}