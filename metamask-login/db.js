require("dotenv").config();
const mongoose = require("mongoose");
module.exports = () => {
  const connectionPaams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  try {
    mongoose.connect(process.env.MONGO_URI, connectionPaams);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
};
