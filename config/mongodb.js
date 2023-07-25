import mongoose from "mongoose";
import env from "../env.json";
const db="mongodb://"+env.config.mongodb.host+":"
+env.config.mongodb.port+"/"+env.config.mongodb.database;
//mongodb://127.0.0.1:27017/lead_generator
mongoose.Promise=global.Promise;
mongoose.connect(db,{
    useNewUrlParser:true
}).then(()=>{
    console.log("db connected")
},error=>{
    console.log("problem in connection"+error)
});
export default class DatabaseConfig{
    
}
