const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
  color: {
    type: String,
    required: true,
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

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  reviewCount: {type: Number, default: 0, min: 0},
  rating: {type: Number, default: 0, min: 0, max: 5},
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
      required: true,
    }
  ],
  variants: [variantSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

productSchema.pre("save", function (next) {
  const reviewNum = this.reviews.length;
  let rating = 0;
  for (let i = 0; i < this.data.reviews.length; i++) {
    rating += this.data.reviews[i].rating;
  }
  rating = rating / this.data.reviews.length;
  rating = rating > 5 ? 5 : rating;
  rating = rating < 0 ? 0 : rating;
  rating = parseFloat(rating.toFixed(1));

  this.reviewCount = reviewNum;
  this.rating = rating || 0;

  next();
});

module.exports = mongoose.model("Product", productSchema);
