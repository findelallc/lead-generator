import app from "./app";
let http=require('http');
const port=process.env.port || 5002;
const server=http.createServer(app);
server.listen(port);
console.log("my server is running on port:"+port);