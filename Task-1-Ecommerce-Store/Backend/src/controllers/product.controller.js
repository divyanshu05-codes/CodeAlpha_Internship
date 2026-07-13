const mongoose = require("mongoose");
const Product = require("../models/product.model");

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });

        return res.status(200).json({
            count: products.length,
            products,
        });
    } catch (error) {
        console.error("Get Products Error:", error);

        return res.status(500).json({
            message: "Server error while getting products",
        });
    }
};

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid product ID",
            });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        return res.status(200).json({
            product,
        });
    } catch (error) {
        console.error("Get Product Error:", error);

        return res.status(500).json({
            message: "Server error while getting product",
        });
    }
};

const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            image,
            category,
            stock,
        } = req.body;

        if (
            !name ||
            !description ||
            price === undefined ||
            !image ||
            !category ||
            stock === undefined
        ) {
            return res.status(400).json({
                message: "All product fields are required",
            });
        }

        const product = await Product.create({
            name,
            description,
            price,
            image,
            category,
            stock,
        });

        return res.status(201).json({
            message: "Product created successfully",
            product,
        });
    } catch (error) {
        console.error("Create Product Error:", error);

        return res.status(500).json({
            message: "Server error while creating product",
        });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
};