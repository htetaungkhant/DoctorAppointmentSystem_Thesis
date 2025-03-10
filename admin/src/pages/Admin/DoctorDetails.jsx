import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import { Switch } from '../../components/ui/Switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/Dialog'
import axios from 'axios'
import { toast } from 'react-toastify'

const DoctorDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { doctors, getAllDoctors, aToken } = useContext(AdminContext)
    const { currency, backendUrl } = useContext(AppContext)
    const [doctor, setDoctor] = useState(null)
    const [isEdit, setIsEdit] = useState(false)
    const [saveConfirm, setSaveConfirm] = useState(false)
    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [updatedDoctor, setUpdatedDoctor] = useState(null)

    useEffect(() => {
        if (aToken) {
            getAllDoctors()
        }
    }, [aToken])

    useEffect(() => {
        if (doctors.length > 0) {
            const doctorData = doctors.find(doc => doc._id === id)
            setDoctor(doctorData)
        }
    }, [doctors, id])

    const handleSave = async () => {
        if (!password) {
            setPasswordError('Please enter your password')
            return
        }
        
        try {
            // Verify password first
            const { data } = await axios.post(backendUrl + '/api/admin/verify-password', 
                { password },
                { headers: { atoken: aToken } }
            )
            
            if (!data.success) {
                setPasswordError('Incorrect password')
                toast.error('Incorrect password. Please try again.')
                setPassword('') // Clear password field
                return
            }

            // If password is correct, proceed with update
            const response = await axios.post(backendUrl + '/api/admin/update-doctor', { 
                docId: updatedDoctor._id,
                degree: updatedDoctor.degree,
                speciality: updatedDoctor.speciality,
                experience: updatedDoctor.experience,
                fees: updatedDoctor.fees,
                about: updatedDoctor.about,
                available: updatedDoctor.available,
                address: updatedDoctor.address
            }, { 
                headers: { atoken: aToken }
            })

            if (response.data.success) {
                toast.success(response.data.message)
                setIsEdit(false)
                getAllDoctors()
                setSaveConfirm(false)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        } finally {
            setPassword('')
            setPasswordError('')
        }
    }

    const validateAndOpenSaveDialog = () => {
        const errors = [];

        if (doctor.about.length < 300) {
            errors.push("About section must be at least 300 characters long");
        }

        if (!doctor.address.line1 && !doctor.address.line2) {
            errors.push("At least one address field must be filled");
        }

        if (!doctor.fees || doctor.fees <= 0) {
            errors.push("Please enter a valid appointment fee");
        }

        if (!doctor.degree) {
            errors.push("Degree is required");
        }

        if (!doctor.speciality) {
            errors.push("Speciality is required");
        }

        if (!doctor.experience) {
            errors.push("Experience is required");
        }

        if (errors.length > 0) {
            errors.forEach(error => toast.error(error));
            return;
        }

        setUpdatedDoctor(doctor);
        setSaveConfirm(true);
    }

    return doctor ? (
        <>
            <div className="min-h-screen w-full py-8">
                <div className="max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Back button */}
                    <button 
                        onClick={() => navigate('/doctor-list')}
                        className="flex items-center text-gray-600 mb-6 hover:text-gray-900 transition-colors"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Doctors List
                    </button>

                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        {/* Header Section with Cover Image */}
                        <div className="h-48 bg-gradient-to-r from-primary/20 to-primary/5 relative">
                            {/* Edit/Save buttons */}
                            <div className="absolute top-4 right-4">
                                {!isEdit ? (
                                    <button 
                                        onClick={() => setIsEdit(true)}
                                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200 border border-blue-200 shadow-sm"
                                    >
                                        <img src={assets.doctor_icon} alt="Edit" className="w-5 h-5 mr-2" />
                                        Edit Profile
                                    </button>
                                ) : (
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={validateAndOpenSaveDialog}
                                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-all duration-200 border border-emerald-200 shadow-sm"
                                        >
                                            <img src={assets.doctor_profile_tick_icon} alt="Save" className="w-5 h-5 mr-2" />
                                            Save
                                        </button>
                                        <button 
                                            onClick={() => {
                                                setIsEdit(false);
                                                const originalDoc = doctors.find(d => d._id === id);
                                                setDoctor(originalDoc);
                                            }}
                                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 rounded-lg transition-all duration-200 border border-gray-200 shadow-sm"
                                        >
                                            <img src={assets.doctor_profile_cancel_icon} alt="Cancel" className="w-5 h-5 mr-2" />
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Profile Image and Info */}
                            <div className="absolute -bottom-24 left-8 flex flex-col sm:flex-row items-center sm:items-end gap-6">
                                <div className="relative">
                                    <img 
                                        src={doctor.image} 
                                        alt={doctor.name} 
                                        className="w-36 h-36 rounded-2xl border-4 border-white shadow-md object-cover bg-white"
                                    />
                                    <div className={`absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-white ${
                                        doctor.available ? 'bg-green-400' : 'bg-gray-400'
                                    }`}></div>
                                </div>
                                <div className="text-center sm:text-left mb-4">
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{doctor.name}</h1>
                                    {isEdit ? (
                                        <div className="w-64">
                                            <select 
                                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
                                                value={doctor.speciality}
                                                onChange={(e) => setDoctor(prev => ({ ...prev, speciality: e.target.value }))}
                                            >
                                                <option value="General Medicine">General Medicine</option>
                                                <option value="Obstetrics and Gynaecology">Obstetrics and Gynaecology</option>
                                                <option value="Paediatrics">Paediatrics</option>
                                                <option value="Mental Health">Mental Health</option>
                                                <option value="Surgery">Surgery</option>
                                                <option value="Orthopaedics">Orthopaedics</option>
                                                <option value="Eye">Eye</option>
                                                <option value="Ear, Nose and Throat">Ear, Nose and Throat</option>
                                                <option value="Dental">Dental</option>
                                                <option value="Traditional Medicine">Traditional Medicine</option>
                                            </select>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <p className="text-primary text-lg font-medium">{doctor.speciality}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Main Content with increased top padding to account for overlapping profile section */}
                        <div className="px-8 py-6 pt-28">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Left Column */}
                                <div className="lg:col-span-1">
                                    <div className="bg-gray-50 rounded-xl p-6 space-y-6">
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 mb-4">Basic Information</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                                                    {isEdit ? (
                                                        <input 
                                                            type="text"
                                                            value={doctor.degree}
                                                            onChange={(e) => setDoctor(prev => ({ ...prev, degree: e.target.value }))}
                                                            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm ${
                                                                !doctor.degree ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                                            }`}
                                                            placeholder="e.g. MBBS, MD"
                                                        />
                                                    ) : (
                                                        <p className="text-gray-900">{doctor.degree}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                                                    {isEdit ? (
                                                        <select 
                                                            value={doctor.experience}
                                                            onChange={(e) => setDoctor(prev => ({ ...prev, experience: e.target.value }))}
                                                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                                                        >
                                                            <option value="House Surgeon">House Surgeon</option>
                                                            <option value="Medical Officer">Medical Officer</option>
                                                            <option value="Assistant Specialist">Assistant Specialist</option>
                                                            <option value="Specialist">Specialist</option>
                                                            <option value="Senior Consultant">Senior Consultant</option>
                                                            <option value="Professor">Professor</option>
                                                        </select>
                                                    ) : (
                                                        <p className="text-gray-900">{doctor.experience}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee</label>
                                                    {isEdit ? (
                                                        <div className="relative">
                                                            <input 
                                                                type="number"
                                                                value={doctor.fees}
                                                                onChange={(e) => setDoctor(prev => ({ ...prev, fees: e.target.value }))}
                                                                className={`block w-full pl-3 pr-9 py-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm ${
                                                                    !doctor.fees || doctor.fees <= 0 ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                                                }`}
                                                                min="0"
                                                            />
                                                            <span className="absolute inset-y-0 right-3 flex items-center text-gray-500">
                                                                {currency}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <p className="text-gray-900">{doctor.fees} {currency}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                                                    <div className="flex items-center justify-between">
                                                        <span className={`text-sm ${doctor.available ? 'text-green-600' : 'text-gray-600'}`}>
                                                            {doctor.available ? 'Available' : 'Not Available'}
                                                        </span>
                                                        {isEdit && (
                                                            <Switch 
                                                                checked={doctor.available}
                                                                onCheckedChange={(checked) => setDoctor(prev => ({ ...prev, available: checked }))}
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 mb-4">Address</h3>
                                            {isEdit ? (
                                                <div className="space-y-3">
                                                    <input 
                                                        type="text"
                                                        value={doctor.address.line1}
                                                        onChange={(e) => setDoctor(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))}
                                                        className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm ${
                                                            !doctor.address.line1 && !doctor.address.line2 ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                                        }`}
                                                        placeholder="Address Line 1"
                                                    />
                                                    <input 
                                                        type="text"
                                                        value={doctor.address.line2}
                                                        onChange={(e) => setDoctor(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))}
                                                        className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm ${
                                                            !doctor.address.line1 && !doctor.address.line2 ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                                        }`}
                                                        placeholder="Address Line 2"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="text-gray-900">
                                                    {doctor.address.line1 && <p>{doctor.address.line1}</p>}
                                                    {doctor.address.line2 && <p>{doctor.address.line2}</p>}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="lg:col-span-2">
                                    <div className="bg-white rounded-xl">
                                        <h3 className="text-sm font-medium text-gray-500 mb-4">About</h3>
                                        {isEdit ? (
                                            <div>
                                                <textarea 
                                                    value={doctor.about}
                                                    onChange={(e) => setDoctor(prev => ({ ...prev, about: e.target.value }))}
                                                    className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm ${
                                                        doctor.about.length < 300 ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                                    }`}
                                                    rows="12"
                                                    minLength={300}
                                                />
                                                <span className={`text-xs ${doctor.about.length < 300 ? 'text-red-500' : 'text-gray-500'}`}>
                                                    {doctor.about.length}/300 characters (minimum)
                                                </span>
                                            </div>
                                        ) : (
                                            <p className="text-gray-900 whitespace-pre-line">{doctor.about}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Confirmation Dialog */}
            <Dialog open={saveConfirm} onOpenChange={(open) => {
                if (!open) {
                    setSaveConfirm(false)
                    setPassword('')
                    setPasswordError('')
                }
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Save Changes</DialogTitle>
                        <DialogDescription>
                            Please enter your password to save the changes to this doctor's profile.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4">
                        <label htmlFor="save-password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="save-password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                                setPasswordError('')
                            }}
                            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm ${
                                passwordError ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                            placeholder="Enter your password"
                        />
                        {passwordError && (
                            <p className="mt-2 text-sm text-red-600">
                                {passwordError}
                            </p>
                        )}
                    </div>
                    <DialogFooter>
                        <button
                            onClick={() => {
                                setSaveConfirm(false)
                                setPassword('')
                                setPasswordError('')
                            }}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors"
                        >
                            Save Changes
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    ) : null
}

export default DoctorDetails