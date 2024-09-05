const Category = require("../model/categorySchema")
const Cart = require("../model/cartSchema")
const Order = require("../model/orderSchema")
const Product = require("../model/productSchema")
const User = require("../model/userSchema")


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

exports.addToCart = async (req, res) => {
  try {
    const userId = req.id;
    const { productId } = req.params;
    const { color, size, quantity } = req.body;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    const product = await Product.findById({ _id: productId })
    if (!product) {
      return res.status(404).json({ message: "Product not Found!" })
    }
    const index = await product.variants.findIndex((variant) => {
      if (variant.color === color && variant.size === size) {
        return true;
      }
    })
    const price = product.variants[index].price
    const productDetails = {
      product: productId,
      color: color,
      size: size,
      quantity: quantity,
      price: price
    }
    let userCart = await Cart.findOne({ user: userId })
    if (!userCart) {
      userCart = await Cart.create({
        user: userId,
        items: [productDetails],
        total: price * quantity
      });
    } else {
      const existingProductIndex = userCart.items.findIndex(item =>
        item.product.toString() === productId &&
        item.color === color &&
        item.size === size
      );

      if (existingProductIndex !== -1) {
        userCart.items[existingProductIndex].quantity += quantity;
        userCart.items[existingProductIndex].price = price;
      } else {
        userCart.items.push(productDetails);
      }
    }
    userCart.total = userCart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    await userCart.save();
    res.status(200).json({
      message: "Product added to cart!",
    });
  } catch (error) {
    res.status(501).json({
      error: error.message,
    });
  }
}


exports.buyProduct = async (req, res) => {
  try {
    const userId = req.id;
    const { cartId, productId } = req.params;
    const { street, city, state, zip, country, paymentMethod } = req.body;
    if (!street) {
      return res.status(400).json({ message: "Street is required." });
    }
    if (!city) {
      return res.status(400).json({ message: "City is required." });
    }
    if (!state) {
      return res.status(400).json({ message: "State is required." });
    }
    if (!zip) {
      return res.status(400).json({ message: "Zip code is required." });
    }
    if (!country) {
      return res.status(400).json({ message: "Country is required." });
    }
    if (!paymentMethod) {
      return res.status(400).json({ message: "Payment method is required." });
    }
    const userCart = await Cart.findById({ _id: cartId })
    if (!userCart) {
      return res.status(404).json({ message: "No such cart found!" });
    }
    const productInCart = userCart.items.find((item) => item.product.toString() === productId);
    if (!productInCart) {
      return res.status(404).json({ message: "No such product found in the cart!" });
    }
    const shippingAddress = {
      street,
      city,
      state,
      zip,
      country,
    };
    const userOrder = await Order.create({
      user: userId,
      items: [productInCart],
      totalAmount: productInCart.price,
      paymentMethod: paymentMethod,
      shippingAddress
    })
    res.states(200).json({ message: "Order placed successfullu!" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
