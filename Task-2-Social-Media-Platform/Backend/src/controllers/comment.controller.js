const mongoose = require("mongoose");

const Comment = require("../models/comment.model");
const Post = require("../models/post.model");


// POST /api/comments/:postId
const createComment = async (req, res) => {
    try {
        const { postId } = req.params;

        const { content } = req.body || {};

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid post ID",
            });
        }

        const cleanContent =
            typeof content === "string"
                ? content.trim()
                : "";

        if (!cleanContent) {
            return res.status(400).json({
                success: false,
                message: "Comment content is required",
            });
        }

        if (cleanContent.length > 500) {
            return res.status(400).json({
                success: false,
                message:
                    "Comment cannot exceed 500 characters",
            });
        }

        const postExists = await Post.exists({
            _id: postId,
        });

        if (!postExists) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        const comment = await Comment.create({
            post: postId,
            author: req.user._id,
            content: cleanContent,
        });

        await comment.populate(
            "author",
            "name username profileImage"
        );

        return res.status(201).json({
            success: true,
            message: "Comment created successfully",
            comment,
        });
    } catch (error) {
        console.error("Create Comment Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


// GET /api/comments/:postId
const getPostComments = async (req, res) => {
    try {
        const { postId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid post ID",
            });
        }

        const postExists = await Post.exists({
            _id: postId,
        });

        if (!postExists) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        const comments = await Comment.find({
            post: postId,
        })
            .populate(
                "author",
                "name username profileImage"
            )
            .sort({ createdAt: 1 });

        return res.status(200).json({
            success: true,
            count: comments.length,
            comments,
        });
    } catch (error) {
        console.error("Get Comments Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


// DELETE /api/comments/comment/:commentId
const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;

        if (
            !mongoose.Types.ObjectId.isValid(commentId)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid comment ID",
            });
        }

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found",
            });
        }

        if (
            comment.author.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "You can only delete your own comments",
            });
        }

        await comment.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Comment deleted successfully",
        });
    } catch (error) {
        console.error("Delete Comment Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


module.exports = {
    createComment,
    getPostComments,
    deleteComment,
};