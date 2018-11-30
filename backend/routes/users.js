const express = require("express");
const UsersController = require("../controllers/users");
const asyncMiddleware = require("../middleware/async")

const router = express.Router();

router.post("", asyncMiddleware(UsersController.createUser));
router.put("/:id", asyncMiddleware(UsersController.updateUser));
router.get("", asyncMiddleware(UsersController.getUsers));
router.get("/:id", asyncMiddleware(UsersController.getOneUser));
router.delete("/:id", asyncMiddleware(UsersController.deleteUser));

module.exports = router;
