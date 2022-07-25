const express = require("express");

const { getGame } = require("./game.controller");

const router = express.Router();
router.get("/", getGame);

module.exports = router;
