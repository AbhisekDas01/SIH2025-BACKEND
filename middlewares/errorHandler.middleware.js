import APIError from "../utils/customError.util.js";

const globalErrorHandler = (err , req , res , next) => {

    console.error(err.stack);

    if(err instanceof APIError) {
        return res.status(err.statusCode).json({
            success: false,
            status: 'Error',
            message: err.message
        })
    } 

    //handle mongoose validation
    else if(err.name === 'ValidationError'){
        return res.status(400).json({
            success: false,
            status: 'Error',
            message: 'Validation Error'
        })
    } else{
         return res.status(500).json({
            success: false,
            status: 'Error',
            message: 'Unexpected error'
        })
    }
    
}

export default globalErrorHandler