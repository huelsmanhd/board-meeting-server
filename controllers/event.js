var express = require("express");
var router = express.Router();
var validateSession = require("../middleware/validate-session");
var sequelize = require("../db");
var Event = sequelize.import("../models/event");

// Event.sync({force: true})

router.get("/all", validateSession, (req, res) => {
    Event.findAll().then(event => res.status(200).json(event))
    .catch(err => res.status(500).json({ error: err }));
})

//GET ONE EVENT BY ID
router.get("/event/:id", validateSession, (req, res) => {
    Event.findOne({ where: { id: req.params.id }})
    .then(event => res.status(200).json(event))
    .catch(err => res.status(500).json({ error: err }))
})


//FIND ALL USER MADE EVENTS
router.get("/user", validateSession, (req, res) => {
    Event.findAll({ where: { owner: req.user.id }})
    .then(event => res.status(200).json(event))
    .catch(err => res.status(500).json({error: err}))
})

router.post("/create", validateSession, (req, res) => {
    if(!req.error) {
        const event = {
            
            type: req.body.type,
            title: req.body.title,
            date: req.body.date,
            lat: req.body.lat,
            long: req.body.long,
            location: req.body.location,
            description: req.body.description,
            owner: req.user.id
        }

        Event.create(event)
        .then(event => res.status(200).json(event))
        .catch(err => res.json(req.errors))
    } else {
        res.status(500).json(req.errors);
    }
})
//UPDATE BY EVENT ID
router.put("/update/:id", validateSession, (req, res) => {
    let id = req.params.id;
    Event.update(req.body, { where: {id: id}})
    .then(event => res.status(200).json(event))
    .catch(err => res.json(req.errors))
})

//DELETE BY EVENT ID
router.delete("/delete/:id", validateSession, (req, res) => {
    let id = req.params.id;
    // let userid = req.user.id;

    Event.destroy({where: { id: id}})
    .then(event => res.send("IS this failing?"))
    .catch(err => res.send(500, err.message))
})


module.exports = router;