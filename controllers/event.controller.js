const { EventModel } = require("../models/event.model")
const slug = require("slug")

// code to generate unique slug add -2, -3 at the end if the slug is repeating
const getUniqueSlug = (title) => {
  return new Promise(async (resolve, _) => {
    const wouldBeSlug = slug(title)

    const existingSimilarSlugs = await EventModel.aggregate([
      {
        $match: {
          slug: {
            $regex: `^${wouldBeSlug}([\-0-9]*)?$`,
          },
        },
      },
      {
        $sort: {
          slug: 1,
        },
      },
    ])

    if (existingSimilarSlugs.length === 0) {
      return resolve(wouldBeSlug)
    }

    const slugWords = existingSimilarSlugs[existingSimilarSlugs.length - 1].slug.split("-")

    if (!isNaN(slugWords[slugWords.length - 1])) {
      return resolve(`${wouldBeSlug}-${Number(slugWords[slugWords.length - 1]) + 1}`)
    } else {
      return resolve(`${wouldBeSlug}-2`)
    }
  })
}

// CRUD operations below
const getEvents = async (req, res) => {
  try {
    const events = await EventModel.find({ belongsTo: req.user?._id }).select(["-__v"])

    return res.json({
      success: true,
      data: events,
    })
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    })
  }
}

const getSingleEvent = async (req, res) => {
  try {
    const { slug } = req.params

    const event = await EventModel.findOne({ slug: slug, belongsTo: req.user._id }).select(["-__v"])

    return res.json({
      success: true,
      data: event,
    })
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    })
  }
}

const postEvent = async (req, res) => {
  try {
    const { title, description, numberOfParticipants, startDate, endDate, entryFee, organizer } = req.body

    const uniqueSlug = await getUniqueSlug(title)

    const newEvent = await EventModel.create({
      title: title,
      description: description,
      numberOfParticipants: numberOfParticipants,
      startDate: startDate,
      endDate: endDate,
      entryFee: entryFee,
      organizer: organizer,
      slug: uniqueSlug,
      belongsTo: req.user._id,
    })

    const newlyCreatedEvent = await EventModel.findOne({ _id: newEvent._id }).select("-__v")

    return res.json({
      success: true,
      data: newlyCreatedEvent,
    })
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    })
  }
}

const updateEvent = async (req, res) => {
  try {
    const { id, title, description, numberOfParticipants, startDate, endDate, entryFee, organizer } = req.body

    const updatedData = await EventModel.findOneAndUpdate(
      { _id: id, belongsTo: req.user._id },
      {
        title: title,
        description: description,
        numberOfParticipants: numberOfParticipants,
        startDate: startDate,
        endDate: endDate,
        entryFee: entryFee,
        organizer: organizer,
      },
      { new: true }
    ).select("-__v")

    return res.json({
      success: true,
      data: updatedData,
    })
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    })
  }
}

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.body

    const deletedDoc = await EventModel.findOneAndDelete({ _id: id, belongsTo: req.user._id })

    return res.json({
      success: true,
      message: "Deleted Successfully",
    })
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    })
  }
}

module.exports = { getEvents, postEvent, deleteEvent, updateEvent, getSingleEvent }
