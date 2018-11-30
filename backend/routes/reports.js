const express = require("express");
const ReportsController = require("../controllers/reports");
const asyncMiddleware = require("../middleware/async")

const router = express.Router();

router.post("", asyncMiddleware(ReportsController.createReport));
router.put("/:id", asyncMiddleware(ReportsController.updateReport));
router.get("", asyncMiddleware(ReportsController.getReports));
router.get("/:id", asyncMiddleware(ReportsController.getOneReport));
router.delete("/:id", asyncMiddleware(ReportsController.deleteReport));

module.exports = router;
