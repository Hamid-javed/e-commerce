const Category = require("../model/categorySchema")
const Product = require("../model/productSchema")

exports.getCategories = async (req, res) => {
  const categories = await Category.find()
  const categoryData = categories.map((category) => {
    return { name: category.name, productCount: category.productCount }
  })
  res.json(categoryData)
}


exports.featured = async (req, res) => {
  try {
    const categories = await Product.aggregate([
      { $group: { _id: "$category" } },
      { $limit: 7 }
    ]).exec();
    const productPromises = categories.map(category => {
      return Product.findOne({ "category": category._id }).exec();
    });
    const featuredProducts = await Promise.all(productPromises);
    res.status(200).json(featuredProducts);
  } catch (error) {
    res.status(404).json({
      error: error.message,
    });
  }
};



exports.getSingle = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ message: "Invalid id" });
    }
    const product = await Product.findOne({ _id: productId }).populate({ path: "reviews.user", select: "name email" });
    if (!product) return res.status(400).json({ message: "product not found" })
    res.json(product);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: error });
  }
};


exports.search = async (req, res) => {
  try {
    const {
      query = "",
      page = 1,
      limit = 10,
      category = "",
      sortfield = "",
      sortorder = "asc",
    } = req.query;
    const pageNumber = parseInt(page, 10) || 1;
    const pageSize = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * pageSize;
    const regex = query ? new RegExp(query, "i") : new RegExp("");

    const searchCriteria = query
      ? {
        $or: [
          { "name": { $regex: regex } },
          { "category": { $regex: regex } },
        ],
      }
      : {};
    let sortF;
    if (sortfield === "rating") {
      sortF = "rating";
    }

    const validSortFields = [
      "rating",
    ];
    const validSortOrder = ["asc", "desc"];
    let sortCriteria = {};

    if (
      sortfield &&
      validSortFields.includes(sortF) &&
      validSortOrder.includes(sortorder)
    ) {
      sortCriteria[sortF] = sortorder === "asc" ? 1 : -1;
    } else {
      sortCriteria = { _id: 1 };
    }

    const products = await Product.find(searchCriteria)
      .sort(sortCriteria)
      .skip(skip)
      .limit(pageSize);

    const totalCount = await Product.countDocuments(searchCriteria);

    res.status(200).json({
      page: pageNumber,
      limit: pageSize,
      totalResults: totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      results: products,
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching products" });
  }
};

// Create a review - Only if the user has purchased the product
exports.addReview = async (req, res) => {
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
exports.updateReview = async (req, res) => {
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
exports.deleteReview = async (req, res) => {
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
exports.getReviews = async (req, res) => {
  const { productId } = req.params;

  try {
    const reviews = await Review.find({ product: productId }).populate("user", "name");
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
