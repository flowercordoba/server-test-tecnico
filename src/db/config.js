const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.db_connect, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false, // Agregar esta línea
    });

    console.log("DB Online");
  } catch (error) {
    console.log(error);
    throw new Error("Error a la hora de iniciar la BD ver logs");
  }
};

module.exports = {
  dbConnection,
};
