const mongoose = require("mongoose");

async function connectDb(uri) {
  try {
    await mongoose.connect(uri, {
      autoIndex: true
    });
    console.log("Mongo connected");
  } catch (err) {
    console.error("Mongo connection error", err.message);
    process.exit(1);
  }
}

module.exports = connectDb;