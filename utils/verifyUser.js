const jwt = require("jsonwebtoken");


const verifyToken = (req, res, next) => {

  console.log("========== VERIFY TOKEN ==========");


  console.log(
    "AUTH HEADER:",
    req.headers.authorization
  );


  console.log(
    "COOKIE TOKEN:",
    req.cookies?.access_token
  );


  let token;



  // 1. Prefer cookie token first
  // This keeps organizer/admin/user sessions consistent
  if (req.cookies?.access_token) {

    token = req.cookies.access_token;


    console.log(
      "TOKEN SOURCE: COOKIE"
    );


  }


  // 2. Fallback to Authorization header
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {

    token =
      req.headers.authorization.split(" ")[1];


    console.log(
      "TOKEN SOURCE: HEADER"
    );

  }



  console.log(
    "TOKEN USED:",
    token
  );



  if (!token) {

    return res.status(401).json({

      message: "Token missing"

    });

  }





  try {


    const decoded =
      jwt.verify(

        token,

        process.env.JWT_SECRET

      );



    console.log(
      "DECODED TOKEN:",
      decoded
    );



    req.user = decoded;



    next();



  } catch(error) {


    console.log(
      "JWT VERIFY ERROR:",
      error.message
    );



    return res.status(403).json({

      message: "Token invalid"

    });


  }


};



module.exports = {
  verifyToken
};