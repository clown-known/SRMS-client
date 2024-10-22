import Cookies from 'js-cookie';
import useSWR from 'swr';
import axiosInstance from '../../axiosConfig';
// hook usecookie

interface LoginRequest {
    email: string;
    password: string;
}
  
interface LoginResponse {
    data:{
      token: {
        accessToken: string,
        refreshToken:string,
        expiredAt:Date,
        permission: string[]
      };
      name: string
    }
}

interface RegisterRequest{
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  dateOfBirth: string;
}

interface ForgotPasswordRequest{
  email: string;
}

interface ConfirmCodeRequest{
  code: string;
}

interface ConfirmCodeResponse{
  data:{
    accessToken: string
  }
}
interface ResetPasswordRequest{
  newPassword : string;
}
interface ResetPasswordResponse{
  data: boolean
}
const isProduction = process.env.NODE_ENV === 'production';
const cookieOptions = {
  secure: isProduction,
  httpOnly: isProduction,
}
  // Function to login and handle the response
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  
  try {
    const response = await axiosInstance.post<LoginResponse>('authentication-service/auth/login', data);
      // Save token to localStorage or any other secure place
    Cookies.set('token', response.data.data.token.accessToken, cookieOptions);

    Cookies.set('refreshToken', response.data.data.token.refreshToken, cookieOptions);

    return response.data;
  } catch (error) {
    throw new Error('Login failed. Please check your credentials and try again.');
  }
};
export const register = async (data: RegisterRequest): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>('authentication-service/auth/register', data);
      // Save token to localStorage or any other secure place
  Cookies.set('token', response.data.data.token.accessToken, cookieOptions);
  Cookies.set('refreshToken', response.data.data.token.refreshToken,cookieOptions);
      // Return the response data
  return response.data;
}

export const forgotPassword = async (data: ForgotPasswordRequest) => {
  const response = await axiosInstance.post<LoginResponse>('authentication-service/auth/forgot-password', data);
  localStorage.setItem('email',data.email)  
      // Return the response data
  return response;
}

export const confirmCode = async (data: ConfirmCodeRequest) => {
  const email = localStorage.getItem('email') ?? '';
  const response = await axiosInstance.post<ConfirmCodeResponse>('authentication-service/auth/confirm-code', {email,code:data.code});
  Cookies.remove('token');
  await Cookies.set('token', response.data.data.accessToken,cookieOptions);
}
export const resetPassword = async (data:ResetPasswordRequest) => {
  try {
    const response = await axiosInstance.post<ResetPasswordResponse>(`authentication-service/auth/reset-password`,data);
    return response.data
  } catch (error) {
    return false;
  }
  
}
interface UpdateProfileRequest{
    firstName: string;

    lastName: string;

    phoneNumber: string;

    address: string;

    dateOfBirth: Date;
}
interface UpdateProfileResponse extends BaseResponse<ProfileDTO>{

}
export const UpdateMyProfile = async (data:UpdateProfileRequest) => {
  try {
    const response = await axiosInstance.put<UpdateProfileResponse>('authentication-service/profile',data);
    return response;
  } catch (error) {
    console.error('Error updating profile:', error);
    // Handle the error, e.g., show an error message to the user
  }
}
export const Logout = async () =>{
  const response = await axiosInstance.get('authentication-service/auth/logout');
  Cookies.remove('token');
  Cookies.remove('refreshToken');
}
interface ChangePasswordRequest{
  oldPassword: string;
  newPassword: string;
}
export const changePassword = async(data: ChangePasswordRequest) =>{
    const response = await axiosInstance.put<UpdateProfileResponse>(`authentication-service/account/changePassword`,data);
    return response;
}

