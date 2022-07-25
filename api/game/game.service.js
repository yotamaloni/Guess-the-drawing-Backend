const dbService = require("../../services/db.service");
const ObjectId = require("mongodb").ObjectId;

module.exports = {
  getTheGame,
};

async function getTheGame(player) {
  try {
    const criteria = _buildCriteria(player.type);
    const collection = await dbService.getCollection("game");
    var game = await collection.findOne(criteria);
    if (game) addPlayerToGame(collection, player, game._id);
    else game = addNewGame(collection, player);
    return game;
  } catch (err) {
    console.log("cannot find game", err);
    throw err;
  }
}

async function addPlayerToGame(collection, player, gameId) {
  try {
    await collection.updateOne({ _id: gameId }, { $push: { players: player } });
  } catch (err) {
    console.log("Cannot update Game", err);
  }
}
async function addNewGame(collection, player) {
  try {
    const game = {
      players: [player],
    };
    await collection.insertOne(game);
    return game;
  } catch (err) {
    console.log("Cannot add new game", err);
  }
}

function _buildCriteria(playerType) {
  const typeToFind = playerType === "guess" ? "draw" : "guess";
  const criteria = {
    $and: [{ "players.type": typeToFind }, { players: { $size: 1 } }],
  };
  return criteria;
}
