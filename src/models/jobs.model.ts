import {model, Schema, Types} from "mongoose"


export interface IJobs {
    position: string;
    company: string;
    salary: string;
    createdBy?: Types.ObjectId 
}

const JobsSchema = new Schema<IJobs>({
    position: {
        type: String,
        required: [true, "Job title is required"]
    },
    company: {
        type: String,
        required: [true, "Company name is required"]
    },
    salary: {
        type: String,
        required: [true, "Salary mst be provided"]
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "please provide user"]
    }
},
    {timestamps: true}
)


export const JobsModel = model<IJobs>("Jobs", JobsSchema)
