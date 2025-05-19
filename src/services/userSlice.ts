import {
  fetchWithRefresh,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TRegisterData
} from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { deleteCookie, getCookie, setCookie } from '../utils/cookie';
import { TUser } from '@utils-types';

type TUserState = {
  isAuthChecked: boolean; // флаг для статуса проверки токена пользователя
  isAuthenticated: boolean;
  userData: TUser | null;
  loginUserError: unknown | null;
  loginUserRequest: boolean;
  isLoading: boolean;
};

const initialState: TUserState = {
  isAuthChecked: false, // флаг для статуса проверки токена пользователя
  isAuthenticated: false,
  userData: null,
  loginUserError: null,
  loginUserRequest: false,
  isLoading: false
};

export const getUser = createAsyncThunk('user/getUser', async (_, thunkAPI) => {
  try {
    const res = await getUserApi();
    return res.user;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const checkUserAuth = createAsyncThunk(
  'user/checkUser',
  (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      dispatch(getUser()).finally(() => {
        dispatch(authChecked());
      });
    } else {
      dispatch(authChecked());
    }
  }
);

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (data: TRegisterData, thunkAPI) => {
    try {
      const res = await registerUserApi(data);
      setCookie('accessToken', res.accessToken);
      localStorage.setItem('refreshToken', res.refreshToken);
      return res.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ email, password }: Omit<TRegisterData, 'name'>, thunkAPI) => {
    try {
      const res = await loginUserApi({ email, password });
      setCookie('accessToken', res.accessToken);
      localStorage.setItem('refreshToken', res.refreshToken);
      return res.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  (_, { dispatch }) => {
    logoutApi()
      .then(() => {
        localStorage.clear(); // очищаем refreshToken
        deleteCookie('accessToken'); // очищаем accessToken
        dispatch(userLogout()); // удаляем пользователя из хранилища
      })
      .catch(() => {
        console.log('Ошибка выполнения выхода');
      });
  }
);
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authChecked: (state) => {
      state.isAuthChecked = true;
    },
    userLogout: (state) => {
      state.userData = null;
    }
  },
  selectors: {
    isAuthCheckedSelector: (state) => state.isAuthChecked,
    getUserData: (state) => state.userData,
    authenticatedSelector: (state) => state.isAuthenticated
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userData = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.pending, (state) => {
        state.loginUserRequest = true;
        state.loginUserError = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.loginUserError = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.userData = action.payload;
        state.loginUserRequest = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.userData = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(getUser.rejected, (state) => {
        state.userData = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.isAuthenticated = false;
        state.isAuthChecked = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.userData = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
      });
  }
});

export const { authChecked, userLogout } = userSlice.actions;
export const { isAuthCheckedSelector, getUserData, authenticatedSelector } =
  userSlice.selectors;
export default userSlice.reducer;
