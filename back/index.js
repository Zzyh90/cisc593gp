const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/users");
const appointmentsRoute = require("./routes/appointments");

const cors = require('cors')
const path = require("path");
const session = require('express-session');

dotenv.config();


app.use(express.urlencoded({extended: true}));
app.use(
    session({
        name: 'cisc593project',
        secret: "zzzaaaqqwqwe",
        saveUninitialized: true,
        resave: false
    })
);

// app.use((req, res, next) => {
//     //console.log(req.session.user);
//     next();
// })

mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if(err) console.log("cant connect",err)
    else{
        console.log("Connected to MongoDB");
    }
  }
);
app.use("/images", express.static(path.join(__dirname, "public/images")));

//middleware
app.use(express.json());
app.use(cors())

app.use("/api/users", userRoute);
app.use("/api/appointments", appointmentsRoute);


app.disable('etag');

app.listen(8800, () => {
  console.log("Backend server is running!");
});