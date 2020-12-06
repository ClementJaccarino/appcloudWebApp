const express = require("express");
const router = express.Router();

// Podcast Model
const Podcast = require("../../models/Podcast");

// @route   GET api/podcasts
// @desc    Get All podcasts
// @accessPublic
router.get("/podcasts", async (req, res) => {
  const limit = Number(req.query.limit) || 10;
  const skip = Number(req.query.skip) || 0;
  try {
    const podcasts = await Podcast.find({}).limit(limit).skip(skip);
    res.json(podcasts);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err.message });
  }
});

// @route GET api/reviews
// @desc Get the avg grade for all the reviews
// @accessPublic
router.get("/reviews", async (req, res) => {
  const limit = Number(req.query.limit) || 10;
  const skip = Number(req.query.skip) || 0;
  const reviews = await Podcast.aggregate([
    { $unwind: "$reviews" },
    {
      $group: {
        size: { $sum: 1 },
        avg: { $avg: "$reviews.rating" },
        _id: "$title",
      },
    },
    { $project: { podcast_id: 1, title: "$_id", avg: 1, sum: 1, size: 1 } },
    { $sort: { avg: -1, size: -1 } },
    { $limit: limit + skip },
    { $skip: skip },
  ]);
  res.json(reviews);
});

// @route GET api/categories
// @desc Get all the distinct categories
// @accessPublic
router.get("/categories", async (req, res) => {
  const categories = await Podcast.find().distinct(
    "categories.category",
    (err, res) => {
      return res;
    }
  );
  res.json(categories);
});

// @route GET api/search
// @desc Get the podcast associated with the key words
// @accessPublic
router.get("/search", async (req, res) => {
  const keyword = req.query.keyword;

  const search = await Podcast.find().and([
    { title: { $regex: keyword, $options: "i" } },
  ]);

  res.json(search);
});

// @route GET api/hour
// @desc Get the hour at wich the most reviews are written
// @accessPublic
router.get("/hour", async (req, res) => {
  const hour = await Podcast.aggregate([
    { $unwind: "$reviews" },
    {
      $group: {
        _id: {
          $hour: { $dateFromString: { dateString: "$reviews.created_at" } },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 1 },
  ]);

  res.json(hour);
});

module.exports = router;
