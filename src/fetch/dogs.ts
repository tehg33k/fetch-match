import { axios } from '../helpers/axios';
import qs from 'qs';

export const getDogs = async (filters?: {
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