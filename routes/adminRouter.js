const router = require("express").Router();
const adminControl = require("../controller/adminControl")


router.post("/add-product", adminControl.addProduct)
router.delete("/delete-product/:productId", adminControl.deleteProdct)


module.exports = router;