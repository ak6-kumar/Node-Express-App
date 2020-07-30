var mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const currency = mongoose.Types.Currency;

const leaderSchema = new Schema({
    name: {
        type:String,
        required:true
    },
    image: {
        type:String,
        required:true,
        unique:true
    },
    designation:{
        type:String
    },
    abbr:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    featured:{
        type:Boolean,
        required:true
    }
},
{
    timestamps:true
});

var Leaders = mongoose.model('Leader',leaderSchema);
module.exports = Leaders;