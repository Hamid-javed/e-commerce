const Review = require("../model/reviewSchema");
const Order = require("../model/orderSchema");

// Create a review - Only if the user has purchased the product
const addReview = async (req, res) => {
    const { rating, review, productId } = req.body;
    const userId = req.user._id;
  
    try {
      const hasPurchased = await Order.findOne({
        user: userId,
        "items.product": productId,
        status: { $in: ['Shipped', 'Delivered'] },
      });
  
      if (!hasPurchased) {
        return res.status(403).json({ message: "You can only review products you have purchased." });
      }
  
      const newReview = new Review({
        rating,
        review,
        user: userId,
        product: productId,
      });
  
      await newReview.save();
      res.status(201).json({ message: "Review added successfully", review: newReview });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };

// Update a review - Only if the review belongs to the user
const updateReview = async (req, res) => {
    const { reviewId } = req.params;
    const { rating, review } = req.body;
    const userId = req.user._id;
  
    try {
      const existingReview = await Review.findById(reviewId);
  
      if (!existingReview) {
        return res.status(404).json({ message: "Review not found." });
      }
  
      if (existingReview.user.toString() !== userId.toString()) {
        return res.status(403).json({ message: "You can only update your own review." });
      }
  
      existingReview.rating = rating;
      existingReview.review = review;
  
      await existingReview.save();
      res.status(200).json({ message: "Review updated successfully", review: existingReview });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };
  

// Delete a review - Only if the review belongs to the user
const deleteReview = async (req, res) => {
    const { reviewId } = req.params;
    const userId = req.user._id;
  
    try {
      const existingReview = await Review.findById(reviewId);
  
      if (!existingReview) {
        return res.status(404).json({ message: "Review not found." });
      }
  
      if (existingReview.user.toString() !== userId.toString()) {
        return res.status(403).json({ message: "You can only delete your own review." });
      }
  
      await existingReview.remove();
      res.status(200).json({ message: "Review deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };
  

// Get all reviews for a product
const getReviews = async (req, res) => {
  const { productId } = req.params;

  try {
    const reviews = await Review.find({ product: productId }).populate("user", "name");
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  addReview,
  updateReview,
  deleteReview,
  getReviews,
};
