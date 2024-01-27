/*

    ruta: api/todo/
*/
const { Router } = require('express');
const { validarJWT } = require('../../../shared/middlewares/Validation-jwt')

const {getDocumentosColeccion,getTodo } = require('../controllers/search.controllers');


const router = Router();


router.get('/:busqueda', validarJWT , getTodo );

router.get('/coleccion/:tabla/:busqueda', validarJWT , getDocumentosColeccion );



module.exports = router;