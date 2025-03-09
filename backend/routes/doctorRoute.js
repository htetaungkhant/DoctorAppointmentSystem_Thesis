import express from 'express';
import { loginDoctor, appointmentsDoctor, appointmentCancel, appointmentComplete, doctorList, changeAvailablity, doctorDashboard, doctorProfile, updateDoctorProfile, deleteAccount, updateSchedule, getSchedule, getPublicHolidays } from '../controllers/doctorController.js';
import authDoctor from '../middleware/authDoctor.js';
const doctorRouter = express.Router();

// Public routes
doctorRouter.post('/login', loginDoctor);
doctorRouter.get('/list', doctorList);
doctorRouter.get('/schedule/:docId', getSchedule); // Public route for patients to see schedule
doctorRouter.get('/public-holidays', getPublicHolidays); // New endpoint to fetch public holidays

// Protected routes
doctorRouter.get('/schedule', authDoctor, getSchedule); // Private route for doctor's own schedule
doctorRouter.post('/schedule', authDoctor, updateSchedule);
doctorRouter.get('/appointments', authDoctor, appointmentsDoctor);
doctorRouter.post('/cancel-appointment', authDoctor, appointmentCancel);
doctorRouter.post('/complete-appointment', authDoctor, appointmentComplete);
doctorRouter.post('/change-availablity', authDoctor, changeAvailablity);
doctorRouter.get('/dashboard', authDoctor, doctorDashboard);
doctorRouter.get('/profile', authDoctor, doctorProfile);
doctorRouter.post('/update-profile', authDoctor, updateDoctorProfile);
doctorRouter.post('/delete-account', authDoctor, deleteAccount);

export default doctorRouter;