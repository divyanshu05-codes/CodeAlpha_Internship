const jwt = require("jsonwebtoken");
const User = require("../models/user.model");


// ==========================================
// CREATE JWT TOKEN
// ==========================================

const createToken = (userId) => {
    return jwt.sign(
        {
            userId: userId.toString(),
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d",
        }
    );
};


// ==========================================
// COOKIE OPTIONS
// ==========================================

const getCookieOptions = () => {
    const isProduction =
        process.env.NODE_ENV === "production";

    return {
        httpOnly: true,

        secure: isProduction,

        sameSite: isProduction
            ? "none"
            : "lax",

        maxAge: 7 * 24 * 60 * 60 * 1000,
    };
};


// ==========================================
// REGISTER USER
// POST /api/auth/register
// ==========================================

const registerUser = async (req, res) => {
    try {
        const {
            name,
            username,
            email,
            password,
        } = req.body || {};

        // Validate required fields

        if (
            typeof name !== "string" ||
            typeof username !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }


        // Clean values

        const cleanName = name.trim();

        const normalizedUsername = username
            .trim()
            .toLowerCase();

        const normalizedEmail = email
            .trim()
            .toLowerCase();


        // Validate empty values

        if (
            !cleanName ||
            !normalizedUsername ||
            !normalizedEmail ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }


        // Validate name

        if (cleanName.length < 2) {
            return res.status(400).json({
                success: false,
                message:
                    "Name must contain at least 2 characters",
            });
        }


        // Validate username

        if (normalizedUsername.length < 3) {
            return res.status(400).json({
                success: false,
                message:
                    "Username must contain at least 3 characters",
            });
        }


        // Validate password

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must be at least 6 characters",
            });
        }


        // Check existing email or username

        const existingUser = await User.findOne({
            $or: [
                {
                    email: normalizedEmail,
                },
                {
                    username: normalizedUsername,
                },
            ],
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message:
                    "Email or username already exists",
            });
        }


        // Create user

        const user = await User.create({
            name: cleanName,
            username: normalizedUsername,
            email: normalizedEmail,
            password,
        });


        // Create authentication token

        const token = createToken(user._id);


        // Store token in cookie

        res.cookie(
            "token",
            token,
            getCookieOptions()
        );


        return res.status(201).json({
            success: true,

            message: "Registration successful",

            user: {
                _id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                bio: user.bio || "",
                profileImage:
                    user.profileImage || "",
            },
        });
    } catch (error) {
        console.error("Register Error:", error);


        // Handle MongoDB duplicate key error

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message:
                    "Email or username already exists",
            });
        }


        // Handle Mongoose validation errors

        if (error.name === "ValidationError") {
            const messages = Object.values(
                error.errors
            ).map((item) => item.message);

            return res.status(400).json({
                success: false,
                message: messages.join(", "),
            });
        }


        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


// ==========================================
// LOGIN USER
// POST /api/auth/login
// ==========================================

const loginUser = async (req, res) => {
    try {
        const {
            email,
            password,
        } = req.body || {};


        if (
            typeof email !== "string" ||
            typeof password !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Email and password are required",
            });
        }


        const normalizedEmail = email
            .trim()
            .toLowerCase();


        if (!normalizedEmail || !password) {
            return res.status(400).json({
                success: false,
                message:
                    "Email and password are required",
            });
        }


        // Password must be explicitly selected
        // if user.model.js uses select: false

        const user = await User.findOne({
            email: normalizedEmail,
        }).select("+password");


        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }


        const passwordIsCorrect =
            await user.comparePassword(password);


        if (!passwordIsCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }


        const token = createToken(user._id);


        res.cookie(
            "token",
            token,
            getCookieOptions()
        );


        return res.status(200).json({
            success: true,

            message: "Login successful",

            user: {
                _id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                bio: user.bio || "",
                profileImage:
                    user.profileImage || "",
            },
        });
    } catch (error) {
        console.error("Login Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


// ==========================================
// LOGOUT USER
// POST /api/auth/logout
// ==========================================

const logoutUser = async (req, res) => {
    try {
        const isProduction =
            process.env.NODE_ENV === "production";


        res.clearCookie("token", {
            httpOnly: true,

            secure: isProduction,

            sameSite: isProduction
                ? "none"
                : "lax",
        });


        return res.status(200).json({
            success: true,
            message: "Logout successful",
        });
    } catch (error) {
        console.error("Logout Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


// ==========================================
// GET CURRENT USER
// GET /api/auth/get-me
// ==========================================

const getCurrentUser = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,

            user: {
                _id: req.user._id,
                name: req.user.name,
                username: req.user.username,
                email: req.user.email,
                bio: req.user.bio || "",
                profileImage:
                    req.user.profileImage || "",
            },
        });
    } catch (error) {
        console.error("Get Current User Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
};