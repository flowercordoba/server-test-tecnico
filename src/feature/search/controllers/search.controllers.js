const { response } = require('express');

const Usuario = require('../../user/models/usuario');
const Tsk = require('../../task/model/task.model');


// Controlador getTodo
const getTodo = async(req, res = response ) => {
    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda, 'i');

    const [usuarios, tasks] = await Promise.all([
        Usuario.find({ name: regex }),
        Tsk.find({ title: regex }),
    ]);

    res.json({
        ok: true,
        usuarios,
        tasks  
    });
}

// Controlador getDocumentosColeccion
const getDocumentosColeccion = async(req, res = response ) => {
    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda, 'i');

    let data = [];

    switch (tabla) {
        case 'task':
            data = await Tsk.find({ title: regex })
                            .populate('creator', 'name img')
                            .populate('assignedTo', 'name img');
            break;

        case 'usuarios':
            data = await Usuario.find({ name: regex });
            break;

        default:
            return res.status(400).json({
                ok: false,
                msg: 'La tabla tiene que ser usuarios o task'
            });
    }

    res.json({
        ok: true,
        resultados: data
    });
}


module.exports = {
    getTodo,
    getDocumentosColeccion
}

