import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearConstructor,
  getBun,
  getBurgerIngredients
} from '../../services/constructorSlice';
import {
  getOrderModalData,
  getOrderRequest,
  postOrder
} from '../../services/ordersSlice';
import { useNavigate } from 'react-router-dom';
import { authenticatedSelector } from '../../services/userSlice';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(authenticatedSelector);

  const bun = useSelector(getBun);
  const burgerIngredients = useSelector(getBurgerIngredients);

  const constructorItems = {
    bun: bun,
    ingredients: burgerIngredients
  };

  const orderRequest = useSelector(getOrderRequest);

  const orderModalData = useSelector(getOrderModalData);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const burderIngredientsId = constructorItems.ingredients.map(
      (item) => item._id
    );

    const order = [
      constructorItems.bun?._id,
      ...burderIngredientsId,
      constructorItems.bun?._id
    ];

    dispatch(postOrder(order));
    dispatch(clearConstructor());
  };

  const closeOrderModal = () => {
    navigate(-1);
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
