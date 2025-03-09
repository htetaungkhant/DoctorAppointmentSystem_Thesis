import mongoose from "mongoose";

const timeSlotSchema = new mongoose.Schema({
    startTime: { type: String, required: true }, // Format: "HH:mm"
    endTime: { type: String, required: true }    // Format: "HH:mm"
});

const scheduleSchema = new mongoose.Schema({
    monday: [timeSlotSchema],
    tuesday: [timeSlotSchema],
    wednesday: [timeSlotSchema],
    thursday: [timeSlotSchema],
    friday: [timeSlotSchema],
    saturday: [timeSlotSchema],
    sunday: [timeSlotSchema],
    unavailableDates: [{ type: Date }], // Array of specific dates when doctor is unavailable
    publicHolidaysEnabled: { type: Boolean, default: true } // Enable public holidays by default
}, { _id: false }); // Prevent Mongoose from creating _id for the subdocument

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: true },
    speciality: { type: String, required: true },
    degree: { type: String, required: true },
    experience: { type: String, required: true },
    about: { type: String, required: true },
    available: { type: Boolean, default: true },
    fees: { type: Number, required: true },
    slots_booked: { type: Object, default: {} },
    schedule: { type: scheduleSchema, default: () => ({}) },
    address: { type: Object, required: true },
    date: { type: Number, required: true },
}, { minimize: false });

const doctorModel = mongoose.models.doctor || mongoose.model("doctor", doctorSchema);
export default doctorModel;