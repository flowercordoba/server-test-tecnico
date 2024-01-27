const { response } = require("express");
const bcrypt = require("bcryptjs");

const userModel = require("../../user/models/usuario");
const { generarJWT } = require("../../../shared/utils/jwt");

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const userDB = await userModel.findOne({ email });

    if (!userDB) {
      return res.status(404).json({
        ok: false,
        msg: "Email no encontrado",
      });
    }

    const validPassword = bcrypt.compareSync(password, userDB.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Contraseña no válida",
      });
    }
    // generate token
    const token = await generarJWT(userDB.id);

    res.json({
      ok: true,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hubo un errro inesperado",
    });
  }
};

const renewToken = async(req, res = response) => {

  const uid = req.uid;

  // Generar el TOKEN - JWT
  const token = await generarJWT( uid );

  // Obtener el usuario por UID
  const usuario = await userModel.findById( uid );


  res.json({
      ok: true,
      token,
      usuario
  });

}



module.exports = {
  login,
  renewToken
};
