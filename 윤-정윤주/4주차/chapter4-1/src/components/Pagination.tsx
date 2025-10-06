import type { Dispatch, SetStateAction } from "react";

type PaginationProps = {
    page: number;
    // 숫자 상태(page)를 바꿀 수 있는 함수
    // 새 숫자를 직접 전달하거나 이전 상태를 이용해 업데이트 함수도 전달 가능
    setPage: Dispatch<SetStateAction<number>>;
};

export default function Pagination({ page, setPage }: PaginationProps) {
    return (
        <div className="flex items-center justify-center gap-6 mt-5">
            <button
            className="bg-[#b2dab1] text-white px-6 py-3 rounded-lg shadow-md
            hover:bg-[#97C39A] transition-all duration-200 disabled:bg-gray-300
            cursor-pointer disabled:cursor-not-allowed"
                disabled={page===1}  // 1페이지일 때는 이전 페이지 버튼 비활성화
                onClick={() => setPage((prev) => prev - 1)}
            >
                {`<`}
            </button>
            
            <span>{page} 페이지</span>

            <button
            className="bg-[#b2dab1] text-white px-6 py-3 rounded-lg shadow-md
            hover:bg-[#97C39A] transition-all duration-200 cursor-pointer"
                onClick={() => setPage((prev) => prev + 1)}
            >
                {`>`}
            </button>
        </div>
    );
}