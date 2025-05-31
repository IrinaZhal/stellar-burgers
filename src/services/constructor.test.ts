import { expect, test, describe } from '@jest/globals';
import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  TConstructorState
} from './constructorSlice';
import { initialState } from './constructorSlice';
import { TConstructorIngredient, TIngredient } from '@utils-types';

const mockAddIngredient: TIngredient = {
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
};

const mockIngredients: Array<TConstructorIngredient> = [
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
    _id: '643d69a5c3f7b9001cfa0941',
    id: '1'
  },
  {
    calories: 30,
    carbohydrates: 40,
    fat: 20,
    image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
    name: 'Соус Spicy-X',
    price: 90,
    proteins: 30,
    type: 'sauce',
    _id: '643d69a5c3f7b9001cfa0942',
    id: '2'
  }
];

const sortedIngredients: Array<TConstructorIngredient> = [
  {
    calories: 30,
    carbohydrates: 40,
    fat: 20,
    image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
    name: 'Соус Spicy-X',
    price: 90,
    proteins: 30,
    type: 'sauce',
    _id: '643d69a5c3f7b9001cfa0942',
    id: '2'
  },
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
    _id: '643d69a5c3f7b9001cfa0941',
    id: '1'
  }
];

describe('Тесты actions в конструкторе бургеров', () => {
  test('добавить ингредиент', () => {
    const newState = constructorReducer(
      initialState,
      addIngredient(mockAddIngredient)
    );

    const { ingredients } = newState;

    expect(ingredients.length).toBe(1);
    const { id, ...ingredientWithoutId } = ingredients[0];
    expect(typeof id).toBe('string');
    expect(ingredientWithoutId).toEqual(mockAddIngredient);
  });

  test('убрать ингредиент', () => {
    const stateWithAdded = constructorReducer(
      initialState,
      addIngredient(mockAddIngredient)
    );
    const addedId = stateWithAdded.ingredients[0].id;

    const newState = constructorReducer(
      stateWithAdded,
      removeIngredient(addedId)
    );

    expect(newState.ingredients).toHaveLength(0);
  });

  test('передвинуть ингредиент', () => {
    const stateWithIngredients: TConstructorState = {
      ingredients: [...mockIngredients],
      bun: null
    };

    const newState = constructorReducer(
      stateWithIngredients,
      moveIngredient({ from: 0, to: 1 })
    );

    const { ingredients } = newState;

    expect(ingredients).toEqual(sortedIngredients);
  });
});
