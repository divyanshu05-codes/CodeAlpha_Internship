const Post = require("../models/post.model");


// ==========================================
// CREATE POST
// POST /api/posts
// ==========================================

const createPost = async (req, res) => {
    try {
        const { content } = req.body || {};

        if (typeof content !== "string" || !content.trim()) {
            return res.status(400).json({
                success: false,
                message: "Post content is required",
            });
        }

        if (content.trim().length > 1000) {
            return res.status(400).json({
                success: false,
                message: "Post cannot exceed 1000 characters",
            });
        }

        const post = await Post.create({
            author: req.user._id,
            content: content.trim(),
        });

        await post.populate(
            "author",
            "name username profileImage"
        );

        return res.status(201).json({
            success: true,
            message: "Post created successfully",
            post,
        });
    } catch (error) {
        console.error("Create Post Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


// ==========================================
// GET ALL POSTS / FEED
// GET /api/posts
// ==========================================

const getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
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
            count: posts.length,
            posts,
        });
    } catch (error) {
        console.error("Get Posts Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


// ==========================================
// GET SINGLE POST
// GET /api/posts/:postId
// ==========================================

const getSinglePost = async (req, res) => {
    try {
        const post = await Post.findById(
            req.params.postId
        )
            .populate(
                "author",
                "name username profileImage"
            )
            .populate(
                "comments.user",
                "name username profileImage"
            );

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        return res.status(200).json({
            success: true,
            post,
        });
    } catch (error) {
        console.error("Get Single Post Error:", error);

        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid post ID",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


// ==========================================
// LIKE / UNLIKE POST
// PUT /api/posts/:postId/like
// ==========================================

const toggleLike = async (req, res) => {
    try {
        const post = await Post.findById(
            req.params.postId
        );

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        const userId = req.user._id.toString();

        const alreadyLiked = post.likes.some(
            (likeUserId) =>
                likeUserId.toString() === userId
        );

        if (alreadyLiked) {
            post.likes = post.likes.filter(
                (likeUserId) =>
                    likeUserId.toString() !== userId
            );
        } else {
            post.likes.push(req.user._id);
        }

        await post.save();

        return res.status(200).json({
            success: true,

            message: alreadyLiked
                ? "Post unliked successfully"
                : "Post liked successfully",

            liked: !alreadyLiked,

            likesCount: post.likes.length,

            likes: post.likes,
        });
    } catch (error) {
        console.error("Toggle Like Error:", error);

        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid post ID",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


// ==========================================
// ADD COMMENT
// POST /api/posts/:postId/comments
// ==========================================

const addComment = async (req, res) => {
    try {
        const { text } = req.body || {};

        if (typeof text !== "string" || !text.trim()) {
            return res.status(400).json({
                success: false,
                message: "Comment text is required",
            });
        }

        if (text.trim().length > 500) {
            return res.status(400).json({
                success: false,
                message: "Comment cannot exceed 500 characters",
            });
        }

        const post = await Post.findById(
            req.params.postId
        );

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        post.comments.push({
            user: req.user._id,
            text: text.trim(),
        });

        await post.save();

        const createdComment =
            post.comments[post.comments.length - 1];

        await post.populate({
            path: "comments.user",
            select: "name username profileImage",
        });

        const populatedComment = post.comments.id(
            createdComment._id
        );

        return res.status(201).json({
            success: true,
            message: "Comment added successfully",
            comment: populatedComment,
        });
    } catch (error) {
        console.error("Add Comment Error:", error);

        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid post ID",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


// ==========================================
// DELETE POST
// DELETE /api/posts/:postId
// ==========================================

const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(
            req.params.postId
        );

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        if (
            post.author.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "You can only delete your own posts",
            });
        }

        await post.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Post deleted successfully",
        });
    } catch (error) {
        console.error("Delete Post Error:", error);

        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid post ID",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


module.exports = {
    createPost,
    getPosts,
    getSinglePost,
    toggleLike,
    addComment,
    deletePost,
};