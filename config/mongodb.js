import mongoose from "mongoose";
import env from "../env.json";
const db="mongodb://" + env.config.mongodb.host + ":" + env.config.mongodb.port + "/" + env.config.mongodb.database;
mongoose.Promise=global.Promise;
mongoose.connect(db, {
    useNewUrlParser:true
}).then(() => {
    console.log("db connected")
},error => {
    console.log("problem in connection"+error)
});
export default class DatabaseConfig {}
