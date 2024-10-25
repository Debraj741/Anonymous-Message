import mongoose,{Schema,Document} from "mongoose";

// Design Interface for Type safety in typescript
// Message => Name of interface & it extend the class of mongoose document

export interface Message extends Document{
    content : string;
    createdAt : Date
}

// MessageSchema type => Custom schema => Schema<Message>
const MessageSchema: Schema<Message> = new Schema({
    content : {
        type: String,
        required : true
    },
    createdAt : {
        type: Date,
        required : true,
        default : Date.now
    }
})

// Interface of User
export interface User extends Document{
    username : string;
    email : string;
    password : string;
    verifyCode : string;
    verifyCodeExpiry : Date;
    isVerified : boolean;
    isAcceptingMessage : boolean;
    messages : Message[];  // message is array type but previous Message type

}

// User Schema

const UserSchema: Schema<User> = new Schema({
    username : {
        type: String,
        required : [true,"Username is Required!!"],
        trim: true,
        unique : true
    },
    email : {
        type: String,
        required : [true,"Email is Required!!"],
        unique : true,
        match : [/.+\@.+\..+/,"Please Provide Valid Email Id!!"]  //Regix Use
    },
    password : {
        type: String,
        required : [true,"Password is Required!!"]
    },
    verifyCode : {
        type: String,
        required : [true,"Verify Code is Required!!"]
    },
    verifyCodeExpiry:{
        type : Date,
        required : [true,"Verify Code Expiry is Required!!"]
    },
    isVerified:{
        type : Boolean,
        default: false
    },
    isAcceptingMessage:{
        type : Boolean,
        default: true
    },
    messages : [MessageSchema]
})

// First is if already model is created else create new model and interface also provided 

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User",UserSchema)

export default UserModel