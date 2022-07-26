const gameService = require("./game.service.js");

async function getGame(req, res) {
  try {
    const { player } = req.query;
    const newPlayer = JSON.parse(player);
    const game = await gameService.getTheGame(newPlayer);
    res.json(game);
  } catch (err) {
    console.log("Failed to get game", err);
    res.status(500).send({ err: "Failed to get game" });
  }
}

async function getGameById(req, res) {
  try {
    const gameId = req.params.id;
    const game = await gameService.getById(gameId);
    res.json(game);
  } catch (err) {
    console.log("Failed to get game", err);
    res.status(500).send({ err: "Failed to get game" });
  }
}

async function removeGame(req, res) {
  try {
    const gameId = req.params.id;
    await gameService.remove(gameId);
    res.send();
  } catch (err) {
    console.log("Failed to remove game", err);
    res.status(500).send({ err: "Failed to remove game" });
  }
}

module.exports = { getGame, getGameById,removeGame };
