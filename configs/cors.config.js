import cors from 'cors';

const configureCors = () => {

    return cors({
        //origin: -> aurls to access the api data
        origin: (origin , callback) => {
            const allowedOrigins = [
                'http://localhost:3000', //local dev
                'https://yourcustomdomain.com' //procuction domain
            ]

            if(!origin || allowedOrigins.indexOf(origin) !== -1){
                callback(null , true);
            } else{
                callback(new Error(`The ${origin} is not allowed by cors` , false))
            }
        },

        methods: ['GET' , 'POST' , 'PUT' , 'DELETE'],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'Accept-Version'
        ],
        exposedHeaders: ['X-total-Count' , 'Content-Range'],
        credentials: true, // this wiil enable support for cookies 
        preflightContinue: false,
        maxAge: 600, //cache prefight response for 10 minutes 
        optionsSuccessStatus: 204

    })
}

export default configureCors
