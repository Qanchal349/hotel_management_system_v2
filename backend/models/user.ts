import mongoose, { Document, Schema } from "mongoose";
import bycrpt from "bcryptjs";
import * as crypto from "crypto" ;

export interface IUser extends Document{
    name:string,
    email:string,
    password:string,
    avatar:{
        public_id:string,
        url:string
    } ,
    role:string,
    createdAt:Date ,
    resetPasswordToken:string,
    resetPasswordExpire:Date ,
    comparePassword(enteredPassword:string):Promise<boolean> ,
    getResetPasswordToken():string

}

const userSchema:Schema<IUser> = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter name"]
    } , 

    email:{
        type:String,
        required:[true,"Please Enter email"],
        unique:true
    } ,
    password:{
        type:String,
        required:[true,"Please Enter password"],
        select:false
    } ,
    avatar:{
         public_id:{
             type:String
         },
         url:{
            type:String
         }
    } ,

    role:{
        type:String,
        default:"user"
    },
    
    createdAt:{
        type:Date,
        default:Date.now 
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
    
})

// Encrypting the password before saving the password 

userSchema.pre('save',async function (next) {
    if(!this.isModified('password')) 
    next()

    this.password = await bycrpt.hash(this.password,10); 
    
})


// compare user password 
userSchema.methods.comparePassword = async function (enteredPassword:string):Promise<boolean> {
     return await bycrpt.compare(enteredPassword,this.password)  
      
}


// generate reset  password token
userSchema.methods.getResetPasswordToken = function():string{
    const resetToken = crypto.randomBytes(20).toString('hex') 

    // hash token 
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex') 
    this.resetPasswordExpire = Date.now()+30*60*1000;
    return resetToken;
 }


export default mongoose.models.User || mongoose.model<IUser>('User',userSchema)
