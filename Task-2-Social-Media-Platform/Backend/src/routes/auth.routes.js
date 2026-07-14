const express = require("express");

const {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
} = require("../controllers/auth.controller");

const {
    protect,
} = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout", logoutUser);

router.get("/get-me", protect, getCurrentUser);

module.exports = router;