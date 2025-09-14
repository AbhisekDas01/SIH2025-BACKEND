import WaterReport from '../models/waterReport.model.js';
import APIError from '../utils/customError.util.js';


export const createOrUpdateWaterReport = async (req, res) => {
    // Assuming an authentication middleware provides the user's ID
    const reporter_id = req.user?.userId;

    if (!reporter_id) {
        throw new APIError("Unauthorized: User ID not found. Please log in.", 401);
    }

    
    

    const {
        village_id,
        location,
        water_turbidity_ntu,
        water_ph,
        rainfall_mm,
    } = req?.body || {};

    // 1. Validate required fields
    if (!village_id || !location || typeof water_turbidity_ntu === 'undefined' || typeof water_ph === 'undefined') {
        throw new APIError("village_id, location, water_turbidity_ntu, and water_ph are required.", 400);
    }

      // 1. Validate required fields
    if (!village_id || !location || typeof water_turbidity_ntu === 'undefined' || typeof water_ph === 'undefined') {
        throw new APIError("village_id, location, water_turbidity_ntu, and water_ph are required.", 400);
    }

    // 2. Define the filter for the query: one record per village per day.
    // The model schema automatically sets the time to midnight, so we do the same here for matching.
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const filter = {
        village_id: village_id,
        date: today
    };

    // 3. Define the data to be set or updated.
    const updateData = {
        village_id,
        date: today,
        location: {
            latitude: location.latitude,
            longitude: location.longitude
        },
        water_turbidity_ntu: Number(water_turbidity_ntu),
        water_ph: Number(water_ph),
        rainfall_mm: typeof rainfall_mm !== 'undefined' ? Number(rainfall_mm) : 0,
    };

    // 4. Execute the `findOneAndUpdate` operation with `upsert`.
    const options = {
        upsert: true, // Creates the document if it doesn't exist
        new: true,    // Returns the modified or new document
        runValidators: true, // Ensures the update respects schema validation (e.g., min/max for pH)
        setDefaultsOnInsert: true // Applies schema defaults when creating a new document
    };

    const result = await WaterReport.findOneAndUpdate(filter, updateData, options);

    // Determine if the document was newly created or updated for the response message.
    const wasUpserted = result.isNew;

    res.status(wasUpserted ? 201 : 200).json({
        success: true,
        message: wasUpserted ? "Water report created successfully." : "Water report updated successfully for today.",
        data: result
    });
};

