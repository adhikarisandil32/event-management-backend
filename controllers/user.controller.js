const { UserModel } = require("../models/user.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const generateTokens = async ({ id, email, fullName }) => {
  const refreshToken = jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  })

  await UserModel.findOneAndUpdate({ _id: id }, { refreshToken: refreshToken })

  const accessToken = jwt.sign({ id, fullName, email }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  })

  return { refreshToken, accessToken }
}

// Below is the crud operations
const getUser = async (req, res) => {
  try {
    return res.json({
      success: true,
      data: req.user,
    })
  } catch (error) {
    return res.json({
      success: false,
      message: error,
    })
  }
}

const postUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body

    const existingUser = await UserModel.findOne({ email: email })

    if (existingUser) throw new Error("User already exists")

    const createdUser = await UserModel.create({
      fullName,
      email,
      password,
    })

    const user = await UserModel.findOne({ _id: createdUser._id }).select("-password -__v -refreshToken")

    return res.json({
      success: true,
      data: user,
    })
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    })
  }
}

const loginUser = async (req, res) => {
  try {
    // get email and password
    // see if user exists, throw error if doesn't
    // check if password match
    // generate refreshToken and store it to the database and cookies
    // generate accessToken and save it on to the cookies

    const { email, password } = req.body

    const user = await UserModel.findOne({ email: email }).select("-__v")

    if (!user) throw new Error("User doesn't exist")

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) throw new Error("email or password do not match")

    const { refreshToken, accessToken } = await generateTokens({
      email: user.email,
      fullName: user.fullName,
      id: user._id,
    })

    const loggedInUser = await UserModel.findById({ _id: user._id }).select("-password -__v -refreshToken")

    const options = {
      httpOnly: true,
      secure: true,
    }

    return res
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        success: true,
        data: {
          user: loggedInUser,
          accessToken: accessToken,
        },
      })
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    })
  }
}

const logoutUser = async (req, res) => {
  try {
    await UserModel.findOneAndUpdate(
      { _id: req.user._id },
      {
        $unset: {
          // removes the field
          refreshToken: 1,
        },
      }
    )

    const options = {
      httpOnly: true,
      secure: true,
    }

    return res.clearCookie("accessToken", options).clearCookie("refreshToken", options).json({
      success: true,
    })
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    })
  }
}

const refreshAccessToken = async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies?.refreshToken

    const { id } = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

    const user = await UserModel.findOne({ _id: id })

    if (user?.refreshToken !== incomingRefreshToken) throw new Error("Invalid Token")

    const { refreshToken: newRefreshToken, accessToken } = await generateTokens({
      id: user?._id,
      email: user?.email,
      fullName: user?.fullName,
    })

    const options = {
      httpOnly: true,
      secure: true,
    }

    return res.cookie("accessToken", accessToken, options).cookie("refreshToken", newRefreshToken, options).json({
      success: true,
      accessToken: accessToken,
    })
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    })
  }
}

module.exports = { getUser, postUser, loginUser, logoutUser, refreshAccessToken }