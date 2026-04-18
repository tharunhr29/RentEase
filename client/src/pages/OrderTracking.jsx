import { useEffect, useState } from "react";
import axios from "axios";
import OrderTimeline from "../components/OrderTimeline";
import { useParams } from "react-router-dom";

const OrderTracking = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const { data } = await axios.get(`/api/orders/${id}`);
      setOrder(data);
    };

    fetchOrder();
  }, [id]);

  if (!order) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">

      <h2 className="text-2xl font-bold mb-4">
        Order Tracking
      </h2>

      <OrderTimeline currentStatus={order.orderStatus} />

      <div className="mt-6 bg-white shadow p-4 rounded">

        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Status:</strong> {order.orderStatus}</p>
        <p><strong>Delivery Date:</strong> {new Date(order.deliveryDate).toDateString()}</p>
        <p><strong>Pickup Date:</strong> {new Date(order.pickupDate).toDateString()}</p>

      </div>

    </div>
  );
};

export default OrderTracking;