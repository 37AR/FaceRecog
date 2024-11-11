const mongoose = require("mongoose");
const mongoURL = "mongodb://localhost:27017/FaceRecog";

const connectToMongo = async ()=>{
    await mongoose.connect(mongoURL)
    console.log("Connected to MongoDB successfully.");
}

module.exports = connectToMongo;