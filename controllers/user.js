var express = require("express");
var router = express.Router();
var sequelize = require("../db");

var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var User = sequelize.import("../models/user");

// User.sync({force:true})

router.post("/signup", (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let username = req.body.username;
    User.create({
        email: email,
        password: bcrypt.hashSync(password, 10),
        username: username,
        admin: req.body.admin
    }).then(createSuccess = (user) => {
        let token = jwt.sign({id: user.id }, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24})
        res.json({
            user: user,
            message: "user created",
            sessionToken: token
        })
    },
    createError = err => res.status(500).json(err.message))
})

router.post('/login', (req, res) => {
    User.findOne({ where: { email: req.body.email }})
      .then(
        user => {
          if (user) {
            bcrypt.compare(req.body.password, user.password, (err, matches) => {
              if (matches) {
                let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 })
                res.json({
                  user: user,
                  message: 'successfully authenticated',
                  sessionToken: token 
                })
              } else {
                res.status(502).send({ error: 'bad gateway' })
              }
            })
          } else {
            res.status(500).send({ error: 'failed to authenticate' })
          }
        },
        err => res.status(501).send({ error: 'failed to process'})
      )
  })

module.exports = router;