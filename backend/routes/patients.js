const express = require("express");
const PatientsController = require("../controllers/patients");
const asyncMiddleware = require("../middleware/async")

const router = express.Router();

router.post("", asyncMiddleware(PatientsController.createPatient));
router.put("/:id", asyncMiddleware(PatientsController.updatePatient));
router.get("", asyncMiddleware(PatientsController.getPatients));
router.get("/:id", asyncMiddleware(PatientsController.getOnePatient));
router.delete("/:id", asyncMiddleware(PatientsController.deletePatient));

module.exports = router;
