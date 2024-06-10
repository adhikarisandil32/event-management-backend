const express = require("express")
const usersRoute = express.Router()
const { getUser, postUser, loginUser, logoutUser, refreshAccessToken } = require("../controllers/user.controller")
const { verifyJWT } = require("../middlewares/auth.middleware")

usersRoute.get("/current-user", verifyJWT, getUser)

usersRoute.post("/register", postUser)
usersRoute.post("/login", loginUser)
usersRoute.post("/logout", verifyJWT, logoutUser)
usersRoute.post("/refresh", refreshAccessToken)

module.exports = { usersRoute }
