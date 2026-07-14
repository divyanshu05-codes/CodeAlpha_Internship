const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [
                true,
                "Name is required",
            ],
            trim: true,
            minlength: [
                2,
                "Name must contain at least 2 characters",
            ],
        },


        username: {
            type: String,
            required: [
                true,
                "Username is required",
            ],
            unique: true,
            trim: true,
            lowercase: true,
            minlength: [
                3,
                "Username must contain at least 3 characters",
            ],
        },


        email: {
            type: String,
            required: [
                true,
                "Email is required",
            ],
            unique: true,
            trim: true,
            lowercase: true,
        },


        password: {
            type: String,
            required: [
                true,
                "Password is required",
            ],
            minlength: [
                6,
                "Password must be at least 6 characters",
            ],

            select: false,
        },


        bio: {
            type: String,
            default: "",
            trim: true,
            maxlength: [
                160,
                "Bio cannot exceed 160 characters",
            ],
        },


        profileImage: {
            type: String,
            default: "",
            trim: true,
        },

        followers: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
],

following: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
],
    },
    {
        timestamps: true,
    }
);


// ==========================================
// HASH PASSWORD BEFORE SAVING
// ==========================================

userSchema.pre(
    "save",
    async function () {
        if (!this.isModified("password")) {
            return;
        }

        this.password = await bcrypt.hash(
            this.password,
            12
        );
    }
);


// ==========================================
// COMPARE PASSWORD
// ==========================================

userSchema.methods.comparePassword =
    async function (candidatePassword) {
        return bcrypt.compare(
            candidatePassword,
            this.password
        );
    };


module.exports = mongoose.model(
    "User",
    userSchema
);