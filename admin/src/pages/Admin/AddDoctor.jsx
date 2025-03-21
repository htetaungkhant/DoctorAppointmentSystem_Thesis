import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import LoadingScreen from '../../components/ui/LoadingScreen'

const AddDoctor = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [docImg, setDocImg] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [experience, setExperience] = useState('House Surgeon')
    const [fees, setFees] = useState('')
    const [about, setAbout] = useState('')
    const [speciality, setSpeciality] = useState('General Medicine')
    const [degree, setDegree] = useState('')
    const [address1, setAddress1] = useState('')
    const [address2, setAddress2] = useState('')

    const { backendUrl } = useContext(AppContext)
    const { aToken } = useContext(AdminContext)

    const onSubmitHandler = async (event) => {
        event.preventDefault()

        try {
            setIsLoading(true)

            if (!docImg) {
                return toast.error('Image Not Selected')
            }

            if (about.length < 300) {
                return toast.error('About section must be at least 300 characters long')
            }

            if (!address1 && !address2) {
                return toast.error('Please fill at least one address field')
            }

            const formData = new FormData();

            formData.append('image', docImg)
            formData.append('name', name)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('experience', experience)
            formData.append('fees', Number(fees))
            formData.append('about', about)
            formData.append('speciality', speciality)
            formData.append('degree', degree)
            formData.append('address', JSON.stringify({ line1: address1, line2: address2 }))

            // console log formdata            
            formData.forEach((value, key) => {
                console.log(`${key}: ${value}`);
            });

            const { data } = await axios.post(backendUrl + '/api/admin/add-doctor', formData, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
                setDocImg(false)
                setName('')
                setPassword('')
                setEmail('')
                setAddress1('')
                setAddress2('')
                setDegree('')
                setAbout('')
                setFees('')
                setExperience('House Surgeon')
                setSpeciality('General physician')
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        } finally {
            setIsLoading(false)
        }

    }

    return (
        <>
            {isLoading && <LoadingScreen />}
            <form onSubmit={onSubmitHandler} className='m-5 w-full'>

                <p className='mb-3 text-lg font-medium'>Add Doctor</p>

                <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl overflow-y-scroll'>
                    <div className='flex items-center gap-4 mb-8 text-gray-500'>
                        <label htmlFor="doc-img">
                            <img className='w-16 bg-gray-100 rounded-full cursor-pointer' src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} alt="" />
                        </label>
                        <input onChange={(e) => setDocImg(e.target.files[0])} type="file" name="" id="doc-img" hidden />
                        <p>Upload doctor <br /> picture</p>
                    </div>

                    <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>

                        <div className='w-full lg:flex-1 flex flex-col gap-4'>

                            <div className='flex-1 flex flex-col gap-1'>
                                <p>Your name</p>
                                <input onChange={e => setName(e.target.value)} value={name} className='border rounded px-3 py-2' type="text" placeholder='Name' required />
                            </div>

                            <div className='flex-1 flex flex-col gap-1'>
                                <p>Doctor Email</p>
                                <input onChange={e => setEmail(e.target.value)} value={email} className='border rounded px-3 py-2' type="email" placeholder='Email' required />
                            </div>


                            <div className='flex-1 flex flex-col gap-1'>
                                <p>Set Password</p>
                                <input onChange={e => setPassword(e.target.value)} value={password} className='border rounded px-3 py-2' type="password" placeholder='Password' required />
                            </div>

                            <div className='flex-1 flex flex-col gap-1'>
                                <p>Experience</p>
                                <select onChange={e => setExperience(e.target.value)} value={experience} className='border rounded px-2 py-2' >
                                    <option value="House Surgeon">House Surgeon</option>
                                    <option value="Medical Officer">Medical Officer</option>
                                    <option value="Assistant Specialist">Assistant Specialist</option>
                                    <option value="Specialist">Specialist</option>
                                    <option value="Senior Consultant">Senior Consultant</option>
                                    <option value="Professor">Professor</option>
                                </select>
                            </div>

                            <div className='flex-1 flex flex-col gap-1'>
                                <p>Fees</p>
                                <input onChange={e => setFees(e.target.value)} value={fees} className='border rounded px-3 py-2' type="number" placeholder='Doctor fees' required />
                            </div>

                        </div>

                        <div className='w-full lg:flex-1 flex flex-col gap-4'>

                            <div className='flex-1 flex flex-col gap-1'>
                                <p>Speciality</p>
                                <select onChange={e => setSpeciality(e.target.value)} value={speciality} className='border rounded px-2 py-2'>
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


                            <div className='flex-1 flex flex-col gap-1'>
                                <p>Degree</p>
                                <input onChange={e => setDegree(e.target.value)} value={degree} className='border rounded px-3 py-2' type="text" placeholder='Degree' required />
                            </div>

                            <div className='flex-1 flex flex-col gap-1'>
                                <p>Address <span className="text-xs text-gray-500">(At least one address is required)</span></p>
                                <input onChange={e => setAddress1(e.target.value)} value={address1} className='border rounded px-3 py-2' type="text" placeholder='Address 1' />
                                <input onChange={e => setAddress2(e.target.value)} value={address2} className='border rounded px-3 py-2' type="text" placeholder='Address 2' />
                            </div>

                        </div>

                    </div>

                    <div>
                        <p className='mt-4 mb-2'>About Doctor</p>
                        <textarea 
                            onChange={e => setAbout(e.target.value)} 
                            value={about} 
                            className='w-full px-4 pt-2 border rounded' 
                            rows={5} 
                            placeholder='write about doctor (minimum 300 characters)'
                            minLength={300}
                        />
                        <span className='text-xs text-gray-500'>
                            {about.length}/300 characters (minimum)
                        </span>
                    </div>

                    <button type='submit' className='bg-primary px-10 py-3 mt-4 text-white rounded-full'>Add doctor</button>

                </div>


            </form>
        </>
    )
}

export default AddDoctor