const { response } = require("express");
const bcrypt = require("bcryptjs");

const UserModel = require("../../user/models/usuario");
const { generarJWT } = require("../../../shared/utils/jwt");

const register = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const existeEmail = await UserModel.findOne({ email });

    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        msg: "El correo ya está registrado",
      });
    }

    const usuario = new UserModel(req.body);

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    // Guardar usuario
    await usuario.save();

    // Generar el TOKEN - JWT
    const token = await generarJWT(usuario.id);

    res.json({
      ok: true,
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "algo paso!",
    });
  }
};

module.exports = {
  register,
};
