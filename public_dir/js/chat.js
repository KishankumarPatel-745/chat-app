const socket = io();
// document.querySelector("#incre").addEventListener("click", () => {
//   socket.emit("increment");
// });
// socket.on("countUpdated", (count) => {
//   console.log("the count has been updated", count);
// });
const $messageDiv = document.querySelector("#messages");
const $messTemplate = document.querySelector("#messages-template").innerHTML;
const $sideBar = document.querySelector("#sideBar").innerHTML;
const $locaTemplate = document.querySelector("#location-template").innerHTML;
const autoscroll = () => {
  //height of the new message
  const $newMessage = $messageDiv.lastElementChild;
  const newMessageStyle = getComputedStyle($newMessage);
  const newMessageMarginBottom = parseInt(newMessageStyle.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMarginBottom;
  console.log(newMessageHeight);
  //visible Height
  const visibleHeight = $messageDiv.offsetHeight;
  //Height of messages container
  const containerHeight = $messageDiv.scrollHeight;
  //how far have i scrolled?
  const scrollOffset = $messageDiv.scrollTop + visibleHeight;
  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messageDiv.scrollTop = $messageDiv.scrollHeight;
  }
};
socket.on("message", (str) => {
  console.log(str.text);
  const html = Mustache.render($messTemplate, {
    username: str.username,
    str: str.text,
    createdAt: moment(str.createdAt).format("hh:mm a"),
  });
  $messageDiv.insertAdjacentHTML("beforeend", html);
  autoscroll();
});
const userDetail = Qs.parse(location.search, { ignoreQueryPrefix: true });
console.log(userDetail);
socket.emit("join", userDetail, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});

socket.on("locationMessage", (link) => {
  const html = Mustache.render($locaTemplate, {
    username: link.username,
    link: link.text,
    createdAt: moment(link.createdAt).format("hh mm a"),
  });
  $messageDiv.insertAdjacentHTML("beforeend", html);
  autoscroll();
});
document.querySelector("#location").addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("opps your browser cannot support the geolocation API");
  }
  document.querySelector("#location").setAttribute("disabled", "disabled");

  navigator.geolocation.getCurrentPosition((position) => {
    // console.log(position.coords.latitude, position.coords.longitude);
    socket.emit(
      "sendLocation",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      () => {
        console.log("Location has been shared");
        document.querySelector("#location").removeAttribute("disabled");
      }
    );
  });
});
document.querySelector("#btn").addEventListener("click", () => {
  //to prevent double click event
  document.querySelector("#btn").setAttribute("disabled", "disabled");
  socket.emit("sendAll", document.querySelector("#mess").value, (error) => {
    if (error) {
      document.querySelector("#btn").removeAttribute("disabled");
      document.querySelector("#mess").focus();
      return console.log(error);
    }
    console.log("Message Deliverd");
    document.querySelector("#mess").value = "";
    document.querySelector("#btn").removeAttribute("disabled");
    document.querySelector("#mess").focus();
  });
});
socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render($sideBar, {
    room,
    users,
  });
  document.querySelector("#sideDiv").innerHTML = html;
});
