import mongoose from 'mongoose'

const normalizeDate = (v) => {
    const d = v? new Date(v) : new Date();

    d.setHours(0 , 0 , 0 , 0 );
    return d;
}

const waterReportSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        default: () => normalizeDate(),
        set: normalizeDate
    },
    village_id: {
        type: String,
        required: [true, "Village ID is required"],
        trim: true,
        index: true
    },
    location: {
        latitude: {
            type: Number,
            required: [true, "Latitude is required"],
            min: -90,
            max: 90
        },
        longitude: {
            type: Number,
            required: [true, "Longitude is required"],
            min: -180,
            max: 180
        }
    },
    rainfall_mm: {
        type: Number,
        default: 0,
        min: [0, "Rainfall cannot be negative"]
    },
    water_turbidity_ntu: {
        type: Number,
        required: [true, "Water turbidity (NTU) is required"],
        min: [0, "Turbidity cannot be negative"]
    },
    water_ph: {
        type: Number,
        required: [true, "Water pH is required"],
        min: [0, "pH must be between 0 and 14"],
        max: [14, "pH must be between 0 and 14"]
    },
} , {timestamps: true});

waterReportSchema.index({ village_id: 1, date: 1 }, { unique: true });
waterReportSchema.index({date: -1});
const WaterReport = mongoose.model("WaterReport" , waterReportSchema);

export default WaterReport;