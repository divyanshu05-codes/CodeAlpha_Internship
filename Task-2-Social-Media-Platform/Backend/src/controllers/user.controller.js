const User = require("../models/user.model");
const Post = require("../models/post.model");


// GET ALL USERS
// GET /api/users

const getUsers = async (req, res) => {
    try {
        const users = await User.find({
            _id: { $ne: req.user._id },
        }).select(
            "name username bio profileImage followers following"
        );

        return res.status(200).json({
            success: true,
            users,
        });
    } catch (error) {
        console.error("Get Users Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


// GET USER PROFILE
// GET /api/users/:userId

const getUserProfile = async (req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({
            username: username.trim().toLowerCase(),
        }).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const posts = await Post.find({
            author: user._id,
        })
            .populate(
                "author",
                "name username profileImage"
            )
            .populate(
                "comments.user",
                "name username profileImage"
            )
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            user,
            posts,
        });
    } catch (error) {
        console.error("Get Profile Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// FOLLOW / UNFOLLOW USER
// PUT /api/users/:userId/follow

const toggleFollow = async (req, res) => {
    try {
        const currentUserId =
            req.user._id.toString();

        const targetUserId =
            req.params.userId;

        if (currentUserId === targetUserId) {
            return res.status(400).json({
                success: false,
                message: "You cannot follow yourself",
            });
        }

        const currentUser = await User.findById(
            currentUserId
        );

        const targetUser = await User.findById(
            targetUserId
        );

        if (!targetUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const alreadyFollowing =
            currentUser.following.some(
                (userId) =>
                    userId.toString() ===
                    targetUserId
            );

        if (alreadyFollowing) {
            currentUser.following =
                currentUser.following.filter(
                    (userId) =>
                        userId.toString() !==
                        targetUserId
                );

            targetUser.followers =
                targetUser.followers.filter(
                    (userId) =>
                        userId.toString() !==
                        currentUserId
                );
        } else {
            currentUser.following.push(
                targetUser._id
            );

            targetUser.followers.push(
                currentUser._id
            );
        }

        await Promise.all([
            currentUser.save(),
            targetUser.save(),
        ]);

        return res.status(200).json({
            success: true,

            message: alreadyFollowing
                ? "User unfollowed successfully"
                : "User followed successfully",

            following: !alreadyFollowing,

            followersCount:
                targetUser.followers.length,

            followingCount:
                currentUser.following.length,
        });
    } catch (error) {
        console.error("Follow Error:", error);

        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


module.exports = {
    getUsers,
    getUserProfile,
    toggleFollow,
};