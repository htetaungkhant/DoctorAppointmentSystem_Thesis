import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import axios from 'axios'
import { toast } from 'react-toastify'

const Appointment = () => {

    const { docId } = useParams()
    const { doctors, currencySymbol, backendUrl, token, getDoctosData } = useContext(AppContext)
    const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

    const [docInfo, setDocInfo] = useState(false)
    const [docSlots, setDocSlots] = useState([])
    const [slotIndex, setSlotIndex] = useState(0)
    const [slotTime, setSlotTime] = useState('')
    const [, setMinDate] = useState(new Date());
    const [currentMonthOffset, setCurrentMonthOffset] = useState(0);

    const navigate = useNavigate()

    const resetSlotTime = () => {
        setSlotTime('');
    };

    const fetchDocInfo = async () => {
        const docInfo = doctors.find((doc) => doc._id === docId)
        setDocInfo(docInfo)
    }

    const getAvailableSolts = async () => {
        setDocSlots([]);
        
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctor/schedule/${docId}`);
            if (!data.success) {
                toast.error('Failed to fetch doctor schedule');
                return;
            }
            
            const doctorSchedule = data.schedule || {};
            
            // Check if doctor has set up any schedule
            const hasAnySchedule = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
                .some(day => doctorSchedule[day]?.length > 0);
                
            if (!hasAnySchedule) {
                setDocSlots([]); // Clear any existing slots
                return; // Return early, the empty docSlots will trigger the "no schedule" message
            }

            const startDate = new Date(doctorSchedule.minDate);
            const endDate = new Date(doctorSchedule.maxDate);
            const serverTime = new Date(doctorSchedule.serverTime);
            setMinDate(startDate);

            // Convert unavailable dates and public holidays to Date objects
            const unavailableDates = [
                ...(doctorSchedule.unavailableDates || []).map(date => new Date(date)),
                ...(doctorSchedule.publicHolidaysEnabled ? (doctorSchedule.publicHolidays || []).map(date => new Date(date)) : [])
            ];

            // Changed array to match backend's day order (Monday first)
            const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
            let dateSlots = [];

            // Calculate the number of empty slots needed at the start to align with correct weekday
            const firstDayIndex = startDate.getDay() - 1; // -1 to convert from Sunday=0 to Monday=0
            const emptySlots = firstDayIndex >= 0 ? firstDayIndex : 6; // If Sunday (0), we need 6 empty slots

            // Add empty slots for proper alignment
            for (let i = 0; i < emptySlots; i++) {
                const emptyDate = new Date(startDate);
                emptyDate.setDate(startDate.getDate() - (emptySlots - i));
                dateSlots.push({ date: emptyDate, slots: [] });
            }

            // Iterate through dates and adjust for day offset
            for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
                let dayIndex = date.getDay() - 1; // Adjust to make Monday index 0
                if (dayIndex === -1) dayIndex = 6; // Handle Sunday
                const dayName = days[dayIndex];
                const daySchedule = doctorSchedule[dayName] || [];
                let timeSlots = [];

                // Skip past dates (but not today) and unavailable dates
                if ((date < serverTime && date.toDateString() !== serverTime.toDateString()) || 
                    unavailableDates.some(unavailableDate => 
                        unavailableDate.getFullYear() === date.getFullYear() &&
                        unavailableDate.getMonth() === date.getMonth() &&
                        unavailableDate.getDate() === date.getDate()
                    )) {
                    dateSlots.push({ date: new Date(date), slots: [] });
                    continue;
                }

                // Process time slots
                if (daySchedule.length > 0) {
                    for (const slot of daySchedule) {
                        let slotDateTime = new Date(date);
                        let [hours, minutes] = slot.startTime.split(':');
                        slotDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

                        // For today, skip only the slots that have already started based on server time
                        // For future dates, include all slots
                        if (date.toDateString() === serverTime.toDateString() && slotDateTime <= serverTime) {
                            continue;
                        }

                        timeSlots.push({
                            datetime: new Date(slotDateTime),
                            startTime: slot.startTime,
                            endTime: slot.endTime
                        });
                    }
                }

                dateSlots.push({
                    date: new Date(date),
                    slots: timeSlots
                });
            }

            // Add empty slots at the end to complete the grid if needed
            const totalDays = dateSlots.length;
            const remainder = totalDays % 7;
            if (remainder > 0) {
                const daysToAdd = 7 - remainder;
                const lastDate = new Date(dateSlots[dateSlots.length - 1].date);
                for (let i = 1; i <= daysToAdd; i++) {
                    const fillerDate = new Date(lastDate);
                    fillerDate.setDate(lastDate.getDate() + i);
                    dateSlots.push({ date: fillerDate, slots: [] });
                }
            }

            setDocSlots(dateSlots);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch available slots');
        }
    };

    const bookAppointment = async () => {
        if (!slotTime) {
            toast.warning('Please select an appointment time');
            return;
        }

        if (!token) {
            toast.warning('Login to book appointment')
            return navigate('/login')
        }

        const selectedSlot = docSlots[slotIndex];
        if (!selectedSlot) {
            toast.error('Invalid date selection');
            return;
        }

        const date = selectedSlot.date;
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        const slotDate = `${day}_${month}_${year}`;

        try {
            const { data } = await axios.post(
                backendUrl + '/api/user/book-appointment', 
                { docId, slotDate, slotTime }, 
                { headers: { token } }
            )
            
            if (data.success) {
                toast.success(data.message)
                getDoctosData()
                navigate('/my-appointments')
            } else {
                if (data.message === 'Doctor is not available on this date') {
                    toast.error('The doctor has marked this date as unavailable')
                } else if (data.message === 'Slot Not Available') {
                    toast.error('You already have an appointment booked at this time')
                } else {
                    toast.error(data.message)
                }
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (doctors.length > 0) {
            fetchDocInfo()
        }
    }, [doctors, docId])

    useEffect(() => {
        if (docInfo) {
            getAvailableSolts()
        }
    }, [docInfo])

    return docInfo ? (
        <div>

            {/* ---------- Doctor Details ----------- */}
            <div className='flex flex-col sm:flex-row gap-4'>
                <div>
                    <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt="" />
                </div>

                <div className='flex-1 border border-[#ADADAD] rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>

                    {/* ----- Doc Info : name, degree, experience ----- */}

                    <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>{docInfo.name} <img className='w-5' src={assets.verified_icon} alt="" /></p>
                    <div className='flex items-center gap-2 mt-1 text-gray-600'>
                        <p>{docInfo.degree} - {docInfo.speciality}</p>
                        <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
                    </div>

                    {/* ----- Doc About ----- */}
                    <div>
                        <p className='flex items-center gap-1 text-sm font-medium text-[#262626] mt-3'>About <img className='w-3' src={assets.info_icon} alt="" /></p>
                        <p className='text-sm text-gray-600 max-w-[700px] mt-1'>{docInfo.about}</p>
                    </div>

                    <p className='text-gray-600 font-medium mt-4'>Consultation fee: <span className='text-gray-800'>{docInfo.fees}{currencySymbol}</span> </p>
                </div>
            </div>

            {/* Doctor Availability Notice */}
            {!docInfo.available && (
                <div className="sm:ml-72 sm:pl-4 mt-8">
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
                        <svg className="w-12 h-12 text-orange-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Doctor Currently Unavailable</h3>
                        <p className="text-gray-600">Dr. {docInfo.name} is not accepting appointments at this time.</p>
                        <p className="text-sm text-gray-500 mt-2">Please check back later or explore other available doctors.</p>
                    </div>
                </div>
            )}

            {/* Booking slots - Only show if doctor is available */}
            {docInfo.available && (
                <div className='sm:ml-72 sm:pl-4 mt-8 font-medium text-[#565656]'>
                    <p className="text-lg mb-2">Available Appointment Slots</p>
                    {docSlots.length > 0 ? (
                        <>
                            {/* Month navigation */}
                            <div className="flex items-center justify-between mb-6 bg-white rounded-lg shadow-sm border border-gray-100 p-3">
                                <button 
                                    onClick={() => {
                                        setCurrentMonthOffset(prev => Math.max(prev - 1, 0));
                                        resetSlotTime();
                                    }}
                                    disabled={currentMonthOffset === 0}
                                    className={`p-2 rounded-lg transition-all duration-200 ${
                                        currentMonthOffset === 0 
                                            ? 'text-gray-300 cursor-not-allowed' 
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                                    }`}
                                >
                                    <svg className="w-5 h-5" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <h3 className="text-lg font-semibold text-gray-800">
                                    {new Date(docSlots[currentMonthOffset * 28]?.date).toLocaleString('default', { month: 'long', year: 'numeric' })}
                                </h3>
                                <button 
                                    onClick={() => {
                                        setCurrentMonthOffset(prev => prev + 1);
                                        resetSlotTime();
                                    }}
                                    disabled={currentMonthOffset * 28 + 28 >= docSlots.length}
                                    className={`p-2 rounded-lg transition-all duration-200 ${
                                        currentMonthOffset * 28 + 28 >= docSlots.length
                                            ? 'text-gray-300 cursor-not-allowed' 
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                                    }`}
                                >
                                    <svg className="w-5 h-5" fill="none" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>

                            {/* Calendar container */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                                {/* Calendar header */}
                                <div className="grid grid-cols-7 gap-1.5 mb-3">
                                    {daysOfWeek.map(day => (
                                        <div key={day} className="text-center font-semibold text-sm text-gray-600 py-2 border-b border-gray-100">
                                            {day}
                                        </div>
                                    ))}
                                </div>

                                {/* Calendar grid */}
                                <div className="grid grid-cols-7 gap-1.5">
                                    {docSlots.slice(currentMonthOffset * 28, currentMonthOffset * 28 + 28).map((dateSlot, index) => {
                                        const isToday = dateSlot.date.toDateString() === new Date().toDateString();
                                        const hasSlots = dateSlot.slots.length > 0;
                                        const isSelected = slotIndex === currentMonthOffset * 28 + index;
                                        return (
                                            <div 
                                                key={index}
                                                onClick={() => {
                                                    setSlotIndex(currentMonthOffset * 28 + index);
                                                    resetSlotTime();
                                                }}
                                                className={`py-3 px-1 transition-all duration-200 cursor-pointer rounded-lg border ${
                                                    isSelected
                                                        ? 'bg-primary text-white border-primary shadow-md scale-105 z-10' 
                                                        : isToday 
                                                            ? 'bg-primary/5 text-primary border-primary shadow-sm' 
                                                            : hasSlots
                                                                ? 'border-gray-100 hover:border-primary hover:shadow-md hover:scale-105 bg-white'
                                                                : 'border-gray-50 hover:border-gray-200 hover:bg-gray-50/50 bg-white'
                                                }`}
                                            >
                                                <div className="text-center">
                                                    <p className={`text-base leading-none mb-2 ${
                                                        isSelected 
                                                            ? 'font-bold' 
                                                            : hasSlots 
                                                                ? 'font-medium' 
                                                                : 'font-normal'
                                                    }`}>
                                                        {dateSlot.date.getDate()}
                                                    </p>
                                                    {hasSlots && (
                                                        <div className={`text-[11px] leading-none ${
                                                            isSelected 
                                                                ? 'text-white/90' 
                                                                : 'text-primary'
                                                        }`}>
                                                            {dateSlot.slots.length} slots
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Selected date info and time slots */}
                            {docSlots[slotIndex] && (
                                <div className='mt-8'>
                                    <div className="flex items-center justify-between mb-4">
                                        <p className="text-sm">
                                            {docSlots[slotIndex].date.toLocaleDateString('en-US', { 
                                                weekday: 'long', 
                                                month: 'long', 
                                                day: 'numeric' 
                                            })}
                                        </p>
                                        {docSlots[slotIndex].slots.length > 0 ? (
                                            <span className="text-xs text-primary">
                                                {docSlots[slotIndex].slots.length} slots available
                                            </span>
                                        ) : (
                                            <span className="text-xs text-gray-500">
                                                No slots available
                                            </span>
                                        )}
                                    </div>

                                    {docSlots[slotIndex].slots.length > 0 ? (
                                        <div className='bg-gray-50 rounded-lg p-6'>
                                            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3'>
                                                {docSlots[slotIndex].slots.map((slot, index) => {
                                                    const startTime = new Date(`2000-01-01T${slot.startTime}`);
                                                    const endTime = new Date(`2000-01-01T${slot.endTime}`);
                                                    const isSelected = slot.startTime === slotTime;
                                                    return (
                                                        <div 
                                                            key={index}
                                                            onClick={() => setSlotTime(slot.startTime)}
                                                            className={`p-3 rounded-lg cursor-pointer transition-all duration-200 group ${
                                                                isSelected 
                                                                    ? 'bg-primary text-white shadow-md border border-primary' 
                                                                    : 'bg-white border border-gray-200 hover:border-primary hover:shadow-md'
                                                            }`}
                                                        >
                                                            <div className="text-center space-y-2">
                                                                <p className={`text-sm font-medium ${
                                                                    isSelected ? 'text-white' : 'text-gray-700'
                                                                }`}>
                                                                    {startTime.toLocaleTimeString([], { 
                                                                        hour: 'numeric',
                                                                        minute: '2-digit',
                                                                        hour12: true 
                                                                    }).toLowerCase()}
                                                                </p>
                                                                <div className={`flex items-center justify-center gap-1.5 ${
                                                                    isSelected ? 'opacity-60' : 'opacity-30 group-hover:opacity-60'
                                                                }`}>
                                                                    <div className="h-[1px] w-2 bg-current"></div>
                                                                    <div className="h-1 w-1 rounded-full bg-current"></div>
                                                                    <div className="h-[1px] w-2 bg-current"></div>
                                                                </div>
                                                                <p className={`text-sm font-medium ${
                                                                    isSelected ? 'text-white' : 'text-gray-700'
                                                                }`}>
                                                                    {endTime.toLocaleTimeString([], { 
                                                                        hour: 'numeric',
                                                                        minute: '2-digit',
                                                                        hour12: true 
                                                                    }).toLowerCase()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 px-4 bg-gray-50 rounded-lg">
                                            <p className="text-gray-500">No appointment slots available for this date.</p>
                                            <p className="text-xs text-gray-400 mt-1">Please select another date or check back later.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            <button 
                                onClick={bookAppointment} 
                                disabled={!slotTime}
                                className={`mt-8 py-2.5 px-6 rounded transition-all duration-200 ${
                                    slotTime 
                                        ? 'bg-primary text-white hover:bg-blue-600 shadow-sm hover:shadow' 
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                            >
                                Book Appointment
                            </button>
                        </>
                    ) : (
                        <div className="mt-4 p-6 bg-gray-50 rounded-lg text-center">
                            <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-gray-600">This doctor hasn't set up their consultation schedule yet.</p>
                            <p className="text-sm text-gray-500 mt-2">Please check back later or try another doctor.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Listing Related Doctors */}
            <RelatedDoctors speciality={docInfo.speciality} docId={docId} />
        </div>
    ) : null
}

export default Appointment