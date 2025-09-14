import HealthReport from "../models/HealthReport.model.js";
import APIError from "../utils/customError.util.js";


export const creteHealthReport = async (req, res) => {

    const reporter_id = req.user.userId;

    const {
        village_id,
        location,
        rainfall_mm = 0, // Default value to prevent errors
        reported_cases = 0,
        symptom_diarrhea_cases = 0,
        symptom_vomiting_cases = 0,
        symptom_fever_cases = 0

    } = req?.body;

    if (!reporter_id || !village_id || !location) {
        throw new APIError("Reporter id, village_id, and location are required!", 400);
    }

    // BUG FIX: You must query a Date field with a Date object, not a string.
    // This creates a date for today at midnight, which will match your stored data.
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    //check if the data exists for today
    const report = await HealthReport.findOne({ village_id, verified_at: today });

    if (!report) {
        // This block runs if no report exists for the village today.
        const newReport = new HealthReport({
            reporters: [reporter_id],
            village_id,
            location: {
                latitude: location.latitude,
                longitude: location.longitude
            },
            // BUG FIX: Ensure all incoming data is converted to a Number.
            rainfall_mm: Number(rainfall_mm),
            reported_cases: Number(reported_cases),
            symptom_diarrhea_cases: Number(symptom_diarrhea_cases),
            symptom_vomiting_cases: Number(symptom_vomiting_cases),
            symptom_fever_cases: Number(symptom_fever_cases),
            verified_at: today 
        })

        await newReport.save();

        return res.status(201).json({
            success: true,
            message: "New report created successfully!",
            data: newReport
        });

    } else {
        // This block runs if a report for the village already exists today.
        if (report.reporters.includes(reporter_id)) {
        
            throw new APIError("You have already submitted today's data!", 409);
        }

        report.reporters.push(reporter_id);
        // BUG FIX: Ensure all values are numbers before performing arithmetic to avoid NaN or string concatenation.
        report.rainfall_mm = (Number(report.rainfall_mm) + Number(rainfall_mm)) / 2;
        report.reported_cases = Number(report.reported_cases) + Number(reported_cases);
        report.symptom_diarrhea_cases = Number(report.symptom_diarrhea_cases) + Number(symptom_diarrhea_cases);
        report.symptom_vomiting_cases = Number(report.symptom_vomiting_cases) + Number(symptom_vomiting_cases);
        report.symptom_fever_cases = Number(report.symptom_fever_cases) + Number(symptom_fever_cases);

        await report.save();

        return res.status(200).json({
            success: true,
            message: "Report updated successfully!",
            data: report
        });
    }
}


export const getVillageDataForLast7Days = async (req, res) => {
    // 1. Define the date range for the last 7 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6); // Go back 6 days to get a 7-day window
    startDate.setHours(0, 0, 0, 0); // Set to the start of that day

    // 2. Use MongoDB Aggregation Pipeline for efficiency
    const villageData = await HealthReport.aggregate([
        {
            // First, filter documents to only include those in our date range
            $match: {
                verified_at: {
                    $gte: startDate,
                    $lte: endDate
                }
            }
        },
        {
            // Sort by date to ensure the reports are ordered within each group
            $sort: {
                verified_at: 1
            }
        },
        {
            // Group the documents by village_id
            $group: {
                _id: "$village_id", // The field to group by
                daily_reports: {
                    // Create an array containing the data for each day
                    $push: {
                        date: "$verified_at",
                        reported_cases: "$reported_cases",
                        symptom_diarrhea_cases: "$symptom_diarrhea_cases",
                        symptom_vomiting_cases: "$symptom_vomiting_cases",
                        symptom_fever_cases: "$symptom_fever_cases",
                        rainfall_mm: "$rainfall_mm",
                        location: "$location"
                    }
                }
            }
        },
        {
            // Reshape the output for a cleaner response
            $project: {
                _id: 0, // Exclude the default _id field
                village_id: "$_id", // Rename _id to village_id
                daily_reports: 1 // Include the daily_reports array
            }
        }
    ]);

    if (!villageData || villageData.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No data found for the last 7 days."
        });
    }

    return res.status(200).json({
        success: true,
        message: "Successfully retrieved last 7 days of data for each village.",
        data: villageData
    });
};