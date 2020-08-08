var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Leaders = require('../models/leaders');
var authenticate = require('../authenticate');

var leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.get((req,res,next)=>{
    Leaders.find({})
    .then((Leaders)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(Leaders);
    },(err)=>next(err))
    .catch((err)=>next(err));
})

.post(authenticate.verifyUser,(req,res,next)=>{
    Leaders.create(req.body)
    .then((leader)=>{
        console.log("One leader has been inserted"+dish);
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leader);
    },(err)=>next(err))
    .catch((err)=>next(err));
})

.put(authenticate.verifyUser,(req,res)=>{
    res.statusCode=403;
    res.end("PUT operation not supported on Leaders");
})

.delete(authenticate.verifyUser,(req,res,next)=>{
    Leaders.remove({})
    .then((Leaders)=>{
        console.log("All the Leaders has been removed");
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(Leaders);
    },(err)=>next(err))
    .catch((err)=>next(err));
    });

leaderRouter.route('/:leaderId')
.get((req,res,next)=>{
    Leaders.findById(req.params.leaderId)
    .then((leader)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leader);
    },(err)=>next(err))
    .catch((err)=>next(err));
})

.post(authenticate.verifyUser,(req,res)=>{
    res.statusCode=403;
    res.end("POST operation not supported on a particular leader");
})

.put(authenticate.verifyUser,(req,res)=>{
    findByIdAndUpdate(req.params.leaderId,{
        $set:req.body
    },{new:true})
    .then((leader)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leader);
    },(err)=>next(err))
    .catch((err)=>next(err));  
})

.delete(authenticate.verifyUser,(req,res)=>{
    findByIdAndDelete(req.params.leaderId)
    .then((leader)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leader);
    },(err)=>next(err))
    .catch((err)=>next(err));
});


module.exports = leaderRouter;