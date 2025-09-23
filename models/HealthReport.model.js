import mongoose from 'mongoose'

const healthReportSchema = new mongoose.Schema({

    reporters: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        }
    ],

    village_id: {
        type: String,
        required: [true, "Village ID is required!"],
        trim: true
    },
    location: {
        latitude: {
            type: Number,
            required: [true, "Latitude is required!"],
            min: [-90, "Latitude must be between -90 and 90"],
            max: [90, "Latitude must be between -90 and 90"]
        },
        longitude: {
            type: Number,
            required: [true, "Longitude is required!"],
            min: [-180, "Longitude must be between -180 and 180"],
            max: [180, "Longitude must be between -180 and 180"]
        }
    },
    rainfall_mm: {
        type: Number,
        default: 0,
        min: [0, "Rainfall cannot be negative"]
    },
    reported_cases: {
        type: Number,
        required: [true, "Total reported cases is required!"],
        min: [0, "Reported cases cannot be negative"]
    },
    symptom_diarrhea_cases: {
        type: Number,
        default: 0,
        min: [0, "Cases cannot be negative"]
    },
    symptom_vomiting_cases: {
        type: Number,
        default: 0,
        min: [0, "Cases cannot be negative"]
    },
    symptom_fever_cases: {
        type: Number,
        default: 0,
        min: [0, "Cases cannot be negative"]
    },
    is_outbreak: {
        type: Number,
        enum: [0, 1],
        default: 0,
        // 0 = No outbreak, 1 = Outbreak detected
    },
    verified_at: {
        type: Date,
        default: () => {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // This removes the time part.
            return today;
        }
    },
});


healthReportSchema.index({verified_at: -1});

const HealthReport = mongoose.model("HealthReport" , healthReportSchema);

export default HealthReport;

