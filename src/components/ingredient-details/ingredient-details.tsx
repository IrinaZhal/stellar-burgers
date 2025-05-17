import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';

export const IngredientDetails: FC = () => {
  /** TODO: взять переменную из стора */
  const { id } = useParams<{ id: string }>();
  const ingredients = useSelector((state) => state.ingredients.ingredients);
  const searchId = id;
  function findIngredient() {
    const searchIngredient = ingredients.find(
      (ingredient) => ingredient._id === searchId
    );
    return searchIngredient;
  }

  const ingredientData = findIngredient();

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
