const { response } = require('express');

const TaskModel = require('../model/task.model');
const UserModel = require('../../user/models/usuario');
const transporter = require('../../../shared/services/email.controller');


const getTasks = async (req, res) => {
    try {
      const tasks = await TaskModel.find()
                              .populate('creator', 'name') 
                              .populate('assignedTo', 'name'); 
  
      res.json({
        ok: true,
        tasks
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        ok: false,
        message: 'Error obteniendo las tareas'
      });
    }
  }
  
  const createTask = async(req, res = response) => {
    const uid = req.uid;
    const task = new TaskModel({ 
        creator: uid,
        ...req.body 
    });

    try {
        const taskDB = await task.save();
        // Envía una notificación si se ha asignado a alguien
        // if (taskDB.assignedTo) {
        //     sendTaskAssignedNotification(taskDB.assignedTo, taskDB.title);
        // }

        res.json({
            ok: true,
            task: taskDB
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Error al crear la tarea'
        });
    }
};

const updateTask = async(req, res = response) => {
    const taskId = req.params.id;
    const uid = req.uid;

    try {
        const task = await TaskModel.findById(taskId);
        if (!task) {
            return res.status(404).json({
                ok: false,
                message: 'Tarea no encontrada por ese id'
            });
        }

        // Solo el creador puede actualizar la tarea
        if (task.creator.toString() !== uid.toString()) {
            return res.status(401).json({
                ok: false,
                message: 'No tiene privilegios para editar esta tarea'
            });
        }

        const updatedTask = await TaskModel.findByIdAndUpdate(taskId, req.body, { new: true });
        res.json({
            ok: true,
            task: updatedTask
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Error al actualizar la tarea'
        });
    }
};

const deleteTask = async(req, res = response) => {
    const taskId = req.params.id;
    const uid = req.uid;

    try {
        const task = await TaskModel.findById(taskId);
        if (!task) {
            return res.status(404).json({
                ok: false,
                message: 'Tarea no encontrada por ese id'
            });
        }

        // Verifica si el creador de la tarea está definido y si coincide con el uid
        if (!task.creator || task.creator.toString() !== uid.toString() || task.complete) {
            return res.status(401).json({
                ok: false,
                message: 'No tiene privilegios para eliminar esta tarea o la tarea ya está completada'
            });
        }

        await TaskModel.findByIdAndRemove(taskId);
        res.json({
            ok: true,
            message: 'Tarea eliminada'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Error al eliminar la tarea'
        });
    }
};



async function sendTaskAssignedNotification(userId, taskTitle) {
  
    const user = await UserModel.findById(userId);
    if (user && user.email) {
        const mailOptions = {
            from: 'flowermoreno7@gmail.com', 
            to: user.email,
            subject: `Una nueva tarea asignada: ${taskTitle}`,
            text: `Le han asignado una nueva tarea: ${taskTitle}`, 
        };
        
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Mensaje enviado: %s', info.messageId);
        });
    }
}

// En tu controlador de tareas (task.controllers.js)
const getTaskDetail = async (req, res) => {
    const taskId = req.params.id;

    try {
        const task = await TaskModel.findById(taskId)
                                   .populate('creator', 'name email')
                                   .populate('assignedTo', 'name email');

        if (!task) {
            return res.status(404).json({
                ok: false,
                msg: 'Tarea no encontrada con ese ID'
            });
        }

        res.json({
            ok: true,
            task
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener detalle de la tarea'
        });
    }
};







module.exports = {
    getTasks,
    deleteTask,
    updateTask,
    createTask,
    getTaskDetail
}