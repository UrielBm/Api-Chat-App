const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { generateJWT } = require("../helpers/jwt");
class authController {
  async CreateUser(req, res, next) {
    try {
      const { email, password } = req.body;
      const existEmail = await User.findOne({ email });

      //verify que el email no exista
      if (existEmail) {
        return res.status(400).json({
          type: "error",
          msg: "ya hay un usuario registrado con ese correo",
        });
      }
      const user = new User(req.body);
      //hash contraseña
      const salt = bcrypt.genSaltSync();
      user.password = bcrypt.hashSync(password, salt);

      // guardar en base de datos
      await user.save();

      // Generar el jwt
      const token = await generateJWT(user.id);
      return res.status(200).json({
        type: "right",
        user,
        token,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        type: "error",
        msg: `Error type ${error} comuniquelo al administrador`,
      });
    }
  }
  async LoginAccount(req, res, next) {
    try {
      const { email, password } = req.body;
      //verificar si existe el usuario
      const userCheck = await User.findOne({ email });
      if (!userCheck) {
        return res.status(404).json({
          type: "error",
          msg: "Verificar el usuario y contraseña",
        });
      }
      // verificar el password
      const validPassword = bcrypt.compareSync(password, userCheck.password);
      if (!validPassword) {
        return res.status(404).json({
          type: "error",
          msg: "Verificar el usuario y contraseña",
        });
      }

      //generar JWT
      const token = await generateJWT(userCheck.id);
      return res.status(200).json({
        type: "right",
        user: userCheck,
        token,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        type: "error",
        msg: `Error type ${error} comuniquelo al administrador`,
      });
    }
  }
  async RenovationToken(req, res, next) {
    try {
      const uid = req.uid;

      // generar nuevo token
      const token = await generateJWT(uid);

      // obtener el usuario en db
      const user = await User.findById(uid);
      res.status(200).json({
        type: "right",
        user,
        token,
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
module.exports = authController;
