import mongoose from "mongoose"

export const connectDb = (dburl?: string) => {
    mongoose.connect(`${dburl}`)
}

