const express = require("express");

const {
    createPost,
    getPosts,
    getSinglePost,
    toggleLike,
    addComment,
    deletePost,
} = require("../controllers/post.controller");

const {
    protect,
} = require("../middleware/auth.middleware");


const router = express.Router();


// GET ALL POSTS

router.get(
    "/",
    protect,
    getPosts
);


// CREATE POST

router.post(
    "/",
    protect,
    createPost
);


// GET SINGLE POST

router.get(
    "/:postId",
    protect,
    getSinglePost
);


// LIKE / UNLIKE POST

router.put(
    "/:postId/like",
    protect,
    toggleLike
);


// ADD COMMENT

router.post(
    "/:postId/comments",
    protect,
    addComment
);


// DELETE POST

router.delete(
    "/:postId",
    protect,
    deletePost
);


module.exports = router;