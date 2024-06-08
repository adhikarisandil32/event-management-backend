const jwt = require("jsonwebtoken")
const { UserModel } = require("../models/user.model")

const verifyJWT = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.headers?.Authorization?.split(" ")[1]

    if (!token) throw new Error("Unauthorized Request")

    const { id } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    const user = await UserModel.findOne({ _id: id }).select("-password -__v -refreshToken")

    if (!user) throw new Error("Unauthorized Request")

    req.user = user

    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    })
  }
}

module.exports = { verifyJWT }
