import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

export const login = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
  try {
    return await authService.login(credentials);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Login failed');
  }
});

export const register = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
  try {
    return await authService.register(userData);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Registration failed');
  }
});

export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await authService.logout();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Logout failed');
  }
});

const userStr = localStorage.getItem('user');
let parsedUser = null;
try {
  if (userStr && userStr !== 'undefined') parsedUser = JSON.parse(userStr);
} catch (e) { parsedUser = null; }

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: parsedUser,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
  },
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.isLoading = true; state.isError = false; })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(register.pending, (state) => { state.isLoading = true; state.isError = false; })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isSuccess = false;
        localStorage.removeItem('user');
      })
      .addCase(logout.rejected, (state) => {
        state.user = null;
        state.isSuccess = false;
        state.isError = false;
        localStorage.removeItem('user');
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
