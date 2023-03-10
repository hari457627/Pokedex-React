import axios from 'axios';

const fetchData = async (url:string) => {
    try{
        const { status, data } = await axios.get(url);
        if(status === 200){
            return { data, error: false };
        }
        return { error: true };
    } catch(err){
        return { error: true };
    }
}



export default {
    fetchData
};