import HealthReport from "../models/HealthReport.model.js";
import WaterReport from "../models/waterReport.model.js";

export const get7DaysHealth = async () => {
    // FIX: Declare villageData outside the try block so it's accessible in the return statement.
    let villageData = null;

    try {
        // 1. Define the date range for the last 7 days
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 6); // Go back 6 days to get a 7-day window
        startDate.setHours(0, 0, 0, 0); // Set to the start of that day

        // 2. Use MongoDB Aggregation Pipeline for efficiency
        // FIX: Assign the result to the villageData variable declared outside.
        villageData = await HealthReport.aggregate([
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

    } catch (error) {
        console.log("Error in Get 7 days data: ", error);
        // If an error occurs, villageData will remain null.
    }

    return villageData;
}


export const getWaterReport = async (village_id) => {
    try {
        // This function should also specify a date range for consistency.
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 6);
        startDate.setHours(0, 0, 0, 0);

        const waterreport = await WaterReport.find({
            village_id: village_id,
            date: {
                $gte: startDate,
                $lte: endDate
            }
        }).sort({ date: 1 }).lean(); // .lean() for better performance

        return waterreport.length > 0 ? waterreport : null;

    } catch (error) {
        console.log("Error in get water report: ", error);
        return null; // Ensure null is returned on error
    }
}

// FIX: Removed the unnecessary call to getWaterReport() which was causing errors.