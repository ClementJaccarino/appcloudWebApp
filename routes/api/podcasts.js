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
// @desc Get the avg grade for all the reviews - Query 1
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
// @desc Get all the distinct categories - Query 2
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

// @route GET api/repartitionreviews
// @desc Get the repartition of the reviews for a given categories - Query 3
// @accessPublic
router.get("/repartitionreviews", async (req, res) => {
  const categories = req.query.categories;
  const query = await Podcast.aggregate([
    { $match: { "categories.category": categories } },
    { $unwind: "$reviews" },
    {
      $group: {
        _id: { post: "$categories.category", rating: "$reviews.rating" },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: "$_id.post",
        counts: { $push: { rating: "$_id.rating", count: "$count" } },
      },
    },
  ]);
  res.json(query);
});

// @route GET api/search
// @desc Get the podcast associated with the key words - Query 4
// @accessPublic
router.get("/search", async (req, res) => {
  const keyword = req.query.keyword;

  const search = await Podcast.find().and([
    { title: { $regex: keyword, $options: "i" } },
  ]);

  res.json(search);
});

// @route GET api/hour
// @desc Get the hour at wich the most reviews are written - Query 5
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

// @route GET api/negativehour
// @desc Get the hour at wich there is the most negative reviews for a given categorie - Query 6
// @accessPublic
router.get("/negativehour", async (req, res) => {
  const categories = req.query.categories;
  const query = await Podcast.aggregate([
    { $match: { "categories.category": categories } },
    { $unwind: "$reviews" },
    {
      $group: {
        _id: {
          $hour: { $dateFromString: { dateString: "$reviews.created_at" } },
        },
        count: { $sum: { $cond: [{ $lte: ["$reviews.rating", 2] }, 1, 0] } },
      },
    },
    { $sort: { count: -1 } },
  ]);
  res.json(query);
});

// @route GET api/bestkeyword
// @desc Get the best keywords and the podcast that represent it the better - Query 7
// @accessPublic
router.get("/bestkeyword", async (req, res) => {
  const query = await Podcast.aggregate([
    { $unwind: "$reviews" },
    {
      $group: {
        size: { $sum: 1 },
        avg: { $avg: "$reviews.rating" },
        _id: "$slug",
      },
    },
    { $project: { podcast_id: 1, slug: "$_id", avg: 1, sum: 1, size: 1 } },
    { $sort: { avg: -1, size: -1 } },
    { $limit: 1 },
  ]);
  res.json(query);
});

// @route GET api/topcategories
// @desc Get the top 10 categories to get less than 20% negative reviews - Query 8
// @acessPublic
router.get("/topcategories", async (req, res) => {
  const query = Podcast.aggregate([
    { $unwind: "$categories" },
    { $unwind: "$reviews" },
    {
      $group: { _id: "$categories.category", avg: { $avg: "$reviews.rating" } },
    },
    { $match: { avg: { $gte: 4 } } },
    { $project: { "categories.category": "$_ id", avg: 1 } },
    { $sort: { avg: -1 } },
    { $limit: 10 },
  ]);
  res.json(query);
});

module.exports = router;
