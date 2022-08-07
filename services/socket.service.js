var gIo = null;

function connectSockets(http, session) {
  gIo = require("socket.io")(http, {
    cors: {
      origin: "*",
    },
  });
  gIo.on("connection", (socket) => {
    console.log("New socket", socket.id);
    socket.on("disconnect", (socket) => {
      console.log("Someone disconnected");
    });

    socket.on("game-watch", (gameId) => {
      console.log("game-watch gameId:", gameId);
      if (socket.gameId === gameId) return;
      if (socket.gameId) {
        socket.leave(socket.boardId);
      }
      socket.join(gameId);
      socket.gameId = gameId;
    });

    socket.on("player-in", (gameId) => {
      socket.to(socket.gameId).emit("player-in", gameId);
    });
    socket.on("player-leave", (gameId) => {
      socket.to(socket.gameId).emit("player-leave", gameId);
    });
    socket.on("player-won", (gameId) => {
      socket.to(socket.gameId).emit("player-won", gameId);
    });
    socket.on("player-lost", (gameId) => {
      socket.to(socket.gameId).emit("player-lost", gameId);
    });
    socket.on("start-drawing", (pos) => {
      socket.to(socket.gameId).emit("start-drawing", pos);
    });
    socket.on("draw", (pos) => {
      socket.to(socket.gameId).emit("draw", pos);
    });
    socket.on("finish-drawing", (pos) => {
      socket.to(socket.gameId).emit("finish-drawing", pos);
    });
    socket.on("clear-canvas", (pos) => {
      socket.to(socket.gameId).emit("clear-canvas", pos);
    });
  });
}

module.exports = {
  connectSockets,
};
