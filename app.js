require("dotenv").config();

var express = require('express');
var app = express();

const bodyParser = require("body-parser");
const sequelize = require("./db");

const user = require("./controllers/user");
const event = require("./controllers/event");
const comments = require("./controllers/comments")

app.use(require("./middleware/headers"));

sequelize.sync();

app.use(bodyParser.json())


app.use("/user", user);

app.use("/event", event);

app.use("/comments", comments);

app.listen(process.env.PORT, () => {
    console.log(`App is hearing you lound and clear on ${process.env.PORT}`);
})