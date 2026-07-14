const express = require("express");

const {
    createComment,
    getPostComments,
    deleteComment,
} = require("../controllers/comment.controller");

const {
    protect,
} = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/:postId", protect, createComment);

router.get("/:postId", protect, getPostComments);

router.delete(
    "/comment/:commentId",
    protect,
    deleteComment
);

module.exports = router;