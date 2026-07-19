const jwt = require("jsonwebtoken");


const verifyToken = (req,res,next)=>{

console.log("COOKIES:",req.cookies);
const token =
req.cookies.access_token;

console.log("TOKEN:",token);

if(!token){

return res.status(401).json({

message:"Token is missing or invalid"

});

}




jwt.verify(

token,

process.env.JWT_SECRET || "secretkey",

(err,user)=>{


if(err){

return res.status(403).json({

message:"Token is invalid or expired"

});

}



req.user=user;


next();


}

);



};


module.exports={
verifyToken
};