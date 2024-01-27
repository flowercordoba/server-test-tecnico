const { Router } = require("express");
const { login } = require("../controllers/login.controller");
const { register } = require("../controllers/register.controller");
const { check } = require("express-validator");
const {
  FildValidation,
} = require("../../../shared/middlewares/fieldValidation");

const router = Router();

router.post(
  "/login",validarJWT,
  [
    check("email", "El email es obligatorio").isEmail(),
    check("password", "El password es obligatorio").not().isEmpty(),
    FildValidation,
  ],
  login
);

router.post(
  "/register",
  [
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("password", "El password es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    FildValidation
    ],
  register
);

module.exports = router;
