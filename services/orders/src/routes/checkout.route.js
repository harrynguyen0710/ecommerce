const express = require("express");

const router = express.Router();


const checkoutController = require("../controllers/checkout.controller");

const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware);

router.post("/checkout", checkoutController.checkout);



module.exports = router;
