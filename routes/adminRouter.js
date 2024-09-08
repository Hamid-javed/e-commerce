const router = require("express").Router();
const adminControl = require("../controller/adminControl")


router.post("/add-product", adminControl.addProduct)
router.post("/edit-product", adminControl.editProduct)
router.delete("/delete-product/:productId", adminControl.deleteProdct)
router.get("/get-orders", adminControl.getOrders)
router.post("/order-placed/:productId", adminControl.orderStatus)


module.exports = router;