const { checkJWT } = require("../helpers/jwt");
const {
  userConnected,
  userDisconnected,
  getUser,
  SaveMensaje,
} = require("../controllers/socketController");
class Sockets {
  constructor(io) {
    this.io = io;
    this.SocketsEvents();
  }
  SocketsEvents() {
    this.io.on("connection", async (socket) => {
      const [right, uid] = checkJWT(socket.handshake.query["x-token"]);
      if (!right) {
        console.log("socket no identificado");
        return socket.disconnect();
      }
      await userConnected(uid);

      socket.join(uid);

      this.io.emit("user-list", await getUser());

      socket.on("mensaje-personal", async (mensaje) => {
        const response = await SaveMensaje(mensaje);
        this.io.to(mensaje.to).emit("mensaje-personal", response);
        this.io.to(mensaje.from).emit("mensaje-personal", response);
      });

      socket.on("disconnect", async () => {
        await userDisconnected(uid);
        this.io.emit("user-list", await getUser());
      });
    });
  }
}
module.exports = Sockets;
