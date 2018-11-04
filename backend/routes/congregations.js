const express = require("express");
const CongregationsController = require("../controllers/congregations");
const asyncMiddleware = require("../middleware/async")

const router = express.Router();

router.post("", asyncMiddleware(CongregationsController.createCongregation));
router.put("/:id", asyncMiddleware(CongregationsController.updateCongregation));
router.get("", asyncMiddleware(CongregationsController.getCongregations));
router.delete("/:id", asyncMiddleware(CongregationsController.deleteCongregation));

module.exports = router;
