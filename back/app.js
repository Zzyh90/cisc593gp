const express = require('express');
const app = express();
const configRoutes = require('./routes');
const session = require('express-session');
const server = require('http').createServer(app);
// const path = require('path');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(
    session({
        name: 'cisc593project',
        secret: "zzzaaaqqwqwe",
        saveUninitialized: true,
        resave: false
    })
);

app.use((req, res, next) => {
    //console.log(req.session.user);
    next();
})

configRoutes(app);

server.listen(4000, () => {
    console.log("Starting cisc593 backend api");
    console.log('Your routes will be running on http://localhost:4000');
});