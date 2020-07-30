var mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const currency = mongoose.Types.Currency;

const promoSchema = new Schema({
    name: {
        type:String,
        required:true
    },
    image: {
        type:String,
        required:true,
        unique:true
    },
    label:{
        type:String
    },
    price:{
        type:currency,
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
},{
    timestamps:true
});

var Promotions = mongoose.model('Promo',promoSchema);

module.exports = Promotions;

