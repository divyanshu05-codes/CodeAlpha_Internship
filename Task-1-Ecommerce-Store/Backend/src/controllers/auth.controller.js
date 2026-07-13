const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d",
        }
    );
};

const sendTokenCookie = (res, token) => {
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must contain at least 6 characters",
            });
        }

        const existingUser = await User.findOne({
            email: email.toLowerCase(),
        });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists",
            });
        }

        const user = await User.create({
            name,
            email,
            password,
        });

        const token = generateToken(user._id);

        sendTokenCookie(res, token);

        return res.status(201).json({
            message: "Registration successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Register Error:", error);

        return res.status(500).json({
            message: "Server error while registering user",
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase(),
        }).select("+password");

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const isPasswordCorrect = await user.comparePassword(password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const token = generateToken(user._id);

        sendTokenCookie(res, token);

        return res.status(200).json({
            message: "Login successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Login Error:", error);

        return res.status(500).json({
            message: "Server error while logging in",
        });
    }
};

const logoutUser = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return res.status(200).json({
        message: "Logout successful",
    });
};

const getMe = async (req, res) => {
    try {
        return res.status(200).json({
            user: {
                _id: req.user._id,
                name: req.user.name,
                email: req.user.email,
            },
        });
    } catch (error) {
        console.error("Get Me Error:", error);

        return res.status(500).json({
            message: "Server error while getting user information",
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getMe,
};