const User = require("../models/user");
const Mensaje = require("../models/mensaje");
const userConnected = async (uid) => {
  const user = await User.findById(uid);
  user.online = true;
  await user.save();
  return user;
};
const userDisconnected = async (uid) => {
  const user = await User.findByIdAndUpdate(uid, { online: false });
  return user;
};
const getUser = async () => {
  try {
    const list_user = await User.find().sort("-online");
    //list_user = list_user.filter((user) => user.id !== uid);
    return list_user;
  } catch (error) {
    console.log(error);
    return;
  }
};
const SaveMensaje = async (data) => {
  try {
    const user = await User.findById(data.from);
    const mensaje = new Mensaje(data);
    mensaje.avatar = user.gender;
    await mensaje.save();
    return mensaje;
  } catch (error) {
    console.log(error);
    return;
  }
};
module.exports = {
  userConnected,
  userDisconnected,
  getUser,
  SaveMensaje,
};
