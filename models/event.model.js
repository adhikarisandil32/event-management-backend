const mongoose = require("mongoose")

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    numberOfParticipants: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    entryFee: {
      type: Number,
      required: true,
    },
    organizer: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true, // both for no duplication
      index: 1, // both for no duplication
      required: true,
    },
    belongsTo: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
)

const EventModel = mongoose.model("event", eventSchema)

module.exports = { EventModel }
