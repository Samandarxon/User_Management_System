const express = require("express");
const exphbs = require("express-handlebars");



require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

//Parsing middleware
// Parse application/x-www-from-urlencoded
app.use(express.urlencoded({ extended: false }));

// Parse application/json
app.use(express.json());

//Static Files
app.use(express.static(__dirname + "public"));

// Templating Engine
app.engine("hbs", exphbs({ extname: ".hbs" }));
app.set("view engine", "hbs");

// const latter = (req, res, next) =>{
//   console.log(`url ::> ${req.protocol}://${req.get('host')}${req.originalUrl}`);
//   next();
// }
// app.use(latter);

// Router
const router = require('./server/routes/user');
app.use('/', router);
app.listen(port, () => {
    console.log(`I am ready  to listen you `)
});
