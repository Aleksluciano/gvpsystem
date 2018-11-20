const express = require("express");
const BeginController = require("../controllers/begin");
const asyncMiddleware = require("../middleware/async")

const router = express.Router();

router.get("", asyncMiddleware(BeginController.countObjects));

module.exports = router;
