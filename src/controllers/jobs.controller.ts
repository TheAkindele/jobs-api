import {Response, Request, NextFunction} from "express"
import mongoose from "mongoose"
import { BadRequestError, UnAuthorizedError } from "../middlewears/errors"
import { JobsModel, IJobs } from "../models/jobs.model"
import { StatusCodes } from "http-status-codes"
import jwt from "jsonwebtoken"

// Jobpriviledges are given w.r.t user role
//1. Job sdvertiser:: Create job, getAllUserPostedJobs, getSingleUserjob, edit/delete job
//2. Job seeker:: fetch all jobs, fetch jobs from a particular recruiter, fetch single job

// only recruiter can create/post jobs
export const createJob = async (req: Request, res: Response) => {
    //@ts-ignore
   req.body.createdBy = req.user.userId

   //@ts-ignore
   const token = req.token

   //check that user role is recruiter
    const decodedToken = await jwt.verify(token, `${process.env.JOBS_API_JWT_SECRET}`)
    const {role}: any = decodedToken

    if (role !== "recruiter") {
        throw new UnAuthorizedError("User is not authorized to create jobs")
    }

   const job = await JobsModel.create(req.body)
 
   res.status(StatusCodes.CREATED).json({job, token })
}

// only job seeker can get all jobs posted
export const getAllJobs = async (req: Request, res: Response) => {
    //@ts-ignore
    const user = req.user
    //@ts-ignore
    const token = req.token

    let allJobs

    // const decodedToken = await jwt.verify(token, `${process.env.JOBS_API_JWT_SECRET}`)
    // const {role}: any = decodedToken

    // if (user?.role !== "candidate" || user?.role !== "recruiter") {
    //     throw new UnAuthorizedError("User is not authorized")
    // }

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

//recruiter get all jobs created by them only
export const getMyJobs = async (req: Request, res: Response) => {
     //@ts-ignore
     const user = req.user
     //@ts-ignore
     const token = req.token
 
     if (user?.role !== "recruiter" ) {
         throw new UnAuthorizedError("User is not authorized")
     }
 
     const allJobs = await JobsModel.find({createdBy: user._id})
     res.status(StatusCodes.OK).json({allJobs, user})
}

//job recruiter get a single job created by them only
export const getMyJob = async (req: Request, res: Response) => {
    //@ts-ignore
    const user = req.user
    //@ts-ignore
    const {id: jobId} = req.params

    if (user?.role !== "recruiter" ) {
        throw new UnAuthorizedError("User is not authorized")
    }


    const job = JobsModel.findOne({_id: jobId,  createdBy: user.userId})
    res.status(StatusCodes.OK).json({job, user})
}

// job seekers gets any job created by any recruiter
export const getSingleJob = async (req: Request, res: Response) => {
    //@ts-ignore
    const user = req.user
    //@ts-ignore
    const {id: jobId} = req.params

    let job

    // if (user?.role !== "recruiter" ) {
    //     throw new UnAuthorizedError("User is not authorized")
    // }

    if (user?.role === "candidate") {
        job = await JobsModel.findById(jobId)
    }

    else if (user?.role === "recruiter") {
        job = await JobsModel.findOne({_id: jobId,  createdBy: user.userId})
    }

    else throw new BadRequestError("Invalid user")

    // const job = JobsModel.findOne({_id: jobId,  createdBy: user.userId})
    res.status(StatusCodes.OK).json({job, user})
}

// a recruiter can patch/update a job they posted
export const patchJob = async (req: Request, res: Response) => {
    //@ts-ignore
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
    if (position === "" || company === "" || salary === "" ) {
        throw new BadRequestError("fields cannot be empty")
    }

    const job = await JobsModel.findOne({_id: jobId, createdBy: user.userId})
   if (!job) {
       throw new BadRequestError("No such job available")
   }

    const patchJob = await JobsModel.findByIdAndUpdate(jobId, req.body, {new: true})
    res.status(StatusCodes.OK).json({job: patchJob, user})
}

// a recruiter can put/edit a job they created
export const putJob = async (req: Request, res: Response) => {

    const user = req.user
    //@ts-ignore
    const {userId} = user

    const {id: jobId} = req.params
    const {position, salary, company} = req.body

    if (user?.role !== "recruiter" ) {
        throw new UnAuthorizedError("User is not authorized")
    }

    if (!position || !salary || !company) {
        throw new BadRequestError("Must provide position, salary and company")
    }

    const checkJob = await JobsModel.findOne({_id: jobId, createdBy: userId})
    if (!checkJob) {
        throw new BadRequestError("Job not found")
    }

    const replaceJob = await JobsModel.findByIdAndUpdate(checkJob._id, req.body, {new: true})

    res.status(StatusCodes.CREATED).json({job: replaceJob, user})
}

// a recruiter can delete a job they posted
export const deleteJob = async (req: Request, res: Response) => {
    
    const user = req.user
    //@ts-ignore
    const {userId} = user
    const {id: jobId} = req.params

    if (user?.role !== "recruiter" ) {
        throw new UnAuthorizedError("User is not authorized")
    }

    const findJob = await JobsModel.findOne({_id: jobId, createdBy: userId})

    if (!findJob) {
        throw new BadRequestError("Job does not exist")
    }

    const deleteJob = await JobsModel.findByIdAndDelete(findJob._id)

    const allJobs = await JobsModel.find({createdBy: user.userId})

    const remainingJobs = allJobs.filter((job: any) => job._id !== deleteJob?._id)

    res.status(StatusCodes.OK).json({jobs: remainingJobs, count: remainingJobs.length, user})

}

 