const express = require("express");

const {
    getUsers,
    getUserProfile,
    toggleFollow,
} = require("../controllers/user.controller");

const {
    protect,
} = require("../middleware/auth.middleware");


const router = express.Router();


router.get(
    "/",
    protect,
    getUsers
);


router.get(
    "/profile/:username",
    protect,
    getUserProfile
);


router.put(
    "/:userId/follow",
    protect,
    toggleFollow
);


module.exports = router;