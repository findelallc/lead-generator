import express, { response } from "express";
import util from "../helper/util";
import leadGenerator from  "../model/lead";
const router = express.Router();

// NEW LEAD DATA
router.post("/new", async (req,response,next)=>{
   let request={
        name:req.body.name,
        uid:parseInt(Date.now()/1000),
        email:req.body.email,
        contactNo:req.body.contactNo,
        country:req.body.country,
        description:req.body.description,
        status:true
   };
   const validatorkeys = Object.keys(request);
   if(!util.validateRequest(request, validatorkeys)){
        util.sendResponse(response, '', {
            message: "validation fail",
            code: 400
        })
   }
   else{
        leadGenerator(request).save().then((result)=>{
            util.sendResponse(response, result, {
                message:"lead added successfully",
                code:201
            })
        })
    }
});

// UPDATE LEAD DATA
router.patch("/update",async (request,response,next)=>{
 let object={
    identifier:request.body.uid,
    name:request.body.name,
    email:request.body.email,
    contactNo:request.body.contactNo,
    country:request.body.country,
    description:request.body.description,
    status:request.body.status
 };
 const validatorkeys = Object.keys(object);
 if(!util.validateRequest(object, validatorkeys)){
      util.sendResponse(response, '', {
          message: "validation fail",
          code: 400
      })
 }
 else{
    console.log(object.identifier)
    leadGenerator.findOneAndUpdate(
        { uid:object.identifier },
        {
            status:object.status,
            name:object.name,
            email:object.email,
            contactNo:object.contactNo,
            country:object.country,
            description:object.description
        }
    ).then(result=>{
        if(result&&Object.keys(result).length){
            util.sendResponse(response, '', {
                message: "lead updated successfully",
                code: 200
            })  
        }
        else{
            util.sendResponse(response, {}, {
                message: "request not exist",
                code: 404
            }) 
        }
    }).catch(error=>{
        util.sendResponse(response, error, {
            message: "internal server error",
            code: 500
        })   
    })
    
 }
})

// GET ALL LEADS
router.get("/list", async (req, res, next) => {
    let query = {};
    let checkParams = Object.keys(req.query);
    Object.keys(req.query).forEach(function(key) {
        if(checkParams.length > 1) {
            query = query.length ? query :  [];
            query.push({
                [key]: (req.query[key] === NaN ? 
                {$regex: req.query[key], $options:'i' } : req.query[key])
            }); 
        }
        else {
            query[key] = (req.query[key] === NaN ? 
                {$regex: req.query[key], $options:'i' } : req.query[key])
        }
    });
    console.log(query);
    leadGenerator.find(checkParams.length > 1 ? {$and: query} : query, {'_id': 0}).then(response => {
        util.sendResponse(res, response, {
            message: "Leads fetched successfully.",
            code: 200
        });
    }).catch(error => {
        util.sendResponse(res, error, {
            message: "Internal Server error.",
            code: 500
        });
    });
});

module.exports=router;