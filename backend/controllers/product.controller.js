import cloudinary from "../lib/cloudinary.js";
import Product from "../models/product.model.js"
import redis from "redis"
export const getAllProducts = async(req,res) =>{
    try {
        const products = await Product.find({});
        res.json({products})
    } catch (error) {
        console.log("Error in getAllProducts controller",error.message);
        res.status(500).json({ message:"Server error", error: error.message });
    }
}

export const getFeaturedProducts = async(req,res) =>{
    try {
        let featuredProducts = await redis.get("featured_products")
        if(featuredProducts){
            return res.json(JSON.parse(featuredProducts))
        }
        featuredProducts = await Product.find({ isFeatured: true }).lean()
        if(!featuredProducts){
            return res.status(404).json({ message: "No featured products found" })
        }

        await redis.set("featured_products",JSON.stringify(featuredProducts))
        res.json(featuredProducts)
    } catch (error) {
        console.log("Error in getFeatureProducts controller", error.message)
        res.status(500).json({ message: "Server error", error: error.message });
    }
}


export const createProduct = async(req,res) =>{
    try {
        const {name,description, price,image,category} = req.body;
        let cloudinaryResponse = null
        
        if(image){
            await cloudinary.uploader.uploadImage(image,{folder:"products"})
        }
        const product = await Product.create({
            name,
            description,
            price,
            image: cloudinaryResponse? cloudinaryResponse.secure_url : "",
            category
        })
        res.status(201).json( product )
    } catch (error) {
        console.log("error in createProduct",error.message);

    }
}

export const deleteProduct = async(req,res) =>{
    try {
        const product = await Prouduct.findById(req.params.id)

        if(!product){
            return res.status(404).json({ message: "No featured products found" })
        }
        if(product.image){
            const publicId = product.image.split("/").pop().split(".")[0];
            try {
                await cloudinary.uploader.destroy(`products/${publicId}`)
                console.log("deleted image from cloudinary")
            } catch (error) {
                console.log("error deleting image ", error)
            }
        }

        await Product.findByIdAndDelete(req.params.id)

        res.json({ message: "Product deleted successfully" })
    } catch (error) {
        console.log("Error in deleteProduct", error.message)
        res.status(500).json({ message: "Server error", error: error.message });
    }
}


export const getRecommendationProducts = async (req, res) => {
    try {
        const products = await Product.aggregate([
            {
                $sample: { size: 3 }  // This will randomly sample 3 products
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    price: 1,
                    image: 1
                }
            }
        ]);

        res.json(products);
    } catch (error) {
        console.log("Error in getRecommendationProducts", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getProductsByCategory = async (req, res) => {
    const {category}= req.prams
    try {
        const products = await Product.find({category})
        res.json(products)
    } catch (error) {
        console.log("Error in get ProductsByCategory controller",error.message)
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const toggleFeaturedProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if(product){
            product.isFeatured =!product.isFeatured
            const updateProducts = await product.save();
            await updateFeaturedProductsCache()
            res.json(updateProducts)
        }else{
            res.status(404).json({message: "Product not found"})
        }
    } catch (error) {
        console.log("Error in toggleFeatureProduct controller ",error.message)
        res.status(500).json({message: "Server error", error: error.message });
    }
}


async function updateFeaturedProductsCache(){
    try {
        const featuredProducts = await Product.find({isFeatured : true}).lean()
        await redis.set("featured_products",JSON.stringify(featuredProducts))
    } catch (error) {
        console.log("error in update cache ")
    }
}