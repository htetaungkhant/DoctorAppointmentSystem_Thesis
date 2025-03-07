import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { Switch } from '../../components/ui/Switch'
import { assets } from '../../assets/assets'

const DoctorProfile = () => {

    const { dToken, profileData, setProfileData, getProfileData } = useContext(DoctorContext)
    const { currency, backendUrl } = useContext(AppContext)
    const [isEdit, setIsEdit] = useState(false)

    const updateProfile = async () => {
        try {
            if (profileData.about.length < 300) {
                toast.error("About section must be at least 300 characters long")
                return
            }

            if (!profileData.address.line1 && !profileData.address.line2) {
                toast.error("At least one address field must be filled")
                return
            }

            if (!profileData.fees || profileData.fees <= 0) {
                toast.error("Please enter a valid appointment fee")
                return
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

    useEffect(() => {
        if (dToken) {
            getProfileData()
        }
    }, [dToken])

    return profileData && (
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
                                        <input 
                                            type="number" 
                                            value={profileData.fees}
                                            onChange={(e) => setProfileData(prev => ({ ...prev, fees: e.target.value }))}
                                            className={`w-32 px-3 py-1 text-right rounded border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm ${
                                                !profileData.fees || profileData.fees <= 0 
                                                    ? 'border-red-300 bg-red-50' 
                                                    : 'border-gray-300'
                                            }`}
                                            min="0"
                                            required
                                        />
                                    ) : (
                                        <span className="text-gray-900 text-sm font-medium">{profileData.fees}{currency}</span>
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
                                <div className="flex gap-3">
                                    {!isEdit ? (
                                        <button 
                                            onClick={() => setIsEdit(true)}
                                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200 border border-blue-200 shadow-sm"
                                        >
                                            <img src={assets.doctor_icon} alt="Edit" className="w-5 h-5 mr-2" />
                                            Edit Profile
                                        </button>
                                    ) : (
                                        <>
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
                                        </>
                                    )}
                                </div>
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DoctorProfile