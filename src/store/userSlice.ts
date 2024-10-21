import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axiosGetMeInstance from '../../axiosGetMeConfig';

interface UserState {
  username: string | null;
  isLoggedIn: boolean;
  permissions: string[]; 
  roleId: string|null;
}
const initialState: UserState = {
  username: null,
  isLoggedIn: false, 
  permissions: [],
  roleId: null
};
export const fetchUserPermissions = createAsyncThunk(
  'user/fetchUserPermissions',
  async () => {
    try{
      const response = await axiosGetMeInstance.get('authentication-service/auth/get-me'); // Replace with actual API path
      // console.log(response)
      return response.data.data;
    }catch(err){
      return initialState;
    }
  }
);
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginState: (state, action: PayloadAction<{ username: string, permission?: string[] }>) => {
      state.username = action.payload.username;
      state.isLoggedIn = true;
      state.permissions = action.payload.permission || []; 
    },
    changeNameState:(state,action: PayloadAction<{ username: string }>)=>{
      state.username = action.payload.username;
    },
    logoutState: (state) => {
      state.username = null;
      state.isLoggedIn = false;
      state.permissions = []; 
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserPermissions.fulfilled, (state, action) => {
      state.permissions = action.payload.permissions;
      state.username = action.payload.name
      state.roleId = action.payload.roleId
    });
  },
});

export const { loginState, logoutState,changeNameState } = userSlice.actions;
export default userSlice.reducer;