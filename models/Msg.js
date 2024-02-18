const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const msgSchema = Schema({
    msg:{
        type:String,
        required:true
    },
    read:{
        type:Boolean,
        default:false
    }
},{
    timestamps: true
});

let Msg = mongoose.model("Msg", msgSchema);

module.exports = Msg;