import mongoose, { Schema } from "mongoose";
const schema=mongoose.Schema;

let leadGenerator=new schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    contactno:{
        type:Number
    },
    country:{
        type:String
    },
    description:{
        type:String
    },
    status:{
        type:Boolean
    },
    uid:{
        type:String
    }
},{
    collection: "leads", versionKey: false
});
module.exports=mongoose.model('leadGenerator',leadGenerator);