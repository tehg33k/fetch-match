import { axios } from '../helpers/axios';
import qs from 'qs';

export const searchDogs = async (filters?: {
    breeds?: string[];
    zipCodes?: string[];
    ageMin?: number;
    ageMax?: number;
}): Promise<any> => {
  try {
    const { data } = await axios.get(`/dogs/search`, {
      params: {
        ...filters,
      },
      paramsSerializer: params => qs.stringify(params),
    });

    return data;
  } catch (error: any) {
    return Promise.reject(error?.response?.data);
  }
};

export const getDogs = async (payload: string[]): Promise<any> => {
  try {
    const { data } = await axios.post(`/dogs`, payload);

    return data;
  } catch (error: any) {
    return Promise.reject(error?.response?.data);
  }
};

export const getDogBreeds = async (): Promise<any> => {
  try {
    const { data } = await axios.get(`/dogs/breeds`);

    return data;
  } catch (error: any) {
    return Promise.reject(error?.response?.data);
  }
};