import axiosInstance from "../../axiosConfig";

interface AccounstResponse{
    data:AccountDTO
}
export const getAccounts = async (): Promise<AccountDTO> => {
    const response = await axiosInstance.get<AccounstResponse>('authentication-service/auth/register');
        // Save token to localStorage or any other secure place
        
    return response.data.data;
}