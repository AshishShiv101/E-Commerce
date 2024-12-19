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