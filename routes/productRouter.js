const router = require("express").Router();
const productControl = require("../controller/productControl");
const { verifyUserToken } = require("../middlewares/authUser");



router.get("/categories",verifyUserToken, productControl.getCategories);
router.get("/featured",verifyUserToken, productControl.featured);
router.get("/get/:productId",verifyUserToken, productControl.getSingle);
router.get("/search",verifyUserToken, productControl.search);
router.post("/cart-product/:productId",verifyUserToken, productControl.addToCart);
// router.post("/buy-product/:cartId", productControl.buyProduct);





module.exports = router;
