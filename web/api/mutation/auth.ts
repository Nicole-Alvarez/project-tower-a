import { AxiosError } from 'axios'
import axiosInstance from '@/utils/axios-config' 

export const userLogin = async (data: any): Promise<any> => {
  try { 
    const response = await axiosInstance.post('/auth/login', data);
    return response.data;
  } catch(error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong')
  }
}
