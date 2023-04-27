const mongoose = require("mongoose");

const connectDB = async (DB) => {
  try {
    await mongoose.connect(`mongodb://localhost/${DB}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Established a connection to the ${DB} database`);
  } catch (error) {
    console.log(`Something went wrong when connecting to the ${DB} database`, error);
  }
};

module.exports = connectDB;