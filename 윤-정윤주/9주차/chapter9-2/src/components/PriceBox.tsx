import { useDispatch, useSelector } from "../hooks/useCustomRedux";
import { openModal } from "../slices/modalSlice";

const PriceBox = () => {
    const { total } = useSelector((state) => state.cart);
    const dispatch = useDispatch();

    const handleOpenModal = () => {
        dispatch(openModal());
    }

    return (
        <div className="p-12 flex justify-between">
            <button
                onClick={handleOpenModal} 
                className="border p-4 rounded-md cursor-pointer">장바구니 비우기</button>
            <div>총 가격: {total}\</div>
        </div>
    )
};

export default PriceBox;