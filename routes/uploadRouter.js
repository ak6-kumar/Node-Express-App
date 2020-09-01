var express = require('express');
var bodyParser = require('body-parser');
const authenticate = require('../authenticate');
var multer = require('multer');
const cors = require('./cors');

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'public/images');
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname);
    }
});

const imageFilter = (req,file,cb)=>{
    if(!file.originalname.match(/\.(jpg|png|jpeg|gif)$/)){
        return cb(new Error("You can upload only images"),false);
    }
    else{
        cb(null,true);
    }
}

const upload = multer({storage:storage,fileFilter:imageFilter});

var uploadRouter = express.Router();
uploadRouter.use(bodyParser.json());

uploadRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res)=>{
    res.statusCode=403;
    res.end("GET operation not supported on uploadImage");
})

.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res)=>{
    res.statusCode=403;
    res.end("PUT operation not supported on uploadImage");
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res)=>{
    res.statusCode=403;
    res.end("DELETE operation not supported on uploadImage");
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,upload.single('imageFile'),(req,res)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','application/json');
    res.json(req.file);
})

module.exports = uploadRouter;