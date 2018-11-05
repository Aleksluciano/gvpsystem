const express = require("express");
const HospitalsController = require("../controllers/hospitals");
const asyncMiddleware = require("../middleware/async")

const router = express.Router();

router.post("", asyncMiddleware(HospitalsController.createHospital));
router.put("/:id", asyncMiddleware(HospitalsController.updateHospital));
router.get("", asyncMiddleware(HospitalsController.getHospitals));
router.delete("/:id", asyncMiddleware(HospitalsController.deleteHospital));

module.exports = router;
