
const { Router } = require('express');
const { check } = require('express-validator');
const { FildValidation } = require('../../../shared/middlewares/fieldValidation');

const {deleteUser,getUsers,updateUser,getUserDetail } = require('../controllers/users.controller');
const { validarJWT } = require('../../../shared/middlewares/Validation-jwt');


const router = Router();


router.get( '/all', validarJWT , getUsers );
router.get('/me', validarJWT, getUserDetail);



router.put( '/:id',
    [
        validarJWT,
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('role', 'El role es obligatorio').not().isEmpty(),
        FildValidation,
    ],
    updateUser
);

router.delete( '/:id',
    validarJWT,
    deleteUser
);



module.exports = router;