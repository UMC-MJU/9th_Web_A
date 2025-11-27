import { useCartStore } from "../hooks/useCartStore";
import { useModalStore } from "../hooks/useModalStore";

const PriceBox = () => {
  const { total } = useCartStore();
  const { open } = useModalStore();

  return (
    <div className="p-12 flex justify-between">
      <button onClick={open} className="border p-4 rounded-md cursor-pointer">
        장바구니 비우기
      </button>

      <div>총 가격: {total} 원</div>
    </div>
  );
};

export default PriceBox;
