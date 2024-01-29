const { response } = require("express");
const userModel = require("../models/usuario");

// const getUsers = async (req, res) => {
//   const usuarios = await userModel.find({}, "name email role google");

//   res.json({
//     ok: true,
//     usuarios,
//   });
// };

const getUsers = async(req, res) => {

  const desde = Number(req.query.desde) || 0;

  const [ usuarios, total ] = await Promise.all([
      userModel
          .find({}, 'name email role google img')
          .skip( desde )
          .limit( 5 ),

      userModel.countDocuments()
  ]);


  res.json({
      ok: true,
      usuarios,
      total
  });

}

const updateUser = async (req, res = response) => {
  const uid = req.params.id;

  try {
    const userDB = await userModel.findById(uid);

    if (!userDB) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un usuario por ese id",
      });
    }
    const { password, google, email, ...field } = req.body;

    if (userDB.email !== email) {
      const existeEmail = await userModel.findOne({ email });
      if (existeEmail) {
        return res.status(400).json({
          ok: false,
          msg: "Ya existe un user con ese email",
        });
      }
    }

    field.email = email;
    const newUserUpdate = await userModel.findByIdAndUpdate(uid, field, {
      new: true,
    });

    res.json({
      ok: true,
      usuario: newUserUpdate,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

const deleteUser = async (req, res = response) => {
  const uid = req.params.id;

  try {
    const userDB = await userModel.findById(uid);

    if (!userDB) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un usuario por ese id",
      });
    }

    await userModel.findByIdAndDelete(uid);

    res.json({
      ok: true,
      msg: "user eliminado",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "error inesperado",
    });
  }
};
const getUserDetail = async (req, res = response) => {
  const uid = req.uid; // UID extraído del token JWT

  try {
      const userDB = await userModel.findById(uid, "name email role google");

      if (!userDB) {
          return res.status(404).json({
              ok: false,
              msg: "No existe un usuario con ese ID",
          });
      }

      res.json({
          ok: true,
          usuario: userDB
      });
  } catch (error) {
      console.log(error);
      res.status(500).json({
          ok: false,
          msg: "Error inesperado al obtener detalles del usuario",
      });
  }
};

module.exports = {
  getUsers,
  updateUser,
  deleteUser,
  getUserDetail
};
