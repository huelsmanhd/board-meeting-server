var express = require("express");
var router = express.Router();
var validateSession = require("../middleware/validate-session");
var sequelize = require("../db");
var Comments = sequelize.import("../models/comments");

// Comments.sync({force: true})

//FINDS ALL COMMENTS FROM EVENT ID
router.get("/all/:id", validateSession, (req, res) => {
    
    Comments.findAll({ where: { eventId: req.params.id }})
    .then(event => res.status(200).json(event))
    .catch(err => res.status(500).json({error: err}))
})

//CREATE COMMENT WITH EVENT ID
router.post("/create/:id", validateSession, (req, res) => {
    let param = req.params.id;
    if(!req.error) {
        const comment = {
            
            comment: req.body.comment,
            owner: req.user.id,
            eventId: param
        }
        Comments.create(comment)
        .then(comment => res.status(200).json(comment))
        .catch(err => res.json(req.errors))
    } else {
        res.status(500).json(req.errors);
    }
})

//UPDATE BY ID OF COMMENT ID
router.put("/update/:id", validateSession, (req, res) => {
    let param = req.params.id;
    let owner = req.user.id;
    Comments.update(req.body, { where: {id: param, owner: owner}})
    .then(comment => res.status(200).json(comment))
    .catch(err => res.json(req.errors))
})

router.delete("/delete/:id", validateSession, (req, res) => {
    let param = req.params.id;
    // let userid = req.user.id;

    Comments.destroy({where: { id: param}})
    .then(event => res.send(`You removed comment ${param}`))
    .then(err => res.send(500, err.message))
})


module.exports = router; 