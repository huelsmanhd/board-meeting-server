let jwt = require("jsonwebtoken");
let sequelize = require("../db");
let User = sequelize.import("../models/user");

module.exports = (req, res, next) => {
    if(req.method == "OPTIONS") {
        next();
    } else {
        let sessionToken = req.headers.authorization;
        console.log(sessionToken);
        if(!sessionToken) {
            return res.stats(403).send({auth: false, message: "No token provided."});
        } else {
            jwt.verify(sessionToken, process.env.JWT_SECRET, (err, decoded) => {
                if(decoded) {
                    User.findOne({where: {id: decoded.id}}).then(user => {
                        req.user = user;
                        next();
                    },
                    function() {
                        res.status(401).send({error: "Not authorized"});
                    });
                } else {
                    res.status(400).send({error: "Not authorized"});
                }
            })
        }
    }
}

const validateSession = (req, res, next) => {
    const token = req.headers.authorization
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (!err && decodedToken) {
        User.findOne({ where: { id: decodedToken.id }})
          .then(user => {
            if (!user) throw 'err'
            req.user = user
            return next()
          })
          .catch(err => next(err))
      } else {
        req.errors = err
        return next()
      }
    })
  }
  module.exports = validateSession