
import {get,post} from './httpClient'



export const getTokenPrice = async (postData) => {
   
    const token = localStorage.getItem('token');
    const uid = localStorage.getItem('uid');
    try {
        const response = await post('/data/api/data/price',
            {
              Authorization: `${token}`,
              Uid: `${uid}`
            }
          ,postData);
        return response?.data;
        


    } catch (error) {
        console.error('Request error:', error);
       
    }
};
