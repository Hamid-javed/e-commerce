const router = require("express").Router();
const productControl = require("../controller/productControl");
const { verifyUserToken } = require("../middlewares/authUser");


router.get("/categories",verifyUserToken, productControl.getCategories);
router.get("/featured",verifyUserToken, productControl.featured);
router.get("/get/:productId",verifyUserToken, productControl.getSingle);
router.get("/search",verifyUserToken, productControl.search);
router.get("/:productId/reviews", productControl.getReviews);
router.post("/:productId/reviews", verifyUserToken, productControl.addReview);
router.put("/reviews/:reviewId", verifyUserToken, productControl.updateReview);
router.delete("/reviews/:reviewId", verifyUserToken, productControl.deleteReview);





module.exports = router;
