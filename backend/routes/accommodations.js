const express = require("express");
const AccommodationsController = require("../controllers/accommodations");
const asyncMiddleware = require("../middleware/async")

const router = express.Router();

router.post("", asyncMiddleware(AccommodationsController.createAccommodation));
router.put("/:id", asyncMiddleware(AccommodationsController.updateAccommodation));
router.get("", asyncMiddleware(AccommodationsController.getAccommodations));
router.delete("/:id", asyncMiddleware(AccommodationsController.deleteAccommodation));

module.exports = router;
