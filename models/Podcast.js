const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const PodcastSchema = new Schema({
  id: { type: String, unique: true, required: true },
  slug: String,
  title: String,
  reviews: [
    { title: String, rating: Number, content: String, created_at: String },
  ],
  itunes_id: Number,
  categories: [{ category: String }],
  itunles_url: String,
  podcast_id: String,
});

module.exports = Podcast = mongoose.model(
  "podcastsDB",
  PodcastSchema,
  "podcastsDB",
  true
);
