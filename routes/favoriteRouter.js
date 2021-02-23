const express = require('express');
const authenticate = require('../authenticate');
const cors = require('./cors');
const Favorite = require('./models/favorite');

const favoriteRouter = express.Router();

favoriteRouter.route('/')
.options(cors.corsWithOptions, authenticate.verifyUser, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) =>{
    Favorite.find({ user: req.user._id })
    .populate('User')
    .populate('Campsite')
    .then(favorite => {
        console.log('Favorite Created ', favorite);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    })
    .catch(err => next(err));
})

// upsert information

.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user_id})
    .then(favorite => {
        if(favorite){
            req.body.forEach(fav => {
                if(!favorite.campsite.includes(fav._id)){
                    favorite.campsites.push(fav._id);
                } else {
                    res.setHeader("Content-Type", 'text/plain');
                    res.end(`${fav._id} is already a favorite!`);
                }
            });
            favorite.save()
            .then(favorite => {
                console.log('Favorite Created ', favorite);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            })
            .catch(err => next(err));
        } else {
            Favorite.create({ user: req.user._id, campsites: req.body })
            .then(favorite => {
                console.log('Favorite Created ', favorite);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            })
            .catch(err => next(err));
        }
    })
})

.put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operaton not supported on /favorite');
})

.delete(cors.corsWithOptions, authenticate.verifyUser, (req. res) => {
    Favorite.findByOneAndDelete({req.user_id})
    .then(favorite => {
        if(favorite) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
        } else {
            res.setHeader("Content-Type", 'text/plain');
            res.end('You do not have any favourites to delete.')
        }
    })
    .catch(err => {
        return next(err);
    });
});


favoriteRouter.route('/:campsiteId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`GET operation not supported.`);
})

.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user_id})
    .then(favorite => {
        Campsite.findById({ _id: req.params.campsiteId })
        this['m-search'](_ => {
            if (!favorite){
                Favorite.create({ campsites: req.body, user: req.user._id})
                .then(favorite => {
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })
                catch(err => next(err));
            } else {
                if (favorite.campsites.includes(req.body._id)) {
                    favorite
                        .save()
                        .then(fav => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(fav);
                    )
                }
            }
        })
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operaton not supported on /partner');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req. res) => {
    Favorite.findByIdAndDelete(req.params.user_id)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});


module.exports = favoriteRouter;