import {model, Schema} from "mongoose"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import mongoose from "mongoose";


const validateEmail = (email: string) => {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/;
    return re.test(email)
};

export interface UserDocument  {
    name: string;
    email: string;
    password: string;
    role: string;
}

// to attach the mongoose instances like createJWT to the user model type for TS purposes, we create the IUSer interface that extends the userDocument interface 
export interface IUser extends UserDocument {
    comparePassword(passwordInput: string): Promise<Boolean>;
    createJWT(): Promise<string>;
}

// export interface UserInterface extends mongoose.Model<UserDocument> {
//     build(attr: IUser): UserDocument
// }

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        trim: true, // removes white spaces
        lowercase: true,
        unique: true,
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/, 'Please fill a valid email address'],
        required: [true, 'Email address is required']
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    role: {
        type: String,
        required: [true, "Role is required"]
    },
})

// we can use the mongoose middlewear (pre) to hash the p/word before saving
UserSchema.pre('save', async function(next) {
    // Only has the password if its new or has been modied
    if (this.isModified("password")) {
        const salt = await bcrypt.genSalt(12)
        this.password = await bcrypt.hash(this.password, salt)
    }
    // else do not hash
    else {
        return next()
    }
})

// UserSchema.statics.build = function(user: IUser) {
//     return new UserModel(user)
// }

// we can also use the mongoose instance methods to create our token like so
UserSchema.methods.createJWT = async function (): Promise<string> {
    const token = await jwt.sign(
        {userId: this._id, email: this.email, role: this.role}, 
        `${process.env.JOBS_API_JWT_SECRET}`, 
        {expiresIn: "10d"}
    )

    return token
}

// we can use the mongoose instance method comparePassword to compare if the password sent by user with the hashed p/word on the DB
UserSchema.methods.comparePassword = async function(passwordInput: string): Promise<boolean> {
    const isPasswordMatch = await bcrypt.compare(passwordInput, this.password)
    return isPasswordMatch
}

export const UserModel = model<IUser>("User", UserSchema)

