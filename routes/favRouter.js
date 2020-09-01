var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const favourites = require('../models/favourites');
const authenticate = require('../authenticate');
var config = require('../config');
var cors = require('./cors');
var jwt = require('jsonwebtoken');
const Dishes = require('../models/dishes');


var favRouter = express.Router();
favRouter.use(bodyParser.json());

favRouter.route('/')
.get(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    const token = req.header('Authorization').replace('bearer ','');
    const decoded = jwt.verify(token,config.secretKey);
    console.log(req.user._id,decoded._id);
    favourites.find({user:decoded._id})
    .populate('user')
    .then((fav)=>{
        if(fav!==null){
            res.statusCode=200;
            res.setHeader('Content-Type', 'application/json');
            res.json(fav);
        }
        else{
            res.statusCode=200;
            res.setHeader('Content-Type', 'application/json');
            res.json({status:"You don't have any favourites yet!",fav});
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    favourites.remove({user:req.user._id})
    .then((fav)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(fav);
    })
});


favRouter.route('/:dishId')
.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    favourites.find({user:req.user._id})
    .then((fav)=>{
        if(fav.length===0){
            favourites.create({})
            .then((fav)=>{
                fav.user = req.user._id;
                fav.dishes.push(req.params.dishId);
                fav.save()
                .then((fav)=>{
                    res.statusCode=200;
                    res.setHeader('Content-Type','application/json');
                    res.json(fav);
                },(err)=>next(err))
                .catch((err)=>next(err));
            },err=>next(err))
            .catch((err)=>next(err));
        }
        else{
            if(!(fav[0].dishes.indexOf(req.params.dishId)===-1)){
                var error = new Error("Dish is already present in the list");
                error.status = 403;
                return next(error);
            }
            console.log(fav[0].dishes);
            fav[0].dishes.push(req.params.dishId);
            fav[0].save()
            .then((fav)=>{
                res.statusCode=200;
                res.setHeader('Content-Type','application/json');
                res.json(fav);
            },(err)=>next(err))
            .catch((err)=>next(err));
        }
    },err=>next(err))
    .catch((err)=>next(err));
})

.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        console.log(dish);
        if(!dish){
            var err = new Error("This dish doesn't exist in your favourites");
            err.status=403;
            return next(err);
        }
    })
    favourites.update({user:req.user._id},{$pull:{dishes:{$in:req.params.dishId}}})
    .then((fav)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(fav);
    },err=>next(err))
    .catch((err)=>next(err));
});

module.exports = favRouter;