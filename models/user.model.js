const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
)

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

const UserModel = mongoose.model("user", userSchema)

module.exports = { UserModel }
