import { Router } from "express";
import { getAllJobs, getSingleJob, createJob, patchJob, putJob, deleteJob } from "../controllers";

export const jobRouter = Router()


jobRouter.route("/create").post(createJob)
jobRouter.route("/all").get(getAllJobs)
jobRouter.route("/:id").get(getSingleJob).patch(patchJob).delete(deleteJob).put(putJob)


// rc 1 eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MjRjMWIxZjViMWM0MzczOWFjMWZlMzIiLCJlbWFpbCI6InJlY3J1aXRlci1vbmVAZ21haWwuY29tIiwicm9sZSI6InJlY3J1aXRlciIsImlhdCI6MTY0OTIzNjM2NCwiZXhwIjoxNjUwMTAwMzY0fQ.x1AfRrK1XQ8_-y2IXU9Mrt8Z4dMfQ2audMhWXoLHawo
// rc 2 eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MjRkNTY0OGM1YjJhYzY2MTlkYTNkMWEiLCJlbWFpbCI6InJlY3J1aXRlci10d29AZ21haWwuY29tIiwicm9sZSI6InJlY3J1aXRlciIsImlhdCI6MTY0OTk4Njg3OCwiZXhwIjoxNjUwODUwODc4fQ.oPJGqVjEnfLkbusGUchlyZiVAXijJiT1qwJwvTSHrfA

