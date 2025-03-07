import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { Switch } from '../../components/ui/Switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/Dialog'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'
import LoadingScreen from '../../components/ui/LoadingScreen'

const DoctorProfile = () => {
    const navigate = useNavigate()
    const { dToken, setDToken, profileData, setProfileData, getProfileData } = useContext(DoctorContext)
    const { currency, backendUrl } = useContext(AppContext)
    const [isEdit, setIsEdit] = useState(false)
    const [deleteConfirm, setDeleteConfirm] = useState(false)
    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)

    const updateProfile = async () => {
        try {
            const errors = [];
            
            if (profileData.about.length < 300) {
                errors.push("About section must be at least 300 characters long");
            }

            if (!profileData.address.line1 && !profileData.address.line2) {
                errors.push("At least one address field must be filled");
            }

            if (!profileData.fees || profileData.fees <= 0) {
                errors.push("Please enter a valid appointment fee");
            }

            if (errors.length > 0) {
                errors.forEach(error => toast.error(error));
                return;
            }

            const updateData = {
                address: profileData.address,
                fees: profileData.fees,
                about: profileData.about,
                available: profileData.available
            }

            const { data } = await axios.post(backendUrl + '/api/doctor/update-profile', updateData, { headers: { dToken } })

            if (data.success) {
                toast.success(data.message)
                setIsEdit(false)
                getProfileData()
            } else {
                toast.error(data.message)
            }

            setIsEdit(false)

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }
    }

    const handleDelete = async () => {
        if (!password) {
            setPasswordError('Please enter your password')
            return
        }

        try {
            setDeleteConfirm(false) // Close dialog first
            setIsDeleting(true) // Then show loading screen
            
            const { data } = await axios.post(
                backendUrl + '/api/doctor/delete-account',
                { password },
                { headers: { dToken } }
            )

            if (data.success) {
                setTimeout(() => {
                    toast.success(data.message)
                }, 500)
                localStorage.removeItem('dToken')
                setDToken(null) // Add this line to update context state
                navigate('/login')
            } else {
                setPasswordError(data.message)
                setDeleteConfirm(true)
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        } finally {
            setIsDeleting(false)
        }
    }

    useEffect(() => {
        if (dToken) {
            getProfileData()
        }
    }, [dToken])

    return profileData && (
        <>
            {isDeleting && <LoadingScreen />}
            <div className="min-h-screen w-full py-8">
                <div className="max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left Column - Profile Card */}
                        <div className="lg:col-span-4">
                            <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-sm overflow-hidden relative transition-all">
                                {/* Profile Image and Basic Info */}
                                <div className="p-6 text-center border-b border-gray-100">
                                    <div className="relative mx-auto w-32 h-32 mb-4">
                                        <img 
                                            src={profileData.image} 
                                            alt={profileData.name} 
                                            className="w-full h-full rounded-full object-cover border-4 border-white shadow-md"
                                        />
                                        <div className={`absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-white ${
                                            profileData.available ? 'bg-green-400' : 'bg-gray-400'
                                        }`}></div>
                                    </div>
                                    <h1 className="text-xl font-bold text-gray-900 mb-1">{profileData.name}</h1>
                                    <p className="text-primary font-medium mb-2">{profileData.speciality}</p>
                                    <p className="text-gray-600 text-sm">{profileData.degree}</p>
                                </div>

                                {/* Quick Info */}
                                <div className="p-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600 text-sm">Status</span>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-sm font-medium ${
                                                profileData.available ? 'text-green-600' : 'text-gray-600'
                                            }`}>
                                                {profileData.available ? 'Available' : 'Not Available'}
                                            </span>
                                            {isEdit && (
                                                <Switch 
                                                    checked={profileData.available}
                                                    onCheckedChange={() => setProfileData(prev => ({ ...prev, available: !prev.available }))}
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600 text-sm">Experience</span>
                                        <span className="text-gray-900 text-sm font-medium">{profileData.experience}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600 text-sm">Consultation Fee</span>
                                        {isEdit ? (
                                            <div className="relative">
                                                <input 
                                                    type="number" 
                                                    value={profileData.fees}
                                                    onChange={(e) => setProfileData(prev => ({ ...prev, fees: e.target.value }))}
                                                    className={`w-36 pl-3 pr-9 py-1 text-right rounded border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm ${
                                                        !profileData.fees || profileData.fees <= 0 
                                                            ? 'border-red-300 bg-red-50' 
                                                            : 'border-gray-300'
                                                    }`}
                                                    min="0"
                                                    required
                                                />
                                                <span className="absolute inset-y-0 right-3 flex items-center text-gray-500 text-sm">
                                                    {currency}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-gray-900 text-sm font-medium">{profileData.fees} {currency}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Main Content */}
                        <div className="lg:col-span-8">
                            <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-sm p-6 transition-all">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
                                    {!isEdit ? (
                                        <button 
                                            onClick={() => setIsEdit(true)}
                                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200 border border-blue-200 shadow-sm"
                                        >
                                            <img src={assets.doctor_icon} alt="Edit" className="w-5 h-5 mr-2" />
                                            Edit Profile
                                        </button>
                                    ) : (
                                        <div className="flex gap-3">
                                            <button 
                                                onClick={updateProfile}
                                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-all duration-200 border border-emerald-200 shadow-sm hover:shadow-md"
                                            >
                                                <img src={assets.doctor_profile_tick_icon} alt="Save" className="w-5 h-5 mr-2" />
                                                Save
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    setIsEdit(false);
                                                    getProfileData();
                                                }}
                                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 rounded-lg transition-all duration-200 border border-gray-200 shadow-sm hover:shadow-md"
                                            >
                                                <img src={assets.doctor_profile_cancel_icon} alt="Cancel" className="w-5 h-5 mr-2" />
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>
                                
                                {/* About Section */}
                                <div className="mb-8">
                                    <h3 className="text-base font-medium text-gray-900 mb-4">About</h3>
                                    {isEdit ? (
                                        <div>
                                            <textarea 
                                                onChange={(e) => setProfileData(prev => ({ ...prev, about: e.target.value }))} 
                                                value={profileData.about}
                                                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm ${
                                                    profileData.about.length < 300 ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                                }`}
                                                rows={6} 
                                                minLength={300}
                                            />
                                            <span className={`text-xs ${profileData.about.length < 300 ? 'text-red-500' : 'text-gray-500'}`}>
                                                {profileData.about.length}/300 characters (minimum)
                                            </span>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{profileData.about}</p>
                                    )}
                                </div>

                                {/* Address Section */}
                                <div>
                                    <h3 className="text-base font-medium text-gray-900 mb-4">Clinic Address</h3>
                                    {isEdit ? (
                                        <div className="space-y-3">
                                            <input 
                                                type="text" 
                                                value={profileData.address.line1}
                                                onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))}
                                                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm ${
                                                    !profileData.address.line1 && !profileData.address.line2 
                                                        ? 'border-red-300 bg-red-50' 
                                                        : 'border-gray-300'
                                                }`}
                                                placeholder="Address Line 1"
                                            />
                                            <input 
                                                type="text" 
                                                value={profileData.address.line2}
                                                onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))}
                                                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm ${
                                                    !profileData.address.line1 && !profileData.address.line2 
                                                        ? 'border-red-300 bg-red-50' 
                                                        : 'border-gray-300'
                                                }`}
                                                placeholder="Address Line 2"
                                            />
                                        </div>
                                    ) : (
                                        <div className="text-sm text-gray-600">
                                            {profileData.address.line1 && <p>{profileData.address.line1}</p>}
                                            {profileData.address.line2 && <p>{profileData.address.line2}</p>}
                                        </div>
                                    )}
                                </div>

                                {/* Danger Zone */}
                                <div className="mt-8 pt-6 border-t border-gray-200">
                                    <h3 className="text-base font-medium text-red-600 mb-4">Delete Account</h3>
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-red-600 mt-1">Once you delete your account, there is no going back. Please be certain.</p>
                                            </div>
                                            <button 
                                                onClick={() => setDeleteConfirm(true)}
                                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-white hover:bg-red-50 rounded-lg transition-all duration-200 border border-red-300 shadow-sm"
                                            >
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Delete Account
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Account Confirmation Dialog */}
            <Dialog open={deleteConfirm} onOpenChange={(open) => {
                if (!open) {
                    setDeleteConfirm(false)
                    setPassword('')
                    setPasswordError('')
                }
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Account</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete your account? This action cannot be undone. Please enter your password to confirm.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4">
                        <label htmlFor="delete-password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="delete-password"
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
                                setDeleteConfirm(false)
                                setPassword('')
                                setPasswordError('')
                            }}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                        >
                            Delete Account
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default DoctorProfile