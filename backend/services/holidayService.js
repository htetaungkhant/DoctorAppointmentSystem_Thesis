import axios from 'axios';
import NodeCache from 'node-cache';

// Initialize cache with 24 hours TTL
const holidayCache = new NodeCache({ stdTTL: 86400 });

// Function to fetch public holidays from Calendarific API
const fetchPublicHolidays = async () => {
    const cacheKey = `holidays_${new Date().getFullYear()}`;
    
    // Check cache first
    const cachedHolidays = holidayCache.get(cacheKey);
    if (cachedHolidays) {
        return cachedHolidays;
    }

    try {
        const year = new Date().getFullYear();
        const response = await axios.get(
            `https://calendarific.com/api/v2/holidays?api_key=${process.env.CALENDARIFIC_API_KEY}&country=MM&year=${year}`
        );

        if (response.data.response?.holidays) {
            const holidays = response.data.response.holidays.map(holiday => new Date(holiday.date.iso));
            
            // Store in cache
            holidayCache.set(cacheKey, holidays);
            
            return holidays;
        }
        return [];
    } catch (error) {
        console.error('Failed to fetch public holidays:', error);
        return [];
    }
};

export { fetchPublicHolidays };