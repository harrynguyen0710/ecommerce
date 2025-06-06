const express = require("express");
const CartController = require("../controllers/CartController");

const validateRequest = require("../middlewares/validateRequest");

const { addToCartSchema, updateQuantitySchema } = require("../validators/cartSchema");

const router = express.Router();

router.post("/cart", validateRequest(addToCartSchema), CartController.addToCart);
router.patch("/cart/item/:sku", validateRequest(updateQuantitySchema), CartController.updateItemQuantity);
router.delete("/cart/item/:sku", CartController.removeItemFromCart);
router.delete("/cart", CartController.cleanCart);

module.exports = router;
