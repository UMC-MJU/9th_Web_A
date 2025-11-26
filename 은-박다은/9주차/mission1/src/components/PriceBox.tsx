import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../slices/cartSlice";
import type { RootState } from "../store/store";

const PriceBox = () => {
  const { total } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();

  const handleInitializeCart = () => {
    dispatch(clearCart());
  };

  return (
    <div className="p-12 flex justify-between">
      <div>
        <button
          onClick={handleInitializeCart}
          className="border p-4 rounded-tr-md cursor-pointer"
        >
          장바구니 초기화
        </button>
      </div>
      <div>총 가격: {total} 원</div>
    </div>
  );
};

export default PriceBox;
