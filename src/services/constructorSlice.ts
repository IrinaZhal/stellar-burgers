import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { nanoid } from '@reduxjs/toolkit';

type TMoveParams = {
  from: number;
  to: number;
};

export type TConstructorState = {
  bun: TIngredient | null;
  ingredients: Array<TConstructorIngredient>;
};

export const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

const constructorSlice = createSlice({
  name: 'constructorBurger',
  initialState,
  reducers: {
    chooseBun: (state, action: PayloadAction<TIngredient>) => {
      state.bun = action.payload;
    },
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        state.ingredients.push(action.payload);
      },
      prepare: (ingredient: TIngredient) => {
        const id = nanoid();
        return { payload: { ...ingredient, id } };
      }
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (i) => i.id !== action.payload
      );
    },
    clearConstructor: (state) => {
      (state.bun = null), (state.ingredients = []);
    },
    moveIngredient: (state, action: PayloadAction<TMoveParams>) => {
      state.ingredients.splice(
        action.payload.to,
        0,
        state.ingredients.splice(action.payload.from, 1)[0]
      );
    }
  },
  selectors: {
    getBun: (state) => state.bun,
    getBurgerIngredients: (state) => state.ingredients
  }
});
export const { getBun, getBurgerIngredients } = constructorSlice.selectors;
export const {
  chooseBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = constructorSlice.actions;
export default constructorSlice.reducer;
