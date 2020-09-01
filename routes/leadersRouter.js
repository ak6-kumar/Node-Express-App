var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Leaders = require('../models/leaders');
var authenticate = require('../authenticate');
const cors = require('./cors');

var leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions,(req,res,next)=>{
    Leaders.find({})
    .then((Leaders)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(Leaders);
    },(err)=>next(err))
    .catch((err)=>next(err));
})

.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Leaders.create(req.body)
    .then((leader)=>{
        console.log("One leader has been inserted"+leader);
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leader);
    },(err)=>next(err))
    .catch((err)=>next(err));
})

.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res)=>{
    res.statusCode=403;
    res.end("PUT operation not supported on Leaders");
})

.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
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
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get((req,res,next)=>{
    Leaders.findById(req.params.leaderId)
    .then((leader)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leader);
    },(err)=>next(err))
    .catch((err)=>next(err));
})

.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res)=>{
    res.statusCode=403;
    res.end("POST operation not supported on a particular leader");
})

.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res)=>{
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

.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res)=>{
    findByIdAndDelete(req.params.leaderId)
    .then((leader)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leader);
    },(err)=>next(err))
    .catch((err)=>next(err));
});


module.exports = leaderRouter;