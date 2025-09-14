import express from "express";
import configureCors from "./configs/cors.config.js";
import globalErrorHandler from "./middlewares/errorHandler.middleware.js";
import { PORT } from "./configs/env.config.js";
import userRouter from "./routes/user.route.js";
import connectDb from "./configs/mongodb.config.js";
import healthRouter from "./routes/healthReport.route.js";
import waterRouter from "./routes/waterReport.route.js";

const app = express();

connectDb();

// app.use(configureCors());
app.use(express.json());

app.get('/' , (req ,res) => {

    res.send("<h1>Server is running</h1>");
})

app.use('/api/auth' , userRouter);
app.use('/api/health' , healthRouter);
app.use('/api/water' , waterRouter);

app.use(globalErrorHandler);

app.listen(PORT || 3000 , () => console.log(`Server is running`));


