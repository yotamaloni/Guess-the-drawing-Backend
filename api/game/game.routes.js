const express = require("express");

const { getGame, getGameById, removeGame } = require("./game.controller");

const router = express.Router();
router.get("/", getGame);
router.get("/:id", getGameById);
router.delete("/:id", removeGame);

module.exports = router;
