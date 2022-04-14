//Project overview:::
//1. user can register either as a job seeker or job advertiser
//2. user can login
//3. Job advertisers can post/create a job advert
//4. Job advertiser can only fetch all or a single job they created
//5. job seekers can fetch all posted jobs and/or a single job
//6. Job seeker can fetch all jobs create by an advertiser
//7. Job advertiser can only edit job advert they created
//8. Job advertiser can only delete job ad they created
// 


import express from 'express';
require("express-async-errors")
require("dotenv").config()

import { errorHandler, notFound } from './middlewears/errors';
import { jobRouter, authRouter } from './routes';
import { connectDb } from './connectDb';
import { authorizationMiddlewear } from './middlewears/auth/auth.middlewear';

//security packages
import helmet from "helmet"
// import xss from "xss-clean"
import cors from "cors"
import rateLimit from 'express-rate-limit' 
import mongoSanitize from "express-mongo-sanitize"
import hpp from "hpp"

const app = express();
app.use(express.json())

//since we're uploading to heroku or a server, we say
app.set("trust proxy", 1)

//configure the rate limiter
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
})

//security packages use. Make sure to add all these before the routes like so
app.use(limiter)
app.use(helmet())
app.use(cors())
// app.use(xss())
app.use(mongoSanitize())
app.use(hpp())

// routers
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/jobs", authorizationMiddlewear, jobRouter)
  
//error middlewears
app.use(notFound)
app.use(errorHandler)


const port = process.env.PORT || 6000
const startServer = async () => {
    try {
        await connectDb(process.env.JOBS_API_DB_URL)
        console.log("DB connected---")
        app.listen(
            port, 
            () => console.log(`server is running on port ${port}...`)
        )
    } catch (error) {
        console.log("error---", error)
    }
}

startServer()


