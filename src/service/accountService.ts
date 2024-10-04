import axiosInstance from "../../axiosConfig";

interface AccountsResponse {
    data: {
      data: AccountDTO[];
      meta: {
        page: number;
        take: number;
        itemCount: number;
        pageCount: number;
        hasPreviousPage: boolean;
        hasNextPage: boolean;
      };
    };
}
interface AccountResponse {
  data: {
    data: AccountDTO;
  };
}
interface AccountRe {
    email?: string
    password?: string
    roleId?: string;
    profile?: Partial<ProfileDTO>;
}
export interface CreateAccountRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleId: string;
}
export const getAccounts = async (): Promise<AccountDTO[]> => {
    const response = await axiosInstance.get<AccountsResponse>('authentication-service/account');
        // Save token to localStorage or any other secure place
        
    return response.data.data.data;
}
export const deleteAccount = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`authentication-service/account/${id}`);
  return response.data;
  } catch (error) {
    return false;
  }
  
}

export const updateAccount = async (id : string, data : AccountRe) => {
  
}

export const mapToCreateAccountRequest = (data: any): AccountRe => {
    // Implement the mapping logic here
    return {};
};

export const CreateAccount = async (data : CreateAccountRequest) => {
  try {
    const response = await axiosInstance.post<AccountResponse>('authentication-service/account',data);
    return response.data
  } catch (error) {
    return false;
  }
}
