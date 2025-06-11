const express = require("express");

const router = express.Router();

const orderController = require("../controllers/order.controller");


const authMiddleware = require("../middlewares/authMiddleware");

router.get("/orders", orderController.getOrders);

router.use(authMiddleware);




module.exports = router;
