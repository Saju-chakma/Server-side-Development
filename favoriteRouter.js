var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Favorites = require('../models/favorites');
var Dishes = require('../models/dishes');
var favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());
var Verify = require('./verify');
 
favoriteRouter.route('/')
.all(Verify.verifyOrdinaryUser)

.get(function (req, res, next) {
    Favorites.find({})
	.populate('postedBy')
	.populate('dishes')
    .exec(function (err, favorite) {
        if (err) throw err;
        res.json(favorite);
    });
})

.post(function (req, res, next) {
Favorites.create(req.body, function (err, favorite) {
	if (err) throw err;   
	favorite.postedBy = req.decoded._doc._id;
	favorite.dishes.push(req.body);
	favorite.save(function (err, favorite) {
		if (err) throw err;
     console.log('Created Favorites!');
            res.json(favorite);;
        });
    });
})


.delete(function (req, res, next) {
     Favorites.remove({}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
	   });
    });
 
favoriteRouter.route('/dishes')
.all(Verify.verifyOrdinaryUser)


.post(function (req, res, next) {
	Favorites.findOne({}, function (err, favorite) {
		if (err) throw err;
		for(var key in req.body) {
			var index = favorite.dishes.indexOf(req.body[key])
			console.log(index);
			if (index == -1){
				favorite.dishes.push(req.body)
				console.log('Favorite added!');
            };
         };	
        favorite.save(function (err, favorite) {
            if (err) throw err;
            console.log('Updated Favorites!');
            res.json(favorite);
        });
    });
 });
 
favoriteRouter.route('/dishes/:dishObjectId')
.all(Verify.verifyOrdinaryUser)
 

.delete(function (req, res, next) {
	Favorites.findOne({}, function (err, favorite) {
		if (err) throw err;
		var index = favorite.dishes.indexOf(req.params.dishObjectId);
		favorite.dishes.splice(index, 1)
		  console.log('Favorite deleted!'); 
		favorite.save(function (err, favorite) {
			if (err) throw err;
            console.log('Updated Favorites!'); 
            res.json(favorite);;
        });
    });
});
	
module.exports = favoriteRouter;
	