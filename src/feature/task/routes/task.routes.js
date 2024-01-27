const { Router } = require("express");
const { check } = require("express-validator");
const {
 createTask,
 deleteTask,
 getTasks,
 updateTask,
 getTaskDetail
} = require('../controllers/task.controllers');
const { validarJWT } = require('../../../shared/middlewares/Validation-jwt');
const { FildValidation } = require('../../../shared/middlewares/fieldValidation');

const router = Router();

// Ruta para obtener las tareas
router.get('/',validarJWT, getTasks);
router.get('/detail/:id',validarJWT, getTaskDetail);

// // Ruta para crear una tarea
router.post(
  '/create',validarJWT,
  [
    check('title', 'El título es obligatorio').not().isEmpty(),
    check('title', 'El título debe tener entre 2 y 256 caracteres').isLength({ min: 2, max: 256 }),
    check('description', 'La descripción debe tener entre 2 y 1024 caracteres').isLength({ min: 2, max: 1024 }),
    check('creator', 'El creador es obligatorio y debe ser un ID válido').isMongoId(),
    check('assignedTo', 'El asignado debe ser un ID válido').optional().isMongoId(),
    FildValidation
  ],
  createTask
);

// // Ruta para actualizar una tarea
router.put(
  '/:id',validarJWT,
  [
    check('title', 'El título debe tener entre 2 y 256 caracteres').optional().isLength({ min: 2, max: 256 }),
    check('description', 'La descripción debe tener entre 2 y 1024 caracteres').optional().isLength({ min: 2, max: 1024 }),
    check('complete', 'Complete debe ser un valor booleano').optional().isBoolean(),
    check('assignedTo', 'El asignado debe ser un ID válido').optional().isMongoId(),
    FildValidation
  ],
  updateTask
);

// // Ruta para eliminar una tarea
router.delete(
  '/:id',validarJWT,
  [
    check('id', 'Se requiere un ID de tarea válido').isMongoId(),
    FildValidation
  ],
  deleteTask


  );

module.exports = router;
