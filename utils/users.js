const users = [];
//addUser, removeUser, getUser, getUsersInRoom

const adduser = ({ id, username, room }) => {
  //for cleanning the data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  //for validation
  if (!username || !room) {
    return {
      error: "Username and room are required",
    };
  }
  //for checking name
  const isMatched = users.find((user) => {
    return user.room === room && user.username === username;
  });
  //for validating username
  if (isMatched) {
    return {
      error: "username is in use",
    };
  }
  const user = { id, username, room };
  users.push(user);
  return { user };
};
const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  return users.splice(index, 1)[0];
};
const getUser = (id) => {
  return users.find((user) => user.id === id);
};
const getUsersInRoom = (room) => {
  return users.filter((user) => user.room === room);
};

// adduser({
//   id: 98,
//   username: "   Kishan",
//   room: "   krishna",
// });
// adduser({
//   id: 100,
//   username: "karan",
//   room: "krishna",
// });
// adduser({
//   id: 101,
//   username: "jinal",
//   room: "krishna",
// });
// adduser({
//   id: 102,
//   username: "milap",
//   room: "bang",
// });
// const user01 = adduser({
//   id: 90,
//   username: "",
//   room: "",
// });
// console.log(user);
// console.log(user01);
// const removedUser = removeUser(98);
// console.log(removedUser);
// console.log(getUser(10));
// console.log(getUser(101));
// console.log(getUsersInRoom("krishna"));
// console.log(getUsersInRoom("ram"));
// console.log(getUsersInRoom("bang"));

// console.log(users);
module.exports = {
  adduser,
  removeUser,
  getUser,
  getUsersInRoom,
};
