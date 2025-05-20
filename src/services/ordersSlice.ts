import {
  getFeedsApi,
  getOrderByNumberApi,
  orderBurgerApi,
  TNewOrderResponse
} from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient, TOrder } from '@utils-types';

type TOrdersState = {
  orderModalNumber: string;
  orderModalInfo: boolean;
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoadingAllOrders: boolean;
  orderRequest: boolean;
  orderModalData: TOrder | null;
};

const initialState: TOrdersState = {
  orderModalNumber: '',
  orderModalInfo: false,
  orders: [],
  total: 0,
  totalToday: 0,
  isLoadingAllOrders: false,
  orderRequest: false,
  orderModalData: null
};

export const postOrder = createAsyncThunk(
  'orders/postOrder',
  async (data: string[]) => {
    try {
      const res = await orderBurgerApi(data);
      return res.order;
    } catch (error) {
      console.log('Ошибка отправки заказа');
    }
  }
);

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
    getLoadingOrdersStatus: (state) => state.isLoadingAllOrders,
    getOrderRequest: (state) => state.orderRequest,
    getOrderModalData: (state) => state.orderModalData,
    getOrderModalInfo: (state) => state.orderModalInfo
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
      .addCase(postOrder.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(postOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload ?? null;
      })
      .addCase(postOrder.rejected, (state, action) => {
        state.orderRequest = false;
      });
  }
});

export const {
  getAllOrders,
  getTotal,
  getTotalToday,
  getOrderModalNumber,
  getLoadingOrdersStatus,
  getOrderRequest,
  getOrderModalData
} = ordersSlice.selectors;
export const { setOrderModalNumber } = ordersSlice.actions;
export default ordersSlice.reducer;
