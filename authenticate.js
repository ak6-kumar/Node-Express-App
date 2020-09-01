var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');
var jwtStrategy = require('passport-jwt').Strategy;
var extractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');
var config = require('./config');
var facebookTokenStrategy = require('passport-facebook-token');

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user){
    return jwt.sign(user,config.secretKey,{expiresIn:360000000});
};

var opts = {};

opts.jwtFromRequest = extractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey  = config.secretKey;

exports.jwtPassport = passport.use(new jwtStrategy(opts,
    (jwt_payload,done)=>{
        console.log(jwt_payload);
        User.findOne({_id:jwt_payload._id},(err,user)=>{
            if(err){
                return done(err,false);
            }
            else if(user){
                return done(null,user);
            }
            else{
                return done(null,false);
            }
        });
    }));

exports.verifyUser = passport.authenticate('jwt',{session:false});
exports.verifyAdmin = (req,res,next)=>{
    const token = req.header('Authorization').replace('bearer ','');
    const decoded = jwt.verify(token,config.secretKey);
    User.findOne({_id:decoded._id})
    .then((user)=>{
        if(!user.admin){
            var err= new Error("You are not authorized to perform this operation!");
            err.status = 403;
            req.user = user;
            return next(err);
        }
    else{
            return next();
        }
    },err=>next(err))
    .catch((err)=>next(err));
};


exports.facebookPassport = passport.use(new facebookTokenStrategy({
    clientID:config.facebook.clientId,
    clientSecret:config.facebook.clientSecret
},(accessToken,refreshToken,profile,done)=>{
    User.findOne({facebookId:profile.id},(err,user)=>{
        if(err){
            return done(err,false);
        }
        else if(!err && user!==null){
            return done(null,user);
        }
        else{
            user = new User({
                username:profile.displayName,
            });
            user.facebookId=profile.id;
            user.firstname = profile.name.givenName;
            user.lastname = profile.name.familyName;
            user.save((err,user)=>{
                if(err){
                    return done(err,false);
                }
                else{
                    return done(null,user);
                }
            });
        }
    })
}));