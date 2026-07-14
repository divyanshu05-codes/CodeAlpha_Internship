const express = require("express");

const {
    toggleFollow,
    getFollowers,
    getFollowing,
} = require("../controllers/follow.controller");

const {
    protect,
} = require("../middleware/auth.middleware");

const router = express.Router();

router.patch("/:userId", protect, toggleFollow);

router.get("/:userId/followers", protect, getFollowers);

router.get("/:userId/following", protect, getFollowing);

module.exports = router;