const express = require("express");
const router = express.Router();

const userControllers = require("../controllers/users.controllers");

router.get("/:id", userControllers.getIdentification);
router.post("/", userControllers.getIdentificationByNFC);

module.exports = router;
