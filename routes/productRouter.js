const router = require("express").Router();
const productControl = require("../controller/productControl");
const { verifyUserToken } = require("../middlewares/authUser");



router.get("/categories",verifyUserToken, productControl.getCategories);


module.exports = router;
