var express = require('express');
var bodyParser = require('body-parser');

var leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.all((req,res,next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    next();
})

.get((req,res)=>{
    res.end("Will send all the leaders to you!");
})

.post((req,res)=>{
    res.end("Will add the leader: "+req.body.name+" with details: "+req.body.discription);
})

.put((req,res)=>{
    res.statusCode=403;
    res.end("PUT operation not supported on leaders");
})

.delete((req,res)=>{
    res.end("Deleting the leaders you want");
});

leaderRouter.route('/:leaderId')
.get((req,res)=>{
    res.end("Will send the details of leader: "+req.params.leaderId+" to you");
})

.post((req,res)=>{
    res.statusCode=403;
    res.end("POST operation not supported on a particular leader");
})

.put((req,res)=>{
    res.write("Updating the leader: "+ req.params.leaderId+"\n" );
    res.end("Will update the leader "+req.body.name+" with details "+req.body.discription);
})

.delete((req,res)=>{
    res.end("Deleting the leader: "+req.params.leaderId);
});


module.exports = leaderRouter;