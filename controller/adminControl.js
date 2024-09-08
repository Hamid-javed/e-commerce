const Category = require("../model/categorySchema");
const Cart = require("../model/cartSchema");
const Order = require("../model/orderSchema");
const Product = require("../model/productSchema");
const User = require("../model/userSchema");

exports.addProduct = async (req, res) => {
    try {
        const { name, description, color, size, stock, price, image, category } = req.body;
        if (!name) {
            return res.status(400).json({ error: "Product name is required." });
        }
        if (!description) {
            return res.status(400).json({ error: "Product description is required." });
        }
        if (!color) {
            return res.status(400).json({ error: "Product color is required." });
        }
        if (!size) {
            return res.status(400).json({ error: "Product size is required." });
        }
        if (!stock) {
            return res.status(400).json({ error: "Product stock is required." });
        }
        if (!price) {
            return res.status(400).json({ error: "Product price is required." });
        }
        if (!image) {
            return res.status(400).json({ error: "Product image URL is required." });
        }
        const variant = {
            color: color,
            size: size,
            stock: stock,
            price: price,
            image: image
        }
        await Product.create({ name, description, category, variants: [variant] })
        res.status(200).json({ message: "Product added successfully!" })
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

exports.deleteProdct = async (req, res) => {
    try {
        const { productId } = req.params;
        if (!productId) {
            return res.status(404).json({ message: "No productId Found!" })
        }
        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).json({ message: "No product Found!" })
        }
        await Product.findOneAndDelete(product)
        res.status(200).json({message: "Product deleted successfully!"})
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
}
