const dbService = require("../../services/db.service");
const utilService = require("../../services/util.service");
const ObjectId = require("mongodb").ObjectId;
const randomWords = require("../../collection-of-words");

module.exports = {
  getTheGame,
  getById,
  remove,
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
  const words = randomWords;
  const length = words.length;
  const randomNum = utilService.getRandomIntInclusive(0, length - 1);
  console.log(words[randomNum]);
  try {
    const game = {
      players: [player],
      word: words[randomNum],
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

async function getById(gameId) {
  try {
    const collection = await dbService.getCollection("game");
    const game = await collection.findOne({ _id: ObjectId(gameId) });
    return game;
  } catch (err) {
    logger.error(`while finding board ${gameId}`, err);
    throw err;
  }
}

async function remove(gameId) {
  try {
    const collection = await dbService.getCollection("game");
    await collection.deleteOne({ _id: ObjectId(gameId) });
    console.log("🟡 ~ collection", collection)
    return gameId;
  } catch (err) {
    console.log(`cannot remove game ${gameId}`, err);
    throw err;
  }
}
