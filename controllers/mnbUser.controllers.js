const MNBUser = require("../models/mnbUserSchema");
const Auth = require("../models/auth.schema");
const bcrypt = require('bcryptjs');
const {
  sendPasswordChangedNotification,
  sendProfileUpdatedNotification,

  sendAccountDeletedNotification
} = require("../utils/notifications");


// =======================================
// CREATE MNB USER PROFILE
// =======================================
const createMNBUser = async(req,res)=>{


try{


const {
username,
profilePicture
}=req.body;



if(!username){

return res.status(400).json({

message:"Username is required"

});

}



const cleanUsername =
username
.trim()
.toLowerCase();





const account =
await Auth.findById(
req.user.id
);



if(!account){

return res.status(404).json({

message:"Authentication account not found"

});

}





// Allow old users without accountType

if(
account.accountType &&
account.accountType !== "user"
){

return res.status(403).json({

message:"Only users can create MNB profile"

});

}






const existingProfile =
await MNBUser.findOne({

user:req.user.id

});



if(existingProfile){

return res.status(409).json({

message:"MNB profile already exists"

});

}






const usernameTaken =
await MNBUser.findOne({

username:cleanUsername

});



if(usernameTaken){

return res.status(409).json({

message:"Username already taken"

});

}







const newUser =
await MNBUser.create({

user:req.user.id,

username:cleanUsername,

profilePicture:
profilePicture || ""

});







return res.status(201).json({

message:
"MNB User profile created successfully",

user:newUser

});





}catch(error){


console.log(

"CREATE MNB USER ERROR:",

error.message

);



return res.status(500).json({

message:error.message

});


}


};

// =======================================
// CHECK USER PROFILE
// =======================================

const checkMNBProfile = async (req, res) => {

  try {

    const profile = await MNBUser.findOne({
      user: req.user.id
    });

    return res.status(200).json({
      exists: !!profile
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message
    });

  }

};

// =======================================
// GET CURRENT USER PROFILE
// =======================================

const getMNBUserProfile = async(req,res)=>{


  try{


    const user =
      await MNBUser.findOne({

        user:req.user.id

      })
      .populate(
        "user",
        "email accountType isAdmin"
      );

console.log("MNB PROFILE:", user);

    if(!user){

      return res.status(404).json({

        message:"MNB User profile not found"

      });

    }



    res.status(200).json(user);



  }catch(error){


    res.status(500).json({

      message:error.message

    });


  }


};






// =======================================
// UPDATE USER PROFILE
// =======================================

const updateMNBUserProfile = async(req,res)=>{


try{


const updatedUser =
await MNBUser.findOneAndUpdate(

{
 user:req.user.id
},

req.body,

{
 new:true
}

);



if(!updatedUser){

return res.status(404).json({

message:"User profile not found"

});

}

// send notification

try{

await sendProfileUpdatedNotification(
  updatedUser.user.email
);

}catch(emailError){

console.log(
"PROFILE UPDATE EMAIL ERROR:",
emailError.message
);

}


res.status(200).json({

message:"Profile updated successfully",

user:updatedUser

});



}catch(error){


res.status(500).json({

message:error.message

});


}


};








// =======================================
// DELETE USER PROFILE
// =======================================

const deleteMNBUserProfile = async(req,res)=>{


try{


const deletedProfile =
await MNBUser.findOneAndDelete({

user:req.user.id

});



if(!deletedProfile){

return res.status(404).json({

message:"Profile not found"

});

}


if(account){

try{

await sendAccountDeletedNotification(
account.email
);

}catch(emailError){

console.log(
"DELETE EMAIL ERROR:",
emailError.message
);

}

}

// remove authentication account too

await Auth.findByIdAndDelete(
req.user.id
);



res.status(200).json({

message:"Account deleted successfully"

});



}catch(error){


res.status(500).json({

message:error.message

});


}


};







// =======================================
// USER DASHBOARD DATA
// =======================================

const getUserDashboard = async(req,res)=>{


try{


const user =
await MNBUser.findOne({

user:req.user.id

})
.populate(
"user",
"email accountType"
);



if(!user){

return res.status(404).json({

message:"User dashboard unavailable"

});

}



res.status(200).json({

message:"Welcome to MNB User Dashboard",

user,

options:[

{

title:"Explore Events",

route:"/explore-events",

description:
"Browse upcoming events and discover experiences."

},

{

title:"Book Events",

route:"/events",

description:
"Reserve seats and manage your bookings."

}

]


});



}catch(error){


res.status(500).json({

message:error.message

});


}


};


const changePassword = async (req, res) => {

  try {

    const {
      currentPassword,
      newPassword,
      confirmPassword
    } = req.body;

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) 
    
    {

      return res.status(400).json({

        message: "All fields are required"


      });

    }

    if (newPassword !== confirmPassword) {

      return res.status(400).json({

        message: "Passwords do not match"

      });

    }

    if (newPassword.length < 6) {

      return res.status(400).json({

        message: "Password must be at least 6 characters"

      });

    }

    const account = await Auth.findById(
      req.user.id
    );

    if (!account) {

      return res.status(404).json({

        message: "Account not found"

      });

    }

    const match = await bcrypt.compare(

      currentPassword,

      account.password

    );

    if (!match) {

      return res.status(401).json({

        message: "Current password is incorrect"

      });

    }

    account.password = await bcrypt.hash(

  newPassword,

  10

);


await account.save();


try {

  await sendPasswordChangedNotification(
    account.email
  );

} catch(emailError) {

  console.log(
    "PASSWORD EMAIL ERROR:",
    emailError.message
  );

}


return res.status(200).json({

  message: "Password changed successfully"

});

  } catch (error) {

    console.log( "CHANGE PASSWORD ERROR:", error);

    return res.status(500).json({

      message: error.message

    });

  }

};




module.exports = {


createMNBUser,

getMNBUserProfile,

updateMNBUserProfile,

deleteMNBUserProfile,

getUserDashboard,

checkMNBProfile, 

changePassword


};