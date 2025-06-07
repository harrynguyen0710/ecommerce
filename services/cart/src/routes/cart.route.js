const express = require("express");
const CartController = require("../controllers/cart.controller");

const validateRequest = require("../middlewares/validateRequest");

const { addToCartSchema, updateQuantitySchema } = require("../validators/cartSchema");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.post("/cart", validateRequest(addToCartSchema), CartController.addToCart);
router.patch("/cart/item/:sku", validateRequest(updateQuantitySchema), CartController.updateItemQuantity);
router.delete("/cart/item/:sku", CartController.removeItemFromCart);
router.delete("/cart", CartController.cleanCart);

module.exports = router;
