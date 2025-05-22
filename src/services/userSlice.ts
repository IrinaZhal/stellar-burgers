import {
  fetchWithRefresh,
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { deleteCookie, getCookie, setCookie } from '../utils/cookie';
import { TOrder, TUser } from '@utils-types';

type TUserState = {
  isAuthChecked: boolean; // флаг для статуса проверки токена пользователя
  isAuthenticated: boolean;
  userData: TUser | null;
  loginUserError: string;
  loginUserRequest: boolean;
  isLoading: boolean;
  userOrders: TOrder[];
  ordersLoading: boolean;
};

const initialState: TUserState = {
  isAuthChecked: false, // флаг для статуса проверки токена пользователя
  isAuthenticated: false,
  userData: null,
  loginUserError: '',
  loginUserRequest: false,
  isLoading: false,
  userOrders: [],
  ordersLoading: false
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
  async (_, { dispatch }) => {
    try {
      const res = await logoutApi();
      localStorage.clear(); // очищаем refreshToken
      deleteCookie('accessToken'); // очищаем accessToken
      dispatch(userLogout()); // удаляем пользователя из хранилища
    } catch (error) {
      console.log('Ошибка выполнения выхода');
    }
  }
);

export const getOrders = createAsyncThunk('user/userOrders', async () => {
  try {
    const orders = await getOrdersApi();
    return orders;
  } catch (error) {
    console.log('Ошибка загрузки заказов');
  }
});

export const changeUserData = createAsyncThunk(
  'user/changeUserData',
  async (user: Partial<TRegisterData>, thunkAPI) => {
    try {
      const res = await updateUserApi(user);
      return res.user;
    } catch (error) {
      console.log('Ошибка редактирования профиля');
      return thunkAPI.rejectWithValue(error);
    }
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
    authenticatedSelector: (state) => state.isAuthenticated,
    getLoginUserError: (state) => state.loginUserError,
    getUserOrders: (state) => state.userOrders,
    getUserOrdersLoading: (state) => state.ordersLoading,
    checkLoading: (state) => state.isLoading
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
        state.loginUserError = '';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.loginUserError = 'Неверный e-mail или пароль';
        state.isAuthChecked = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.userData = action.payload;
        state.loginUserRequest = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.loginUserError = '';
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
      })
      .addCase(getOrders.pending, (state) => {
        state.ordersLoading = true;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.userOrders = action.payload ?? [];
        state.ordersLoading = false;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.ordersLoading = false;
      })
      .addCase(changeUserData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changeUserData.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(changeUserData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userData = action.payload ?? state.userData;
      });
  }
});

export const { authChecked, userLogout } = userSlice.actions;
export const {
  isAuthCheckedSelector,
  getUserData,
  authenticatedSelector,
  getLoginUserError,
  getUserOrders,
  getUserOrdersLoading,
  checkLoading
} = userSlice.selectors;
export default userSlice.reducer;
