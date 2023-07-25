import express, { response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import lead from "./controller/lead";
const app=express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use("/lead",lead)


app.use((request,response,next)=>{
    const error=new Error("not found");
    error.status=404;
    next(error);
});
app.use((error,request,response,next)=>{
   response.status(error.status || 501);
   response.json({
    error:{
        code:error.status || 501,
        message:error.message || "something went wrong"
    }
   })
});
module.exports=app;
