const mongoose = require("mongoose");

const Follow = require("../models/follow.model");
const User = require("../models/user.model");

const toggleFollow = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID",
            });
        }

        if (userId === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: "You cannot follow yourself",
            });
        }

        const targetUser = await User.findById(userId);

        if (!targetUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const existingFollow = await Follow.findOne({
            follower: req.user._id,
            following: userId,
        });

        if (existingFollow) {
            await existingFollow.deleteOne();

            return res.status(200).json({
                success: true,
                message: "User unfollowed successfully",
                following: false,
            });
        }

        await Follow.create({
            follower: req.user._id,
            following: userId,
        });

        return res.status(200).json({
            success: true,
            message: "User followed successfully",
            following: true,
        });
    } catch (error) {
        console.error("Toggle Follow Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


const getFollowers = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID",
            });
        }

        const userExists = await User.exists({
            _id: userId,
        });

        if (!userExists) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const follows = await Follow.find({
            following: userId,
        })
            .populate(
                "follower",
                "name username bio profileImage"
            )
            .sort({ createdAt: -1 });

        const followers = follows.map(
            (follow) => follow.follower
        );

        return res.status(200).json({
            success: true,
            count: followers.length,
            followers,
        });
    } catch (error) {
        console.error("Get Followers Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


const getFollowing = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID",
            });
        }

        const userExists = await User.exists({
            _id: userId,
        });

        if (!userExists) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const follows = await Follow.find({
            follower: userId,
        })
            .populate(
                "following",
                "name username bio profileImage"
            )
            .sort({ createdAt: -1 });

        const following = follows.map(
            (follow) => follow.following
        );

        return res.status(200).json({
            success: true,
            count: following.length,
            following,
        });
    } catch (error) {
        console.error("Get Following Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


module.exports = {
    toggleFollow,
    getFollowers,
    getFollowing,
};