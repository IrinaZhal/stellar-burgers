import { getFeedsApi, getOrderByNumberApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient, TOrder } from '@utils-types';

type TOrdersState = {
  orderModalNumber: string;
  userOrders: TOrder[];
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoadingAllOrders: boolean;
  isLoadingUserOrders: boolean;
};

const initialState: TOrdersState = {
  orderModalNumber: '',
  userOrders: [],
  orders: [],
  total: 0,
  totalToday: 0,
  isLoadingAllOrders: false,
  isLoadingUserOrders: false
};

export const fetchFeeds = createAsyncThunk('orders/fetchFeeds', async () => {
  const feed = await getFeedsApi();
  return feed;
});

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchOrderData',
  async (api: number) => {
    const orderData = await getOrderByNumberApi(api);
    return orderData;
  }
);

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrderModalNumber: (state, action: PayloadAction<string>) => {
      state.orderModalNumber = action.payload;
    }
  },
  selectors: {
    getAllOrders: (state) => state.orders,
    getTotal: (state) => state.total,
    getTotalToday: (state) => state.totalToday,
    getUserOrders: (state) => state.userOrders,
    getOrderModalNumber: (state) => state.orderModalNumber
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoadingAllOrders = true;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoadingAllOrders = false;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoadingAllOrders = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoadingUserOrders = true;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoadingUserOrders = false;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoadingUserOrders = false;
        state.userOrders = action.payload.orders;
      });
  }
});

export const {
  getAllOrders,
  getTotal,
  getTotalToday,
  getUserOrders,
  getOrderModalNumber
} = ordersSlice.selectors;
export const { setOrderModalNumber } = ordersSlice.actions;
export default ordersSlice.reducer;
