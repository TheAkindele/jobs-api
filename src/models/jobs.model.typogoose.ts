import mongoose, {model, Schema, Types, Document, Model} from "mongoose"

//jobs schema: position, company, salary, location, createdBy, createdAt

// extends mongoose.Document
export interface JobsI extends mongoose.Document {
    position: string,
    company: string,
    salary: string,
    createdBy: Types.ObjectId 
    //| Record<string, unknown>
}

const JobsSchema = new Schema<JobsI>({
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

export const JobsModel = model<JobsI>("Jobs", JobsSchema)
