import express from 'express'
import authenticateUser from '../middlewares/auth.middleware.js';
import asyncHandler from '../middlewares/asyncHandler.middleware.js';
import { createOrUpdateWaterReport, getVillageWaterReport } from '../controllers/waterReport.controller.js';

const waterRouter = express.Router();

waterRouter.post('/create-water-report' , authenticateUser , asyncHandler( createOrUpdateWaterReport));
waterRouter.get('/get-water-report/:village_id' , asyncHandler(getVillageWaterReport));

export default waterRouter;