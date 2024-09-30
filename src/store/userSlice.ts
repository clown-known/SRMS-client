import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

interface UserState {
  username: string | null;
  isLoggedIn: boolean;
  permission: string[]; 
}
const initialState: UserState = {
  username: null,
  isLoggedIn: false,
  permission: [],
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginState: (state, action: PayloadAction<{ username: string, permission?: string[] }>) => {
      state.username = action.payload.username;
      state.isLoggedIn = true;
      state.permission = action.payload.permission || []; 
      // Store the username in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('username', action.payload.username);
        localStorage.setItem('permission', JSON.stringify(action.payload.permission));
      }
    },
    changeNameState:(state,action: PayloadAction<{ username: string }>)=>{
      state.username = action.payload.username;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('username')
        localStorage.setItem('username', action.payload.username);
      }
    },
    logoutState: (state) => {
      state.username = null;
      state.isLoggedIn = false;
      state.permission = []; 
    },
    loadUserFromStorage: (state) => {
      if (typeof window !== 'undefined') {
        const username = localStorage.getItem('username');
        const permisison = localStorage.getItem('permission');
        if (username) {
          state.username = username;
          state.isLoggedIn = true;
        }
        if(permisison){
          state.permission = JSON.parse(permisison)
        }
      }
    },
  },
});

export const { loginState, logoutState,changeNameState, loadUserFromStorage } = userSlice.actions;
export default userSlice.reducer;