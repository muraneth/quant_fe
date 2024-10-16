
import {get,post} from './httpClient'


const CACHE_KEY = 'tokensCache';
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

export const getTokens = async () => {
    // const cachedData = localStorage.getItem(CACHE_KEY);
    
    // if (cachedData) {
    //     const { data, timestamp } = JSON.parse(cachedData);
    //     const isCacheValid = (Date.now() - timestamp) < CACHE_DURATION;
        
    //     if (isCacheValid) {
    //         return data;
    //     }
    // }

    try {
        const response = await get('/api/token/tokens');
        const responseData = response.data;
        
        // Cache the result with the current timestamp
        // localStorage.setItem(CACHE_KEY, JSON.stringify({
        //     data: responseData,
        //     timestamp: Date.now()
        // }));
        
        return responseData;
    } catch (error) {
        console.error('Request error:', error);
        throw error;
    }
};

export const getToken = async (symbol) => {
    try {
        const response = await get(`/api/token?symbol=${symbol}`);
        return response.data;
    } catch (error) {
        console.error('Request error:', error);
        throw error;
    }
};

export const searchToken = async (symbol) =>{
    try {
        const response = await get(`/api/token/searchToken?key=${symbol}`);
        return response.data;
    } catch (error) {
        console.error('Request error:', error);
        throw error;
    }

}