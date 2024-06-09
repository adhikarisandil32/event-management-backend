const express = require("express")
const app = express()
const cors = require("cors")
const http = require("http")
const server = http.createServer(app)
const multer = require("multer")
const upload = multer()
const cookieParser = require("cookie-parser")
const morgan = require("morgan")

const { usersRoute } = require("./routes/user.routes")
const { eventsRoute } = require("./routes/event.routes")

require("dotenv").config()

// boilerplate middlewares
app.use(cors({ origin: process.env.FRONTEND_ORIGIN, credentials: true }))
app.use(morgan("tiny"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(upload.none())
app.use(cookieParser())

// action middlewares
app.use("/api/v1/users", usersRoute)
app.use("/api/v1/events", eventsRoute)

app.get("/", async (_, res) => {
  return res.json({
    message: "Welcome JavaScript Developer",
  })
})

module.exports = { server }
