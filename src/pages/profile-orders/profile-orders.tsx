import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  getOrders,
  getUserOrders,
  getUserOrdersLoading
} from '../../services/userSlice';
import { useDispatch } from '../../services/store';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const orders: TOrder[] = useSelector(getUserOrders);
  const ordersLoading = useSelector(getUserOrdersLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  if (ordersLoading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
