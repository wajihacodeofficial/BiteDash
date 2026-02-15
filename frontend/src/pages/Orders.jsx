import { Navigate } from 'react-router-dom';

const Orders = () => {
  return <Navigate to="/dashboard/customer?tab=orders" replace />;
};

export default Orders;
