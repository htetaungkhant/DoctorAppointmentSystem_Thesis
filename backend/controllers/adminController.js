import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import { v2 as cloudinary } from "cloudinary";
import userModel from "../models/userModel.js";

// API for admin login
const loginAdmin = async (req, res) => {
    try {

        const { email, password } = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}


// API to get all appointments list
const appointmentsAdmin = async (req, res) => {
    try {

        const appointments = await appointmentModel.find({})
        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API for appointment cancellation
const appointmentCancel = async (req, res) => {
    try {

        const { appointmentId } = req.body
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        res.json({ success: true, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API for adding Doctor
const addDoctor = async (req, res) => {

    try {

        const { name, email, password, speciality, degree, experience, about, fees, address, schedule } = req.body
        const imageFile = req.file

        // checking for all data to add doctor
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.json({ success: false, message: "Missing Details" })
        }

        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        // validating strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10); // the more no. round the more time it will take
        const hashedPassword = await bcrypt.hash(password, salt)

        // upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
        const imageUrl = imageUpload.secure_url

        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            date: Date.now(),
            schedule: schedule ? JSON.parse(schedule) : {
                monday: [],
                tuesday: [],
                wednesday: [],
                thursday: [],
                friday: [],
                saturday: [],
                sunday: [],
                unavailableDates: [],
                publicHolidaysEnabled: true
            }
        }

        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()
        res.json({ success: true, message: 'Doctor Added' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get all doctors list for admin panel
const allDoctors = async (req, res) => {
    try {

        const doctors = await doctorModel.find({}).select('-password')
        res.json({ success: true, doctors })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
    try {

        const doctors = await doctorModel.find({})
        const users = await userModel.find({})
        const appointments = await appointmentModel.find({})

        const dashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            latestAppointments: appointments.reverse()
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to delete a doctor
const deleteDoctor = async (req, res) => {
    try {
        const { docId } = req.body;
        
        // Check for active appointments
        const activeAppointments = await appointmentModel.find({ docId, cancelled: false, isCompleted: false });
        if (activeAppointments.length > 0) {
            return res.json({ success: false, message: 'Doctor has active appointments and cannot be deleted.' });
        }

        // Get doctor data to access image URL
        const doctor = await doctorModel.findById(docId);
        if (!doctor) {
            return res.json({ success: false, message: 'Doctor not found.' });
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
                    message: 'Failed to delete doctor\'s image. Please try again.' 
                });
            }
        }

        // Only proceed with database deletion if image deletion was successful
        await doctorModel.findByIdAndDelete(docId);
        await appointmentModel.deleteMany({ docId });
        
        res.json({ success: true, message: 'Doctor and associated data deleted successfully' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to delete all doctors
const deleteAllDoctors = async (req, res) => {
    try {
        // Check for active appointments
        const activeAppointments = await appointmentModel.find({ cancelled: false, isCompleted: false });
        if (activeAppointments.length > 0) {
            return res.json({ success: false, message: 'Cannot delete all doctors. There are active appointments.' });
        }

        // Get all doctors to delete their images
        const doctors = await doctorModel.find({});
        
        // Delete all images from Cloudinary
        for (const doctor of doctors) {
            if (doctor.image) {
                try {
                    const publicId = doctor.image.split('/').pop().split('.')[0];
                    await cloudinary.uploader.destroy(publicId);
                } catch (cloudinaryError) {
                    console.log('Cloudinary deletion error:', cloudinaryError);
                }
            }
        }

        // Delete all doctors and their appointments
        await doctorModel.deleteMany({});
        await appointmentModel.deleteMany({});
        
        res.json({ success: true, message: 'All doctors and associated data deleted successfully' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to update a doctor
const updateDoctor = async (req, res) => {
    try {
        const { docId, degree, speciality, experience, fees, about, available, address } = req.body

        await doctorModel.findByIdAndUpdate(docId, {
            degree,
            speciality,
            experience,
            fees,
            about,
            available,
            address
        })

        res.json({ success: true, message: 'Doctor Updated Successfully' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to verify admin password
const verifyPassword = async (req, res) => {
    try {
        const { password } = req.body
        
        if (password === process.env.ADMIN_PASSWORD) {
            res.json({ success: true })
        } else {
            res.json({ success: false, message: 'Incorrect password' })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {
    loginAdmin,
    appointmentsAdmin,
    appointmentCancel,
    addDoctor,
    allDoctors,
    adminDashboard,
    deleteDoctor,
    deleteAllDoctors,
    updateDoctor,
    verifyPassword
}