var express = require('express');
var bodyParser = require('body-parser');

var promoRouter = express.Router();
promoRouter.use(bodyParser.json());

promoRouter.route('/')
.all((req,res,next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    next();
})

.get((req,res)=>{
    res.end("Will send all the promos to you!");
})

.post((req,res)=>{
    res.end("Will add the promo: "+req.body.name+" with details: "+req.body.discription);
})

.put((req,res)=>{
    res.statusCode=403;
    res.end("PUT operation not supported on promos");
})

.delete((req,res)=>{
    res.end("Deleting the promos you want to");
});

promoRouter.route('/:promoId')
.get((req,res)=>{
    res.end("Will send the promo: "+req.params.promoId+" to you");
})

.post((req,res)=>{
    res.statusCode=403;
    res.end("POST operation not supported on a particular promo");
})

.put((req,res)=>{
    res.write("Updating the promo: "+ req.params.promoId+"\n" );
    res.end("Will update the promo "+req.body.name+" with details "+req.body.discription);
})

.delete((req,res)=>{
    res.end("Deleting the promo: "+req.params.promoId);
});


module.exports = promoRouter;