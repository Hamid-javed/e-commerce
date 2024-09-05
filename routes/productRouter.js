const router = require("express").Router();
const productControl = require("../controller/productControl");
const { verifyUserToken } = require("../middlewares/authUser");



router.get("/categories",verifyUserToken, productControl.getCategories);
router.get("/featured", productControl.featured);
router.get("/get/:productId", productControl.getSingle);
router.get("/search", productControl.search);





module.exports = router;
