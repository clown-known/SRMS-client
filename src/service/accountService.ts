import axiosInstance from "../../axiosConfig";

export interface AccountsPage{
  data: AccountDTO[];
      meta: {
        page: number;
        take: number;
        itemCount: number;
        pageCount: number;
        hasPreviousPage: boolean;
        hasNextPage: boolean;
      };
}
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

export interface UpdateAccountRequest {
  firstName: string;
  lastName: string;
  email: string;
  roleId?: string;
  dateOfBirth?: Date;
  phoneNumber?:string;
  address?:string
}


interface ResetPasswordResponse{
  data: boolean
}

interface AssignRoleToUserRequest {
  userId: string;
  roleId: string;
}

export const getAccounts = async (page: number = 1, take: number = 10): Promise<AccountsPage> => {
  const response = await axiosInstance.get<AccountsResponse>(`authentication-service/account?page=${page}&take=${take}`);
  return response.data.data;
}

export const deleteAccount = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`authentication-service/account/${id}`);
  return response.data;
  } catch (error) {
    return false;
  }
}

export const updateAccount = async (id : string, data : UpdateAccountRequest) => {
  try {
    const response = await axiosInstance.put(`authentication-service/account/update${id}`,data);
  return response.data;
  } catch (error) {
    return false;
  }
}
export const updateAccountWithRole = async (id : string, data : UpdateAccountRequest) => {
  try {
    const response = await axiosInstance.put(`authentication-service/account/update-with-role/${id}`,data);
  return response.data;
  } catch (error) {
    return false;
  }
}

export const mapToCreateAccountRequest = (data: any): AccountRe => {
    // Implement the mapping logic here
    return {};
};
export const searchAccounts = async (searchTerm: string, page: number = 1, take: number = 10): Promise<AccountsPage> => {
  try {
    const response = await axiosInstance.get<AccountsResponse>(
      `authentication-service/account?searchKey=${encodeURIComponent(searchTerm.trim())}&page=${page}&take=${take}`
    );
    return response.data.data;
  } catch (error) {
    console.error('Error searching accounts:', error);
    throw error;
  }
}
export const CreateAccount = async (data : CreateAccountRequest) => {
  try {
    const response = await axiosInstance.post<AccountResponse>('authentication-service/account',data);
    return response.data
  } catch (error) {
    return false;
  }
}
export const resetPassword = async (id: string) => {
  try {
    const response = await axiosInstance.put<ResetPasswordResponse>(`authentication-service/account/reset-password/${id}`);
    return response.data
  } catch (error) {
    return false;
  }
  
}

export const assignRole = async (data: AssignRoleToUserRequest) => {
  try {
    const response = await axiosInstance.put(`authentication-service/account/assign`,data);
    return response.data;
  } catch (error) {
    console.error('Error assigning role:', error);
    throw error;
  }
}
export const unAssignRole = async (id: string) => {
  try {
    const response = await axiosInstance.put(`authentication-service/account/unassign/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error assigning role:', error);
    throw error;
  }
}
