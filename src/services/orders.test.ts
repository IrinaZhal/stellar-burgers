import { expect, test, describe } from '@jest/globals';
import orderReducer, {
  postOrder,
  fetchFeeds,
  fetchOrderbyNumber,
  initialState
} from './ordersSlice';
import { TFeedsResponse } from '@api';
import { TOrder } from '@utils-types';

const mockFetchFeedsResponse: TFeedsResponse = {
  orders: [
    {
      _id: '683a3990c2f30c001cb28c08',
      status: 'done',
      name: 'Краторный люминесцентный бургер',
      createdAt: '2025-05-30T23:04:48.240Z',
      updatedAt: '2025-05-30T23:04:49.122Z',
      number: 79558,
      ingredients: [
        '643d69a5c3f7b9001cfa093c',
        '643d69a5c3f7b9001cfa093e',
        '643d69a5c3f7b9001cfa093c'
      ]
    }
  ],
  total: 79184,
  totalToday: 81,
  success: true
};

const mockOrder: TOrder = {
  _id: 'abc123',
  status: 'done',
  name: 'Мок-бургер',
  createdAt: '2025-05-30T12:00:00.000Z',
  updatedAt: '2025-05-30T12:01:00.000Z',
  number: 98765,
  ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa093e']
};

const ingredientsMock = [
  '643d69a5c3f7b9001cfa093c',
  '643d69a5c3f7b9001cfa093e'
];

const mockOrderByNumber = {
  _id: '683a3990c2f30c001cb28c08',
  status: 'done',
  name: 'Ещё-бургер',
  createdAt: '2025-05-30T23:04:48.240Z',
  updatedAt: '2025-05-30T23:04:49.122Z',
  number: 79558,
  ingredients: [
    '643d69a5c3f7b9001cfa093c',
    '643d69a5c3f7b9001cfa093e',
    '643d69a5c3f7b9001cfa093c'
  ]
};

describe('Тесты IngredientsReducer', () => {
  test('fetchFeeds.pending устанавливает isLoadingAllOrders = true', () => {
    const newState = orderReducer(initialState, fetchFeeds.pending(''));
    expect(newState.isLoadingAllOrders).toBe(true);
    expect(newState.orders).toEqual([]);
  });
  test('fetchFeeds.rejected устанавливает isLoadingAllOrders = false', () => {
    const newState = orderReducer(initialState, fetchFeeds.rejected(null, ''));
    expect(newState.isLoadingAllOrders).toBe(false);
    expect(newState.orders).toEqual([]);
  });
  test('fetchFeeds.fulfilled устанавливает isLoadingAllOrders = false и обновляет ленту заказов', () => {
    const newState = orderReducer(
      initialState,
      fetchFeeds.fulfilled(mockFetchFeedsResponse, '')
    );
    expect(newState.isLoadingAllOrders).toBe(false);
    expect(newState.orders).toEqual(mockFetchFeedsResponse.orders);
    expect(newState.total).toEqual(mockFetchFeedsResponse.total);
    expect(newState.totalToday).toEqual(mockFetchFeedsResponse.totalToday);
  });
  test('postOrder.pending устанавливает orderRequest = true', () => {
    const state = orderReducer(
      initialState,
      postOrder.pending('request-id', ingredientsMock)
    );
    expect(state.orderRequest).toBe(true);
  });

  test('postOrder.fulfilled сохраняет orderModalData и сбрасывает orderRequest', () => {
    const state = orderReducer(
      initialState,
      postOrder.fulfilled(mockOrder, 'request-id', ingredientsMock)
    );
    expect(state.orderRequest).toBe(false);
    expect(state.orderModalData).toEqual(mockOrder);
  });

  test('postOrder.rejected сбрасывает orderRequest', () => {
    const state = orderReducer(
      initialState,
      postOrder.rejected(null, 'request-id', ingredientsMock)
    );
    expect(state.orderRequest).toBe(false);
  });
  test('fetchOrderbyNumber.pending ставит isOrderLoading = true', () => {
    const newState = orderReducer(
      initialState,
      fetchOrderbyNumber.pending('', 12345)
    );
    expect(newState.isOrderLoading).toBe(true);
  });

  test('fetchOrderbyNumber.rejected ставит isOrderLoading = false', () => {
    const loadingState = { ...initialState, isOrderLoading: true };
    const newState = orderReducer(
      loadingState,
      fetchOrderbyNumber.rejected(null, '', 12345)
    );
    expect(newState.isOrderLoading).toBe(false);
  });

  test('fetchOrderbyNumber.fulfilled ставит isOrderLoading = false и записывает заказ', () => {
    const newState = orderReducer(
      { ...initialState, isOrderLoading: true },
      fetchOrderbyNumber.fulfilled(mockOrderByNumber, '', 12345)
    );
    expect(newState.isOrderLoading).toBe(false);
    expect(newState.orderByNumber).toEqual(mockOrderByNumber);
  });
});
