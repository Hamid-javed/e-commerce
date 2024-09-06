const router = require("express").Router();
const productControl = require("../controller/productControl");
const { verifyUserToken } = require("../middlewares/authUser");


router.get("/categories",verifyUserToken, productControl.getCategories);
router.get("/featured",verifyUserToken, productControl.featured);
router.get("/get/:productId",verifyUserToken, productControl.getSingle);
router.get("/search",verifyUserToken, productControl.search);
router.post("/cart-product/:productId",verifyUserToken, productControl.addToCart);
router.delete("/cart-product/:productId",verifyUserToken, productControl.removeFromCart);
router.post("/buy-product/:cartId/:productId",verifyUserToken, productControl.buyProduct);
router.get("/get-orders",verifyUserToken, productControl.getMyOrders);
router.post("/wishlist/:productId",verifyUserToken, productControl.addProductTWoishlist);
router.delete("/wishlist/:productId",verifyUserToken, productControl.removeProductTWoishlist);
router.get("/:productId/reviews", productControl.getAllReviews);
router.post("/:productId/reviews", verifyUserToken, productControl.addReview);
router.put("/reviews/:reviewId", verifyUserToken, productControl.updateReview);
router.delete("/reviews/:reviewId",verifyUserToken, productControl.deleteReview);




module.exports = router;
