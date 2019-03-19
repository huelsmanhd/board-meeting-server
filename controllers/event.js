var express = require("express");
var router = express.Router();
var validateSession = require("../middleware/validate-session");
var sequelize = require("../db");
var Event = sequelize.import("../models/event");
var User = sequelize.import("../models/user");

// Event.sync({force: true})
// User.sync({force: true})
Event.belongsTo(User);


router.get("/all", validateSession, (req, res) => {
    Event.findAll({
        include: [{
            model: User,
            attributes: [
                'id',
                "username"
            ],
        }]
    }).then(event => res.status(200).json(event))
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
    Event.findAll({ 
        where: { userId: req.user.id }
    })
    .then(event => res.status(200).json(event))
    .catch(err => res.status(500).json({error: err}))
})

//GET ALL BY TYPE
router.get("/:type", validateSession, (req, res) => {
    Event.findAll( { where: { type: req.params.type }})
    .then(event => res.status(200).json(event))
    .catch(err => res.status(500).json({ error: err }))
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
            owner: req.user.id,
            userId: req.user.id,
            count: 1
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
    Event.update(req.body, { where: {id: id, userId:req.user.id}})
    .then(event => res.status(200).json(event))
    .catch(err => res.json(req.errors))
})

//DELETE BY EVENT ID
router.delete("/delete/:id", validateSession, (req, res) => {
    let id = req.params.id;
    // let userid = req.user.id;

    Event.destroy({where: { id: id}})
    .then(event => res.send("You removed event" + id))
    .catch(err => res.send(500, err.message))
})


module.exports = router;