const { Router } = require("express");
const { login,renewToken } = require("../controllers/login.controller");
const { register } = require("../controllers/register.controller");
const { check } = require("express-validator");

const {
  FildValidation,
} = require("../../../shared/middlewares/fieldValidation");
const { validarJWT } = require('../../../shared/middlewares/Validation-jwt');

const router = Router();

router.post(
  "/login",
  [
    check("email", "El email es obligatorio").isEmail(),
    check("password", "El password es obligatorio").not().isEmpty(),
    FildValidation,
  ],
  login
);
router.get( '/renew',
    validarJWT,
    renewToken
)


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
