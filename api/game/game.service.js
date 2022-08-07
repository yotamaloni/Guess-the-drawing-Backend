const dbService = require("../../services/db.service");
const utilService = require("../../services/util.service");
const ObjectId = require("mongodb").ObjectId;
const collectionOfWords = require("../../collection-of-words");

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
  const words = collectionOfWords;
  const length = words.length;
  const randomNum = utilService.getRandomIntInclusive(0, length - 1);
  try {
    const game = {
      players: [player],
      word: words[randomNum],
    };
    game.words = _getRandomWords(game.word);
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
    console.log(`while finding board ${gameId}`, err);
    throw err;
  }
}

async function remove(gameId) {
  try {
    const collection = await dbService.getCollection("game");
    await collection.deleteOne({ _id: ObjectId(gameId) });
    return gameId;
  } catch (err) {
    console.log(`cannot remove game ${gameId}`, err);
    throw err;
  }
}

function _getRandomWords(word) {
  const allWords = [...collectionOfWords];
  const randomWords = [];
  var i = 0;
  while (i < 5) {
    const randomIdx = utilService.getRandomIntInclusive(0, allWords.length - 1);
    const randomWord = allWords.splice(randomIdx, 1)[0];
    if (allWords[randomIdx] !== word) {
      randomWords.push({ txt: randomWord, id: utilService.makeId() });
      i++;
    }
  }
  const randomIdx = utilService.getRandomIntInclusive(0, randomWords.length);
  randomWords.splice(randomIdx, 0, { txt: word, id: utilService.makeId() });
  return randomWords;
}
