import { JobApplicationInterface } from "../../types/jobApplicationInterface";
import { JobApplicationModel } from "../../framework/database/mongoDb/models/jobApplicationModel";
import { JobApplicationDbInterface } from "../../application/repositories/jobApplicationDbRepository";
import { JobApplicationRepositoryMongoDB } from "../../framework/database/mongoDb/repositories/jobApplicationRepositoryMongoDB";
import { HttpStatus } from "../../types/httpStatus";
import { Request, Response, application } from "express";
import { CustomRequest } from "../../types/expressRequest";
import { Types } from "mongoose";
import AppError from "../../utils/appError";
import expressAsyncHandler from "express-async-handler";
import { applyForJob,existingApplication } from "../../application/useCases/jobApplication/jobApplication";
const jobApplicationController = (
    jobApplicationDbRepository: JobApplicationDbInterface,
    jobApplicationDbRepositoryImpl: JobApplicationRepositoryMongoDB,
    jobApplicationModel: JobApplicationModel
  ) => {
    const dbRepositoryJobApplication = jobApplicationDbRepository(
      jobApplicationDbRepositoryImpl(jobApplicationModel)
    );
    const applyNewJob = expressAsyncHandler(
      async (req: Request, res: Response) => {
        const customReq = req as CustomRequest;
        const jobId = Array.isArray(req.query.jobId)
          ? req.query.jobId[0]
          : req.query.jobId;
        const employerId = Array.isArray(req.query.empId)
          ? req.query.empId[0]
          : req.query.empId;
  
        let application: JobApplicationInterface = {};
  
        const userId = new Types.ObjectId(customReq.payload);
        application.jobId = new Types.ObjectId(String(jobId));
        application.employerId = new Types.ObjectId(String(employerId));
        application.userId = userId;
  
        const applyForNewJob = await applyForJob(
          application,
          dbRepositoryJobApplication
        );
  
        if (!applyForNewJob) {
          throw new AppError(
            "application failed",
            HttpStatus.INTERNAL_SERVER_ERROR
          );
        }
        res.json({
          status: "success",
          message: "Application send",
          application: applyForNewJob,
        });
      }
    );
    const existingApplicant = expressAsyncHandler(
        async (req: Request, res: Response) => {
          const customReq = req as CustomRequest;
          let jobId = Array.isArray(req.query.jobId)
            ? req.query.jobId[0]
            : req.query.jobId;
          const userId = new Types.ObjectId(customReq.payload);
          const jobID = new Types.ObjectId(String(jobId));
          const alreadyApplied = await existingApplication(
            jobID,
            userId,
            dbRepositoryJobApplication
          );
          if (alreadyApplied) {
            res.json({
              status: "Applied",
              message: "already applied",
            });
          } else {
            res.json({
              status: "Apply Now",
              message: "not applied",
            });
          }
        }
      );
    return {
        applyNewJob,
        existingApplicant
        
      };
    };
    export default jobApplicationController
    