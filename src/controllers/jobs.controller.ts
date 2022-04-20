import {Response, Request, NextFunction} from "express"
import mongoose from "mongoose"
import { BadRequestError, UnAuthorizedError } from "../middlewears/errors"
import { JobsModel, IJobs, UserDocument } from "../models"
import { StatusCodes } from "http-status-codes"
import jwt from "jsonwebtoken"
import { reqType } from "utils/interfaces"


// Jobpriviledges are given w.r.t user role
//1. Job sdvertiser:: Create job, getAllUserPostedJobs, getSingleUserjob, edit/delete job
//2. Job seeker:: fetch all jobs, fetch jobs from a particular recruiter, fetch single job

export interface reqInterface extends Request {
    user: UserDocument;
    token: string
  }

// only recruiter can create/post jobs
export const createJob = async (req: Request, res: Response) => {
    const request = req as reqInterface

    const user = req.user
    req.body.createdBy = user?._id

    const token = request.token

   //check that user role is recruiter
    const decodedToken = await jwt.verify(token, `${process.env.JOBS_API_JWT_SECRET}`)
    const {role}: any = decodedToken

    if (role !== "recruiter") {
        throw new UnAuthorizedError("User is not authorized to create jobs")
    }

   const job = await JobsModel.create(req.body)
 
   res.status(StatusCodes.CREATED).json({job, user, token })
}

//job seekers gets all jobs posted by anyone while recruiter gets all jobs posted by them only
export const getAllJobs = async (req: Request, res: Response) => {
    const request = req as reqInterface
    
    const user = req.user
    
    const token = request.token

    let allJobs

    if (user?.role === "candidate") {
         allJobs = await JobsModel.find({})
    }

    else if (user?.role === "recruiter") {
         allJobs = await JobsModel.find({createdBy: user._id})
    }

    else throw new BadRequestError("Invalid user")

    // const allJobs = await JobsModel.find({})
    res.status(StatusCodes.OK).json({jobs: allJobs, user})
}

// recruiter can search for one of their jobs while job seekers gets any job created by any recruiter
export const getSingleJob = async (req: Request, res: Response) => {
    
    const user = req.user
    
    const {id: jobId} = req.params

    let job

    if (user?.role === "candidate") {
        job = await JobsModel.findById(jobId)
    }

    else if (user?.role === "recruiter") {
        job = await JobsModel.findOne({_id: jobId,  createdBy: user?._id})
        if (!job || job === null) {
            throw new BadRequestError("User has no such job post")
        }
    }

    // else throw new BadRequestError("Invalid user")

    // const job = JobsModel.findOne({_id: jobId,  createdBy: user.userId})
    res.status(StatusCodes.OK).json({job, user})
}

// a recruiter can patch/update a job they posted
// patch allows for partial update
export const patchJob = async (req: Request, res: Response) => {
    const user = req.user
    const {id: jobId} = req.params

    if (user?.role !== "recruiter" ) {
        throw new UnAuthorizedError("User is not authorized")
    }

    if (!jobId) {
        throw new BadRequestError("job ID is required")
    }
    
    const {company, salary, position } = req.body

    const isEmpty = Object.keys(req.body).length === 0;
    if (isEmpty) {
        throw new BadRequestError("request body cannot be empty")
    }
    // if (position === "" || company === "" || salary === "" ) {
    //     throw new BadRequestError("fields cannot be empty")
    // }

    const job = await JobsModel.findOne({_id: jobId, createdBy: user._id})
   if (!job) {
       throw new BadRequestError("No such job available")
   }

    const patchJob = await JobsModel.findByIdAndUpdate(jobId, req.body, {new: true})
    res.status(StatusCodes.OK).json({job: patchJob, user})
}

// a recruiter can put/edit a job they created
export const putJob = async (req: Request, res: Response) => {
    const user = req.user

    const {id: jobId} = req.params
    const {position, salary, company} = req.body

    if (user?.role !== "recruiter" ) {
        throw new UnAuthorizedError("User is not authorized")
    }

    if (!position || !salary || !company) {
        throw new BadRequestError("Must provide position, salary and company")
    }

    const checkJob = await JobsModel.findOne({_id: jobId, createdBy: user?._id})
    if (!checkJob) {
        throw new BadRequestError("Job not found")
    }

    const replaceJob = await JobsModel.findByIdAndUpdate(checkJob._id, req.body, {new: true})

    res.status(StatusCodes.CREATED).json({job: replaceJob, user})
}

// a recruiter can delete a job they posted
export const deleteJob = async (req: Request, res: Response) => {
    
    const user = req.user
    
    const {id: jobId} = req.params

    if (user?.role !== "recruiter" ) {
        throw new UnAuthorizedError("User is not authorized")
    }

    const findJob = await JobsModel.findOne({_id: jobId, createdBy: user?._id})

    if (!findJob) {
        throw new BadRequestError("Job does not exist")
    }

    const deleteJob = await JobsModel.findByIdAndDelete(findJob._id)

    const allJobs = await JobsModel.find({createdBy: user._id})

    const remainingJobs = allJobs.filter((job: any) => job._id !== deleteJob?._id)

    res.status(StatusCodes.OK).json({jobs: remainingJobs, count: remainingJobs.length, user})

}

 