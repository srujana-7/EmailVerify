const express = require("express");
const app = express();
//const cors = require("cors");
const mongoose = require("mongoose")

const port = process.env.PORT || 6000
//const { MongoClient } = require("mongodb");

const userRouter = require("./routes/user")



//app.use(cors());
app.listen(port, () => {
    console.log(` app listening on port ${port}`);
  });


app.use(express.json())

app.get("/test", (req, res) => {
  res.send({ message: "server test" });
  console.log("server test");
});


mongoose.connect('mongodb://127.0.0.1:27017/sesTest')

