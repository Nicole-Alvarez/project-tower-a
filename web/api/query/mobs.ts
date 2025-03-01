import { AxiosError } from 'axios'
import axiosInstance from '@/utils/axios-config'; 

export async function getMobs(): Promise<any> {
    try {
        const response = await axiosInstance.get('/api/v1/mobs/all')
        return response.data
    } catch (error) {
        let message;
        if (error instanceof AxiosError) {
            message = error.response?.data.message;
        }
        throw new Error(message || 'Something went wrong')
    }
} 

export async function getMobById(id: number): Promise<any> {
    try {
        const response = await axiosInstance.get(`/api/v1/mobs/${id}`);
        return response.data;
    } catch (error) {
        let message;
        if (error instanceof AxiosError) {
            message = error.response?.data.message;
        }
        throw new Error(message || 'Something went wrong');
    }
}

// export async function getCoursesByStatusTab({status, skip, take}: any): Promise<any> {
//     try {
//         const response = await axiosInstance.get('/api/v1/courses/by-status', {
//             params: {
//                 status: status.toUpperCase(),
//                 skip,
//                 take,
//             }
//         })
//         return response.data
//     } catch (error) {
//         let message;
//         if (error instanceof AxiosError) {
//             message = error.response?.data.message;
//         }
//         throw new Error(message || 'Something went wrong');
//     }
// }
 