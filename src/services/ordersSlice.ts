import { getFeedsApi, getOrderByNumberApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient, TOrder } from '@utils-types';

type TOrdersState = {
  orderModalNumber: string;
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoadingAllOrders: boolean;
};

const initialState: TOrdersState = {
  orderModalNumber: '',
  orders: [],
  total: 0,
  totalToday: 0,
  isLoadingAllOrders: false
};

export const fetchFeeds = createAsyncThunk('orders/fetchFeeds', async () => {
  const feed = await getFeedsApi();
  return feed;
});

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
    getOrderModalNumber: (state) => state.orderModalNumber,
    getLoadingOrdersStatus: (state) => state.isLoadingAllOrders
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
      });
  }
});

export const {
  getAllOrders,
  getTotal,
  getTotalToday,
  getOrderModalNumber,
  getLoadingOrdersStatus
} = ordersSlice.selectors;
export const { setOrderModalNumber } = ordersSlice.actions;
export default ordersSlice.reducer;
