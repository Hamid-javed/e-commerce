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





module.exports = router;
