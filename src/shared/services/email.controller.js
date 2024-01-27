const nodemailer = require('nodemailer');
require('dotenv').config();


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'flowermoreno7@gmail.com',
        pass:'Diosymimadre.8',
    }
});

module.exports = transporter;
