import { useContext, useState } from "react";
import OrderContext from "../components/OrderContext";

export default function usePizza({ pizzas, inputs }) {
  const [order, setOrder] = useContext(OrderContext);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function addToOrder(orderedPizza) {
    setOrder([...order, orderedPizza]);
  }

  function removeFromOrder(index) {
    setOrder([...order.slice(0, index), ...order.slice(index + 1)]);
  }

  // TODO - Send data to serverless function on checkout

  return {
    order,
    addToOrder,
    removeFromOrder,
    error,
    loading,
    message
  };
}
