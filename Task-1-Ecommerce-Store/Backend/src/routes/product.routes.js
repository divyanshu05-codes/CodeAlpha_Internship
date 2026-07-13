const express = require("express");

const {
    getAllProducts,
    getProductById,
    createProduct,
} = require("../controllers/product.controller");

const { authUser } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", getAllProducts);

router.get("/:id", getProductById);

router.post("/", authUser, createProduct);

module.exports = router;