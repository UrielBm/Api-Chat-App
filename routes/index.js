const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarToken } = require("../middlewares/validar-token");
const authController = require("../controllers/authController");
const mensajesController = require("../controllers/mensajesController");
const IntanceAuthController = new authController();
const IntanceMensajesController = new mensajesController();
/*Mensajes rotes */
router.get("/mensajes/:mensajes_user", validarToken, (req, res, next) => {
  IntanceMensajesController.GetMensajes(req, res, next);
});

/* Auth Routes */
router.post(
  "/createuser",
  [
    check("userName", "el user name es obligatorio").not().isEmpty(),
    check("email", "el email es obligatorio").isEmail(),
    check("gender", "el genero es obligatorio").not().isEmpty(),
    check("password", "el password es obligatorio").not().isEmpty(),
    check("password", "el password debe tener minimo 6 caracteres").isLength({
      min: 6,
    }),
    validarCampos,
  ],
  (req, res, next) => {
    IntanceAuthController.CreateUser(req, res, next);
  }
);
router.post(
  "/login",
  [
    check("email", "el email es obligatorio").isEmail(),
    check("password", "el password es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  (req, res, next) => {
    IntanceAuthController.LoginAccount(req, res, next);
  }
);
router.get("/renew", validarToken, (req, res, next) => {
  IntanceAuthController.RenovationToken(req, res, next);
});
/* GET home page. */
router.get("/", function (req, res, next) {
  res.send("hola, soy el backend de socket chat");
});

module.exports = router;
