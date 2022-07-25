const express = require("express");

const { getGame, getGameById } = require("./game.controller");

const router = express.Router();
router.get("/", getGame);
router.get("/:id", getGameById);

module.exports = router;
