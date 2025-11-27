import { useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useCartStore } from "../hooks/useCartStore";

const Navbar = () => {
  const amount = useCartStore((state) => state.amount);
  const calculateTotals = useCartStore((state) => state.calculateTotals);
  const cartItems = useCartStore((state) => state.cartItems);

  useEffect(() => {
    calculateTotals();
  }, [cartItems, calculateTotals]);

  return (
    <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <h1
        onClick={() => {
          window.location.href = "/";
        }}
        className="text-2xl font-semibold cursor-pointer"
      >
        Ohthani Ahn
      </h1>
      <div className="flex items-center space-x-2">
        <FaShoppingCart className="text-2xl" />
        <span className="text-xl font-medium">{amount}</span>
      </div>
    </div>
  );
};

export default Navbar;
