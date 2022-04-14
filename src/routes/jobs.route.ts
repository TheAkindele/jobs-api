import { Router } from "express";
import { getAllJobs, getSingleJob, createJob, patchJob, putJob, deleteJob } from "../controllers";

export const jobRouter = Router()


jobRouter.route("/create").post(createJob)
jobRouter.route("/all").get(getAllJobs)
jobRouter.route("/:id").get(getSingleJob).patch(patchJob).delete(deleteJob).put(putJob)


