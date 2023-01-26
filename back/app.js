// const express = require('express');
// const configRoutes = require('./routes');
// const session = require('express-session');
// // const path = require('path');
// const cors = require('cors');


// const app = express();


// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({extended: true}));
// app.use(
//     session({
//         name: 'cisc593project',
//         secret: "zzzaaaqqwqwe",
//         saveUninitialized: true,
//         resave: false
//     })
// );

// app.use((req, res, next) => {
//     //console.log(req.session.user);
//     next();
// })

// configRoutes(app);

// app.listen(4000, () => {
//     console.log("Starting cisc593 backend api");
//     console.log('Your routes will be running on http://localhost:4000');
// });