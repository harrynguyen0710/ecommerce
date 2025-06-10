const express = require("express");
const CartController = require("../controllers/cart.controller");


const validateRequest = require("../middlewares/validateRequest");

const { addToCartSchema, updateQuantitySchema } = require("../validators/cartSchema");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", CartController.getCart);
router.post("/", validateRequest(addToCartSchema), CartController.addToCart);
router.patch("/items/:sku", validateRequest(updateQuantitySchema), CartController.updateItemQuantity);
router.delete("/items/:sku", CartController.removeItemFromCart);
router.delete("/", CartController.cleanCart);

router.post("/validate-and-lock", CartController.lockCart);
router.post("/unlock", CartController.unlockCart);

module.exports = router;
