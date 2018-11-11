const express = require("express");
const AssistantsController = require("../controllers/assistants");
const asyncMiddleware = require("../middleware/async")

const router = express.Router();

router.post("", asyncMiddleware(AssistantsController.createAssistant));
router.put("/:id", asyncMiddleware(AssistantsController.updateAssistant));
router.get("", asyncMiddleware(AssistantsController.getAssistants));
router.delete("/:id", asyncMiddleware(AssistantsController.deleteAssistant));

module.exports = router;
