import { describe, expect, test } from '@jest/globals';
import { rootReducer } from './store';
import { initialState as ingredientsInitial } from './ingredientsSlice';
import { initialState as constructorInitial } from './constructorSlice';
import { initialState as ordersInitial } from './ordersSlice';
import { initialState as userInitial } from './userSlice';

describe('rootReducer', () => {
  test('должен возвращать корректный initial state', () => {
    const state = rootReducer(undefined, { type: '@@INIT' });

    expect(state).toEqual({
      ingredients: ingredientsInitial,
      constructorBurger: constructorInitial,
      orders: ordersInitial,
      user: userInitial
    });
  });
});
