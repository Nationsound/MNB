const mongoose = require("mongoose");


const authSchema = new mongoose.Schema(
{

email:{

type:String,

required:true,

unique:true,

trim:true,

lowercase:true

},



password:{

type:String,

required:true,

trim:true

},




accountType:{

type:String,

enum:[

"user",

"organizer",

"admin"

],

default:"user"

},




isAdmin:{

type:Boolean,

default:false

},




resetPasswordToken:String,


resetPasswordExpires:Date



},
{
timestamps:true
}
);



const Auth =
mongoose.model(
"Auth",
authSchema
);



module.exports = Auth;