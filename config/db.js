const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

//Function responsible for connecting with database
const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    });

    console.log("MongoDB connected.....");
  } catch (err) {
    console.error(err.message);
    //Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
