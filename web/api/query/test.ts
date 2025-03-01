import { AxiosError } from 'axios'
import axiosInstance from '@/utils/axios-config';  

export async function getTest(): Promise<{}[]> {
    try {
        const response = await axiosInstance.get(`/test/testRoute`);
        return response.data;
    } catch (error) {
        let message;
        if (error instanceof AxiosError) {
            message = error.response?.data.message;
        }
        throw new Error(message || 'Something went wrong');
    }
}
 