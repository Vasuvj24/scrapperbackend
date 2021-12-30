const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recentSchema = new Schema({
    recent:{
        type:String,
        required:true
    }
},{timestamps:true});
const Recent = mongoose.model('Recent',recentSchema);
module.exports = Recent;