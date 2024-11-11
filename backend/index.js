const connectToMongo = require("./db");
const express = require("express");
const app = express();
const port = 5000;
var cors = require("cors");

connectToMongo();
app.use(cors())


app.use(express.json());

// Available Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/face', require('./routes/faceRecognition'));


app.get('/', (req, res)=> {
    res.send("Domini evaru?")
})

app.listen(port, ()=> {
    console.log(`my-app backend is listening on port ${port}`);
})
