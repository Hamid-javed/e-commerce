const router = require("express").Router();
const express = require("express");
const { addReview, updateReview, deleteReview, getReviews } = require("../controller/reviewControl");
const authMiddleware = require("../middlewares/authUser"); // Assuming this checks if the user is logged in

// Get all reviews for a product
router.get("/products/:productId/reviews", getReviews);
// Add a review - User must be authenticated and have purchased the product
router.post("/products/:productId/reviews", authMiddleware, addReview);
// Update a review - User must be authenticated and own the review
router.put("/reviews/:reviewId", authMiddleware, updateReview);
// Delete a review - User must be authenticated and own the review
router.delete("/reviews/:reviewId", authMiddleware, deleteReview);

module.exports = router;
