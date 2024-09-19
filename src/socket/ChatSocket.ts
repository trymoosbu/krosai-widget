import io from "socket.io-client";

const socket = io("https://krosai.azurewebsites.net/agent/ws/chat/36383", {
  transports: ["websocket"],
  //   auth: {
  //     token: Bearer ${String(getCookie('token'))},
  //   },
});

export const initializeSocket = () => {
  socket.connect();

  socket.on("connect", () => {
    console.log("Socket Connected");
  });

  socket.on("connect_error", () => {
    console.log("Socket Error");
  });

  socket.on("disconnect", () => {
    console.log("Socket Disconnected");
  });

  return socket;
};
