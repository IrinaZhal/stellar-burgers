import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchFeeds,
  getAllOrders,
  getLoadingOrdersStatus
} from '../../services/ordersSlice';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const loading = useSelector(getLoadingOrdersStatus);
  const orders: TOrder[] = useSelector(getAllOrders);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  if (!orders.length) {
    return <Preloader />;
  }

  if (loading) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(fetchFeeds());
      }}
    />
  );
};
