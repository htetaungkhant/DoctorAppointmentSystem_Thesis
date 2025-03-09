import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import { v2 as cloudinary } from "cloudinary";
import { fetchPublicHolidays } from "../services/holidayService.js";

// API for doctor Login 
const loginDoctor = async (req, res) => {

    try {

        const { email, password } = req.body
        const user = await doctorModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "Invalid credentials" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get doctor appointments for doctor panel
const appointmentsDoctor = async (req, res) => {
    try {

        const { docId } = req.body
        const appointments = await appointmentModel.find({ docId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to cancel appointment for doctor panel
const appointmentCancel = async (req, res) => {
    try {

        const { docId, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
            return res.json({ success: true, message: 'Appointment Cancelled' })
        }

        res.json({ success: false, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to mark appointment completed for doctor panel
const appointmentComplete = async (req, res) => {
    try {

        const { docId, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
            return res.json({ success: true, message: 'Appointment Completed' })
        }

        res.json({ success: false, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to get all doctors list for Frontend
const doctorList = async (req, res) => {
    try {

        const doctors = await doctorModel.find({}).select(['-password', '-email'])
        res.json({ success: true, doctors })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to change doctor availablity for Admin and Doctor Panel
const changeAvailablity = async (req, res) => {
    try {

        const { docId } = req.body

        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available })
        res.json({ success: true, message: 'Availablity Changed' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get doctor profile for  Doctor Panel
const doctorProfile = async (req, res) => {
    try {

        const { docId } = req.body
        const profileData = await doctorModel.findById(docId).select('-password')

        res.json({ success: true, profileData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update doctor profile data from  Doctor Panel
const updateDoctorProfile = async (req, res) => {
    try {

        const { docId, fees, address, available, about } = req.body

        await doctorModel.findByIdAndUpdate(docId, { fees, address, available, about })

        res.json({ success: true, message: 'Profile Updated' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get dashboard data for doctor panel
const doctorDashboard = async (req, res) => {
    try {

        const { docId } = req.body

        const appointments = await appointmentModel.find({ docId })

        let earnings = 0

        appointments.map((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount
            }
        })

        let patients = []

        appointments.map((item) => {
            if (!patients.includes(item.userId)) {
                patients.push(item.userId)
            }
        })



        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse()
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API for doctor to delete their own account
const deleteAccount = async (req, res) => {
    try {
        const { docId } = req.body;
        const { password } = req.body;

        // Verify the password first
        const doctor = await doctorModel.findById(docId);
        if (!doctor) {
            return res.json({ success: false, message: 'Doctor not found.' });
        }

        const isMatch = await bcrypt.compare(password, doctor.password);
        if (!isMatch) {
            return res.json({ success: false, message: 'Incorrect password' });
        }

        // Check for active appointments
        const activeAppointments = await appointmentModel.find({ 
            docId, 
            cancelled: false, 
            isCompleted: false 
        });
        if (activeAppointments.length > 0) {
            return res.json({ 
                success: false, 
                message: 'You have active appointments. Please complete or cancel them before deleting your account.' 
            });
        }

        // Delete image from Cloudinary if exists
        if (doctor.image) {
            try {
                const publicId = doctor.image.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            } catch (cloudinaryError) {
                console.log('Cloudinary deletion error:', cloudinaryError);
                return res.json({ 
                    success: false, 
                    message: 'Failed to delete profile image. Please try again.' 
                });
            }
        }

        // Delete the doctor and their appointments
        await doctorModel.findByIdAndDelete(docId);
        await appointmentModel.deleteMany({ docId });
        
        res.json({ 
            success: true, 
            message: 'Your account has been deleted successfully' 
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to update doctor's schedule
const updateSchedule = async (req, res) => {
    try {
        const { docId } = req.body;
        const { schedule } = req.body;
        
        // Extract publicHolidaysEnabled setting before validation
        const publicHolidaysEnabled = schedule.publicHolidaysEnabled ?? true;
        
        // Validate time slots
        for (const day in schedule) {
            if (day === 'unavailableDates' || day === 'publicHolidaysEnabled' || day === 'minDate' || day === 'maxDate') continue;
            
            // Ensure schedule[day] is an array
            if (!Array.isArray(schedule[day])) {
                schedule[day] = [];
                continue;
            }
            
            for (const slot of schedule[day]) {
                if (!slot.startTime || !slot.endTime) continue;
                
                const start = new Date(`2000-01-01 ${slot.startTime}`);
                const end = new Date(`2000-01-01 ${slot.endTime}`);
                
                if (end <= start) {
                    return res.json({ 
                        success: false, 
                        message: `Invalid time slot for ${day}: End time must be after start time` 
                    });
                }
            }
            
            // Sort slots by start time
            schedule[day].sort((a, b) => {
                if (!a.startTime || !b.startTime) return 0;
                const timeA = new Date(`2000-01-01 ${a.startTime}`);
                const timeB = new Date(`2000-01-01 ${b.startTime}`);
                return timeA - timeB;
            });
            
            // Check for overlapping slots
            for (let i = 1; i < schedule[day].length; i++) {
                if (!schedule[day][i-1].endTime || !schedule[day][i].startTime) continue;
                
                const prevEnd = new Date(`2000-01-01 ${schedule[day][i-1].endTime}`);
                const currStart = new Date(`2000-01-01 ${schedule[day][i].startTime}`);
                
                if (currStart <= prevEnd) {
                    return res.json({ 
                        success: false, 
                        message: `Overlapping time slots found for ${day}` 
                    });
                }
            }
        }

        // Convert unavailable dates from ISO strings to Date objects
        if (Array.isArray(schedule.unavailableDates)) {
            schedule.unavailableDates = schedule.unavailableDates.map(date => new Date(date));
        } else {
            schedule.unavailableDates = [];
        }

        // Create the final schedule object with all necessary fields
        const updatedSchedule = {
            monday: schedule.monday || [],
            tuesday: schedule.tuesday || [],
            wednesday: schedule.wednesday || [],
            thursday: schedule.thursday || [],
            friday: schedule.friday || [],
            saturday: schedule.saturday || [],
            sunday: schedule.sunday || [],
            unavailableDates: schedule.unavailableDates,
            publicHolidaysEnabled: publicHolidaysEnabled
        };
        
        await doctorModel.findByIdAndUpdate(docId, { schedule: updatedSchedule });
        res.json({ success: true, message: 'Schedule updated successfully' });
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to get doctor's schedule
const getSchedule = async (req, res) => {
    try {
        const docId = req.params.docId || req.body.docId;
        const doctor = await doctorModel.findById(docId);

        // Calculate maxDate as 2 months from today (server time)
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 2);

        // Fetch public holidays if enabled
        let publicHolidays = [];
        if (doctor.schedule?.publicHolidaysEnabled) {
            publicHolidays = await fetchPublicHolidays();
        }

        // Format unavailable dates as ISO strings for consistency
        const schedule = {
            ...doctor.schedule.toObject(), // Convert mongoose document to plain object
            unavailableDates: (doctor.schedule?.unavailableDates || []).map(date => date.toISOString()),
            publicHolidays: publicHolidays.map(date => date.toISOString()),
            publicHolidaysEnabled: doctor.schedule?.publicHolidaysEnabled ?? true,
            minDate: new Date().toISOString(),
            maxDate: maxDate.toISOString(),
            serverTime: new Date().toISOString() // Add server time to response
        };

        res.json({ success: true, schedule });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to get public holidays
const getPublicHolidays = async (req, res) => {
    try {
        const publicHolidays = await fetchPublicHolidays();
        res.json({ 
            success: true, 
            holidays: publicHolidays.map(date => date.toISOString())
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export {
    loginDoctor,
    appointmentsDoctor,
    appointmentCancel,
    doctorList,
    changeAvailablity,
    appointmentComplete,
    doctorDashboard,
    doctorProfile,
    updateDoctorProfile,
    deleteAccount,
    updateSchedule,
    getSchedule,
    getPublicHolidays
}