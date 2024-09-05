const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
  color: {
    type: String,
    required: true,
  },
  colorHex: {
    type: String,
  },
  size: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
  },
});

const reviewSchema = new mongoose.Schema({
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String, },
  date: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  category: {type: String},
  reviewCount: {type: Number, default: 0, min: 0},
  rating: {type: Number, default: 0, min: 0, max: 5},
  variants: [variantSchema],
  reviews: [reviewSchema],
  attributes: [],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

productSchema.pre("save", function (next) {
  const reviewNum = this.reviews.length;
  let rating = 0;
  for (let i = 0; i < this.reviews.length; i++) {
    rating += this.reviews[i].rating;
  }
  rating = rating / this.reviews.length;
  rating = rating > 5 ? 5 : rating;
  rating = rating < 0 ? 0 : rating;
  rating = parseFloat(rating.toFixed(1));

  this.reviewCount = reviewNum;
  this.rating = rating || 0;

  next();
});

module.exports = mongoose.model("Product", productSchema);
