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

module.exports = { getGame };
