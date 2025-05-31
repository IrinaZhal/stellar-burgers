import { expect, test, describe } from '@jest/globals';
import ingredientsReducer, {
  fetchIngredients,
  initialState
} from './ingredientsSlice';
import { TIngredient } from '@utils-types';

const mockAddIngredient: TIngredient[] = [
  {
    calories: 4242,
    carbohydrates: 242,
    fat: 142,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    name: 'Биокотлета из марсианской Магнолии',
    price: 424,
    proteins: 420,
    type: 'main',
    _id: '643d69a5c3f7b9001cfa0941'
  }
];

describe('Тесты IngredientsReducer', () => {
  test('fetchIngredients.pending устанавливает isLoading = true', () => {
    const newState = ingredientsReducer(
      initialState,
      fetchIngredients.pending('')
    );
    expect(newState.isLoading).toBe(true);
    expect(newState.ingredients).toEqual([]);
  });

  test('fetchIngredients.fulfilled устанавливает isLoading = false, ingredients = action.payload', () => {
    const newState = ingredientsReducer(
      initialState,
      fetchIngredients.fulfilled(mockAddIngredient, '')
    );
    expect(newState.isLoading).toBe(false);
    expect(newState.ingredients).toEqual(mockAddIngredient);
  });

  test('fetchIngredients.rejected устанавливает isLoading = false, ingredients остаются без изменений', () => {
    const newState = ingredientsReducer(
      initialState,
      fetchIngredients.rejected(null, '')
    );

    expect(newState.isLoading).toBe(false);
    expect(newState.ingredients).toEqual([]);
  });
});
