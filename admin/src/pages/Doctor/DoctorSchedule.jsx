import { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const DoctorSchedule = () => {
    const { dToken, backendUrl } = useContext(DoctorContext);
    const defaultSchedule = {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: [],
        unavailableDates: [],
        minDate: new Date(),
        maxDate: new Date(new Date().setMonth(new Date().getMonth() + 2)),
        publicHolidaysEnabled: true
    };
    
    const [schedule, setSchedule] = useState(defaultSchedule);
    const [originalSchedule, setOriginalSchedule] = useState(null);
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    const [publicHolidays, setPublicHolidays] = useState([]);
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const [selectedDate] = useState(null);

    // Helper function to compare schedules
    const hasScheduleChanged = (current, original) => {
        if (!original) return false;

        // Compare public holidays setting
        if (current.publicHolidaysEnabled !== original.publicHolidaysEnabled) return true;

        // Compare time slots for each day
        for (const day of days) {
            const currentSlots = current[day] || [];
            const originalSlots = original[day] || [];
            
            if (currentSlots.length !== originalSlots.length) return true;
            
            for (let i = 0; i < currentSlots.length; i++) {
                if (currentSlots[i].startTime !== originalSlots[i].startTime ||
                    currentSlots[i].endTime !== originalSlots[i].endTime) {
                    return true;
                }
            }
        }

        // Compare unavailable dates
        const currentDates = (current.unavailableDates || []).map(d => 
            d instanceof Date ? d.getTime() : new Date(d).getTime()
        );
        const originalDates = (original.unavailableDates || []).map(d => 
            d instanceof Date ? d.getTime() : new Date(d).getTime()
        );
        
        if (currentDates.length !== originalDates.length) return true;
        
        currentDates.sort();
        originalDates.sort();
        
        for (let i = 0; i < currentDates.length; i++) {
            if (currentDates[i] !== originalDates[i]) return true;
        }

        return false;
    };

    // Update the fetchSchedule function
    const fetchSchedule = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/doctor/schedule', { headers: { dToken } });
            if (data.success) {
                const fetchedSchedule = data.schedule || {};
                const normalizedSchedule = { 
                    ...defaultSchedule,
                    ...fetchedSchedule,
                    unavailableDates: (fetchedSchedule.unavailableDates || []).map(date => new Date(date)),
                    minDate: new Date(fetchedSchedule.minDate),
                    maxDate: new Date(fetchedSchedule.maxDate),
                    publicHolidaysEnabled: fetchedSchedule.publicHolidaysEnabled ?? true
                };
                
                for (const day of days) {
                    normalizedSchedule[day] = Array.isArray(fetchedSchedule[day]) 
                        ? fetchedSchedule[day] 
                        : [];
                }
                
                setSchedule(normalizedSchedule);
                setOriginalSchedule(JSON.parse(JSON.stringify(normalizedSchedule))); // Deep copy
                setUnsavedChanges(false);

                if (fetchedSchedule.publicHolidays) {
                    setPublicHolidays(fetchedSchedule.publicHolidays.map(date => new Date(date)));
                }
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    const fetchPublicHolidays = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/doctor/public-holidays');
            if (data.success) {
                setPublicHolidays(data.holidays.map(date => new Date(date)));
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch public holidays');
        }
    };

    // Update schedule modification functions to use comparison
    const togglePublicHolidays = async (enabled) => {
        const newSchedule = {
            ...schedule,
            publicHolidaysEnabled: enabled
        };
        setSchedule(newSchedule);
        setUnsavedChanges(hasScheduleChanged(newSchedule, originalSchedule));

        if (enabled) {
            await fetchPublicHolidays();
        } else {
            setPublicHolidays([]);
        }
    };

    const addTimeSlot = (day) => {
        const newSchedule = {
            ...schedule,
            [day]: [...(schedule[day] || []), { startTime: "09:00", endTime: "10:00" }]
        };
        setSchedule(newSchedule);
        setUnsavedChanges(hasScheduleChanged(newSchedule, originalSchedule));
    };

    const removeTimeSlot = (day, index) => {
        const newSchedule = {
            ...schedule,
            [day]: (schedule[day] || []).filter((_, i) => i !== index)
        };
        setSchedule(newSchedule);
        setUnsavedChanges(hasScheduleChanged(newSchedule, originalSchedule));
    };

    const updateTimeSlot = (day, index, field, value) => {
        const newSchedule = {
            ...schedule,
            [day]: (schedule[day] || []).map((slot, i) => 
                i === index ? { ...slot, [field]: value } : slot
            )
        };
        setSchedule(newSchedule);
        setUnsavedChanges(hasScheduleChanged(newSchedule, originalSchedule));
    };

    const isDateUnavailable = (date) => {
        // Check if date is a public holiday
        const isPublicHoliday = publicHolidays.some(
            holiday =>
                holiday.getFullYear() === date.getFullYear() &&
                holiday.getMonth() === date.getMonth() &&
                holiday.getDate() === date.getDate()
        );

        // If it's a public holiday and public holidays are enabled, return true
        if (isPublicHoliday && schedule.publicHolidaysEnabled) return true;

        // Otherwise, check if it's in unavailable dates
        return schedule.unavailableDates.some(
            unavailableDate =>
                unavailableDate.getFullYear() === date.getFullYear() &&
                unavailableDate.getMonth() === date.getMonth() &&
                unavailableDate.getDate() === date.getDate()
        );
    };

    const toggleDateAvailability = (date) => {
        const isPublicHoliday = publicHolidays.some(
            holiday => 
                holiday.getFullYear() === date.getFullYear() &&
                holiday.getMonth() === date.getMonth() &&
                holiday.getDate() === date.getDate()
        );

        if (isPublicHoliday && schedule.publicHolidaysEnabled) {
            toast.warning('Cannot modify availability for public holidays while public holidays are enabled');
            return;
        }

        const isUnavailable = schedule.unavailableDates.some(
            unavailableDate => 
                unavailableDate.getFullYear() === date.getFullYear() &&
                unavailableDate.getMonth() === date.getMonth() &&
                unavailableDate.getDate() === date.getDate()
        );
        
        const newSchedule = {
            ...schedule,
            unavailableDates: isUnavailable
                ? schedule.unavailableDates.filter(d => 
                    d.getFullYear() !== date.getFullYear() ||
                    d.getMonth() !== date.getMonth() ||
                    d.getDate() !== date.getDate()
                )
                : [...schedule.unavailableDates, date]
        };
        setSchedule(newSchedule);
        setUnsavedChanges(hasScheduleChanged(newSchedule, originalSchedule));
    };

    // Update saveSchedule function
    const saveSchedule = async () => {
        // Check if there's at least one time slot
        const hasAnyTimeSlot = days.some(day => schedule[day]?.length > 0);
        
        if (!hasAnyTimeSlot) {
            toast.error('Please add at least one time slot before saving');
            return;
        }

        try {
            const { data } = await axios.post(
                backendUrl + '/api/doctor/schedule',
                { 
                    schedule: {
                        ...schedule,
                        unavailableDates: schedule.unavailableDates.map(date => date.toISOString())
                    }
                },
                { headers: { dToken } }
            );
            
            if (data.success) {
                toast.success(data.message);
                setOriginalSchedule(JSON.parse(JSON.stringify(schedule))); // Update original schedule
                setUnsavedChanges(false);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (dToken) {
            fetchSchedule();
        }
    }, [dToken]);

    useEffect(() => {
        if (schedule.publicHolidaysEnabled) {
            fetchPublicHolidays();
        }
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header Section */}
            <div className="max-w-7xl bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Schedule Management</h1>
                        <p className="mt-1 text-sm text-gray-600">Manage your weekly schedule and mark unavailable dates</p>
                    </div>
                    <div className="flex items-center gap-4">
                        {
                            schedule.publicHolidaysEnabled !== undefined &&
                            <label className="flex items-center gap-2 cursor-pointer">
                                <span className="text-sm font-medium text-gray-700">Enable Public Holidays</span>
                                <div className="relative inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={schedule.publicHolidaysEnabled}
                                        onChange={(e) => togglePublicHolidays(e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </div>
                            </label>
                        }
                        <button
                            onClick={saveSchedule}
                            disabled={!unsavedChanges}
                            className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${unsavedChanges
                                    ? 'bg-primary text-white hover:bg-blue-600 shadow-sm hover:shadow'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            <>
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                Save Changes
                            </>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl space-y-6">
                {/* Calendar View - Moved to top */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200">
                    <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-900">Availability Calendar</h3>
                        <p className="text-xs text-gray-500 mt-1">Click on dates to toggle availability</p>
                    </div>

                    <div className="p-4">
                        <style>{`
                            .react-calendar { 
                                border: none;
                                width: 100%;
                                background: white;
                                font-family: inherit;
                            }
                            .react-calendar__tile {
                                padding: 0.75em 0.5em;
                                font-size: 0.875rem;
                                line-height: 1.25rem;
                            }
                            .react-calendar__tile--now {
                                background: #e5edff;
                                color: #1e40af;
                            }
                            .react-calendar__tile--now:enabled:hover,
                            .react-calendar__tile--now:enabled:focus {
                                background: #dbe7ff;
                            }
                            .react-calendar__tile--unavailable {
                                background: #fee2e2;
                                color: #991b1b;
                                font-weight: 500;
                            }
                            .react-calendar__tile--unavailable:enabled:hover,
                            .react-calendar__tile--unavailable:enabled:focus {
                                background: #fecaca;
                            }
                            .react-calendar__tile--active {
                                background: #2563eb !important;
                                color: white;
                                font-weight: 600;
                            }
                            .react-calendar__tile--active:enabled:hover,
                            .react-calendar__tile--active:enabled:focus {
                                background: #1d4ed8 !important;
                            }
                            .react-calendar__tile:disabled {
                                background-color: #f3f4f6;
                                color: #9ca3af;
                            }
                            .react-calendar__navigation button:disabled {
                                background-color: transparent;
                            }
                            .react-calendar__navigation button:enabled:hover,
                            .react-calendar__navigation button:enabled:focus {
                                background-color: #f3f4f6;
                            }
                        `}</style>
                        <Calendar
                            onChange={toggleDateAvailability}
                            value={selectedDate}
                            minDate={schedule.minDate}
                            maxDate={schedule.maxDate}
                            className="rounded-lg"
                            tileClassName={({ date }) =>
                                isDateUnavailable(date) ? 'react-calendar__tile--unavailable' : ''
                            }
                        />

                        <div className="mt-4 flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-[#e5edff]"></div>
                                <span className="text-gray-600 font-medium">Today</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-[#fee2e2]"></div>
                                <span className="text-gray-600 font-medium">Unavailable</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Weekly Schedule */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {days.map((day) => (
                        <div key={day} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200">
                            <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-gray-900 capitalize">{day}</h3>
                                    <div className="flex items-center">
                                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${schedule[day]?.length > 0 ? 'bg-green-400' : 'bg-gray-300'
                                            }`}></span>
                                        <span className="text-xs text-gray-500 font-medium">
                                            {schedule[day]?.length || 'No'} slots
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4">
                                <div className="space-y-3">
                                    {(schedule[day] || []).map((slot, index) => (
                                        <div key={index} className="group relative">
                                            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-50 group-hover:bg-gray-100 transition-all duration-200">
                                                <div className="flex items-center gap-2 flex-1 pr-8">
                                                    <input
                                                        type="time"
                                                        value={slot.startTime}
                                                        onChange={(e) => updateTimeSlot(day, index, 'startTime', e.target.value)}
                                                        className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20"
                                                    />
                                                    <span className="text-gray-400 flex-shrink-0">-</span>
                                                    <input
                                                        type="time"
                                                        value={slot.endTime}
                                                        onChange={(e) => updateTimeSlot(day, index, 'endTime', e.target.value)}
                                                        className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20"
                                                    />
                                                </div>
                                                <button
                                                    onClick={() => removeTimeSlot(day, index)}
                                                    className="opacity-0 group-hover:opacity-100 absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
                                                    title="Remove time slot"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => addTimeSlot(day)}
                                    className="mt-3 w-full py-2.5 flex items-center justify-center text-sm font-medium text-primary hover:text-blue-600 border border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-blue-50 transition-all duration-200"
                                >
                                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Add Time Slot
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DoctorSchedule;