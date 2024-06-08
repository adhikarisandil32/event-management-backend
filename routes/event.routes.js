const express = require("express")
const eventsRoute = express.Router()
const { getEvents, getSingleEvent, postEvent, updateEvent, deleteEvent } = require("../controllers/event.controller")
const { verifyJWT } = require("../middlewares/auth.middleware")

eventsRoute.get("/", verifyJWT, getEvents)
eventsRoute.get("/:slug", verifyJWT, getSingleEvent)

eventsRoute.post("/", verifyJWT, postEvent)

eventsRoute.patch("/", verifyJWT, updateEvent)

eventsRoute.delete("/", verifyJWT, deleteEvent)

module.exports = { eventsRoute }
