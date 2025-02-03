import { axios } from '../helpers/axios';

export const login = async (name: string, email: string): Promise<any> => {
    try {
        const response = await axios.post('/auth/login', { name, email });
        return response.data;
    } catch (error: any) {
        return Promise.reject(error.response.data);
    }
};