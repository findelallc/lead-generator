module.exports={
    validateRequest(request, validator){
        let counter = 0;
        validator.forEach(element => {
            if(request[element]){
                counter++;
            }
            
        });
        return counter === validator.length;
    },
    sendResponse(response, data, request){
        response.status(request.code).json({
            message: request.message || "something went wrong",
            status: request.code,
            data

        })
    }
}
