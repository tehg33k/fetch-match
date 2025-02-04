import { axios } from '../helpers/axios';

export const logIn = async (name: string, email: string): Promise<any> => {
    try {
        const response = await axios.post('/auth/login', { name, email });
        return response.data;
    } catch (error: any) {
        return Promise.reject(error.response.data);
    }
};

export const logOut = async (): Promise<any> => {
    try {
        const response = await axios.post('/auth/logout', {});
        return response.data;
    } catch (error: any) {
        return Promise.reject(error.response.data);
    }
};