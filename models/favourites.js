const mongoose = require('mongoose');
const schema = mongoose.Schema;


const favSchema = new schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    dishes: [String]
},{
    timestamps:true
});

var favourites = mongoose.model('Favourite',favSchema);

module.exports = favourites;