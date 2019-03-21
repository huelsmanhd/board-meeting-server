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
    createError = err => res.json({
      error: "failed to authenticate",
      status: 500 
    }))
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
                res.json({ 
                  error: 'bad gateway',
                  status: 502
                 })
              }
            })
          } else {
            res.json({ 
              error: 'failed to authenticate',
              status: 500
             })
          }
        },
        err => res.json({ 
          error: 'failed to process',
          status: 501
        })
      )
  })

module.exports = router;