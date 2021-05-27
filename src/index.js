const http = require("http");
const express = require("express");
const path = require("path");
const socketio = require("socket.io");
const Filter = require("bad-words");
const { generateMessage } = require("../utils/message");
const {
  adduser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("../utils/users");
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const port = process.env.PORT || 3000;
const publicDirectory = path.join(__dirname, "../public_dir");
app.use(express.static(publicDirectory));
io.on("connection", (socket) => {
  console.log("new Web socket connection");

  socket.on("disconnect", () => {
    const removedUser = removeUser(socket.id);
    if (removedUser) {
      io.to(removedUser.room).emit(
        "message",
        generateMessage("Admin", removedUser.username + " has left")
      );
      io.to(removedUser.room).emit("roomData", {
        room: removedUser.room,
        users: getUsersInRoom(removedUser.room),
      });
    }
  });

  // socket.on("join", (options, callback)=>{
  // const {error,user}=adduser({
  // id:socket.id,
  // ...options  // ... is used to populate the object
  socket.on("join", ({ username, room }, callback) => {
    // console.log(username, room);
    const { error, user } = adduser({
      id: socket.id,
      username,
      room,
    });
    if (error) {
      return callback(error);
    }
    socket.join(user.room);

    socket.emit("message", generateMessage("Admin", "Welcome!"));
    socket.broadcast
      .to(user.room)
      .emit("message", generateMessage("Admin", `${user.username} has joined`));
    //io.emit,socket.imit,socket.broadcast.imit,
    //io.to.emit,socket.broadcast.imit
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
    callback();
  });

  //   socket.emit("countUpdated", count);
  //   socket.on("increment", () => {
  //     count++;
  //     // socket.emit("countUpdated", count);
  //     io.emit("countUpdated", count);
  //   });
  socket.on("sendAll", (str, callback) => {
    const filter = new Filter();
    if (filter.isProfane(str)) {
      return callback("profanity is not allowed");
    }
    const user = getUser(socket.id);
    // console.log(user.room);
    io.to(user.room).emit("message", generateMessage(user.username, str));
    callback();
  });
  socket.on("sendLocation", (location, callback) => {
    const user = getUser(socket.id);
    const link = `https://google.com/maps?q=${location.latitude},${location.longitude}`;
    io.to(user.room).emit(
      "locationMessage",
      generateMessage(user.username, link)
    );
    callback();
  });
});

server.listen(port, () => {
  console.log("server is up on port ", port);
});
