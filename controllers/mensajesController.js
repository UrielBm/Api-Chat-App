const Mensajes = require("../models/mensaje");
const User = require("../models/user");
class mensajesController {
  async GetMensajes(req, res, next) {
    try {
      const myid = req.uid;
      const mensajes_user = req.params.mensajes_user;
      // console.log(myid);
      const mensajes = await Mensajes.find({
        $or: [
          {
            from: myid,
            to: mensajes_user,
          },
          {
            from: mensajes_user,
            to: myid,
          },
        ],
      })
        .sort({ createdAt: "asc" })
        .limit(45);
      return res.status(200).json({
        type: "right",
        mensajes,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        type: "error",
        msg: `Error type ${error} comuniquelo al administrador`,
      });
    }
  }
}
module.exports = mensajesController;
