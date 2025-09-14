import express from 'express'
import authenticateUser from '../middlewares/auth.middleware.js';
import { creteHealthReport, getVillageDataForLast7Days } from '../controllers/healthReport.controller.js';

const healthRouter = express.Router();

healthRouter.post('/create-report' , authenticateUser , creteHealthReport);
healthRouter.get('get-data' , getVillageDataForLast7Days);


export default healthRouter;