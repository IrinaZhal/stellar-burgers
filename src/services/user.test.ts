import { expect, test, describe } from '@jest/globals';
import userReducer, {
  initialState,
  getUser,
  checkUserAuth,
  registerUser,
  loginUser,
  logoutUser,
  changeUserData,
  getOrders
} from './userSlice';
import { TLoginData, TRegisterData } from '@api';
import { TOrder, TUser } from '@utils-types';

const mockRegisterData: TRegisterData = {
  email: 'test@example.com',
  name: 'Test User',
  password: 'qwerty123'
};

const mockUserData: TUser = {
  email: 'test@example.com',
  name: 'Test User'
};

const mockLoginData: TLoginData = {
  email: 'test@example.com',
  password: 'qwerty123'
};

const mockUpdatedUser = {
  email: 'new@example.com',
  name: 'New Name'
};

const mockOrders: TOrder[] = [
  {
    _id: 'abc123',
    status: 'done',
    name: 'Мок-бургер',
    createdAt: '2025-05-30T12:00:00.000Z',
    updatedAt: '2025-05-30T12:01:00.000Z',
    number: 98765,
    ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa093e']
  }
];

describe('Тесты userReducer', () => {
  test('registerUser.pending ставит isLoading = true', () => {
    const newState = userReducer(
      initialState,
      registerUser.pending('', mockRegisterData)
    );
    expect(newState.isLoading).toBe(true);
  });

  test('registerUser.fulfilled сохраняет userData, ставит isAuthChecked = true, isAuthenticated = true и isLoading = false', () => {
    const newState = userReducer(
      { ...initialState, isLoading: true },
      registerUser.fulfilled(mockUserData, '', mockRegisterData)
    );
    expect(newState.isLoading).toBe(false);
    expect(newState.userData).toEqual(mockUserData);
    expect(newState.isAuthenticated).toBe(true);
    expect(newState.isAuthChecked).toBe(true);
  });

  test('registerUser.rejected ставит isLoading = false', () => {
    const newState = userReducer(
      { ...initialState, isLoading: true },
      registerUser.rejected(null, '', mockRegisterData)
    );
    expect(newState.isLoading).toBe(false);
  });
  test('loginUser.pending ставит loginUserRequest = true, loginUserError = ""', () => {
    const newState = userReducer(
      initialState,
      loginUser.pending('', mockLoginData)
    );
    expect(newState.loginUserRequest).toBe(true);
    expect(newState.loginUserError).toBe('');
  });

  test('loginUser.fulfilled сохраняет userData, authenticated = true, isAuthChecked = true, сбрасывает loginUserRequest и loginUserError', () => {
    const newState = userReducer(
      { ...initialState, loginUserRequest: true, loginUserError: 'Ошибка' },
      loginUser.fulfilled(mockUserData, '', mockLoginData)
    );
    expect(newState.userData).toEqual(mockUserData);
    expect(newState.loginUserRequest).toBe(false);
    expect(newState.isAuthenticated).toBe(true);
    expect(newState.isAuthChecked).toBe(true);
    expect(newState.loginUserError).toBe('');
  });

  test('loginUser.rejected ставит loginUserRequest = false, isAuthChecked = true, и loginUserError = "Неверный e-mail или пароль"', () => {
    const newState = userReducer(
      { ...initialState, loginUserRequest: true },
      loginUser.rejected(null, '', mockLoginData)
    );
    expect(newState.loginUserRequest).toBe(false);
    expect(newState.isAuthChecked).toBe(true);
    expect(newState.loginUserError).toBe('Неверный e-mail или пароль');
  });
  test('getUser.fulfilled сохраняет userData, isAuthenticated = true, isAuthChecked = true', () => {
    const newState = userReducer(
      initialState,
      getUser.fulfilled(mockUserData, '')
    );
    expect(newState.userData).toEqual(mockUserData);
    expect(newState.isAuthenticated).toBe(true);
    expect(newState.isAuthChecked).toBe(true);
  });

  test('getUser.rejected очищает userData, isAuthenticated = false, isAuthChecked = true', () => {
    const newState = userReducer(
      initialState,
      getUser.rejected(null, '', undefined)
    );
    expect(newState.userData).toBeNull();
    expect(newState.isAuthenticated).toBe(false);
    expect(newState.isAuthChecked).toBe(true);
  });
  test('checkUserAuth.fulfilled: isAuthenticated и isAuthChecked = true', () => {
    const newState = userReducer(
      initialState,
      checkUserAuth.fulfilled(undefined, '')
    );
    expect(newState.isAuthenticated).toBe(true);
    expect(newState.isAuthChecked).toBe(true);
  });

  test('checkUserAuth.rejected: isAuthenticated = false, isAuthChecked = true', () => {
    const newState = userReducer(
      initialState,
      checkUserAuth.rejected(null, '')
    );
    expect(newState.isAuthenticated).toBe(false);
    expect(newState.isAuthChecked).toBe(true);
  });
  test('logoutUser.fulfilled сбрасывает userData и устанавливает флаги', () => {
    const newState = userReducer(
      initialState,
      logoutUser.fulfilled(undefined, '')
    );
    expect(newState.isLoading).toBe(false);
    expect(newState.userData).toBeNull();
    expect(newState.isAuthenticated).toBe(false);
    expect(newState.isAuthChecked).toBe(true);
  });
  test('changeUserData.pending устанавливает isLoading = true', () => {
    const newState = userReducer(initialState, changeUserData.pending('', {}));
    expect(newState.isLoading).toBe(true);
  });

  test('changeUserData.rejected устанавливает isLoading = false', () => {
    const newState = userReducer(
      initialState,
      changeUserData.rejected(null, '', {})
    );
    expect(newState.isLoading).toBe(false);
  });

  test('changeUserData.fulfilled обновляет userData и устанавливает isLoading = false', () => {
    const prevState = {
      ...initialState,
      userData: {
        email: 'old@example.com',
        name: 'Old Name'
      }
    };

    const newState = userReducer(
      prevState,
      changeUserData.fulfilled(mockUpdatedUser, '', {})
    );
    expect(newState.isLoading).toBe(false);
    expect(newState.userData).toEqual(mockUpdatedUser);
  });
  test('getOrders.pending устанавливает ordersLoading = true', () => {
    const newState = userReducer(initialState, getOrders.pending(''));
    expect(newState.ordersLoading).toBe(true);
  });

  test('getOrders.fulfilled обновляет userOrders и устанавливает ordersLoading = false', () => {
    const newState = userReducer(
      initialState,
      getOrders.fulfilled(mockOrders, '')
    );
    expect(newState.ordersLoading).toBe(false);
    expect(newState.userOrders).toEqual(mockOrders);
  });

  test('getOrders.fulfilled с пустым payload устанавливает пустой массив и ordersLoading = false', () => {
    const newState = userReducer(
      initialState,
      getOrders.fulfilled(undefined, '')
    );
    expect(newState.ordersLoading).toBe(false);
    expect(newState.userOrders).toEqual([]);
  });

  test('getOrders.rejected устанавливает ordersLoading = false', () => {
    const newState = userReducer(initialState, getOrders.rejected(null, ''));
    expect(newState.ordersLoading).toBe(false);
  });
});
