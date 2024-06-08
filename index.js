const mongoose = require("mongoose")
const { server } = require("./app.js")
const PORT = process.env.PORT || 3000

mongoose.connect(process.env.MONGODB_URL).then(() => {
  console.log("Mongoose Ready")

  server.listen(PORT, () => {
    console.log(`Server Ready at Port ${PORT}`)
  })
})
