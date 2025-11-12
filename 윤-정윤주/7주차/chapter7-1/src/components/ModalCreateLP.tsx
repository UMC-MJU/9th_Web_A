import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

type ModalCreateLPProps = {
  onClose: () => void;
};

const ModalCreateLP = ({ onClose }: ModalCreateLPProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // 🔹 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // 🔹 파일 업로드 미리보기
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-40">
      <div
        ref={modalRef}
        className="bg-[#1C1F26] p-8 rounded-2xl w-[90%] max-w-md shadow-xl relative text-white"
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
        >
          <X size={22} />
        </button>

        {/* LP 이미지 영역 */}
        <div className="flex justify-center mb-5 relative">
          <label className="relative cursor-pointer block w-52 h-52">
            {/* LP 디스크는 항상 표시 - 오른쪽으로 더 이동 */}
            <img
              src="/images/vinyl.png"
              alt="Default LP"
              className="absolute -right-4 top-1/2 -translate-y-1/2 w-36 h-36 object-contain"
            />
            {/* 업로드한 이미지는 LP 앞에 오버레이 - 왼쪽 정렬 */}
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-40 h-40 object-cover rounded-md shadow-lg z-10"
              />
            ) : (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-40 h-40 bg-gray-700/30 rounded-md border-2 border-dashed border-gray-500 flex items-center justify-center text-gray-500 text-xs">
                Click to upload
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        {/* 입력 폼 */}
        <form className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="LP Name"
            className="bg-[#0B0E13] border border-gray-600 rounded-lg p-2 focus:outline-none focus:border-pink-500"
          />
          <input
            type="text"
            placeholder="LP Content"
            className="bg-[#0B0E13] border border-gray-600 rounded-lg p-2 focus:outline-none focus:border-pink-500"
          />

          {/* 태그 입력 */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="LP Tag"
              className="flex-1 bg-[#0B0E13] border border-gray-600 rounded-lg p-2 focus:outline-none focus:border-pink-500"
            />
            <button
              type="button"
              className="bg-gray-500 hover:bg-gray-600 text-white rounded-lg px-3 transition"
            >
              Add
            </button>
          </div>

          {/* 등록 버튼 */}
          <button
            type="submit"
            className="bg-pink-600 hover:bg-pink-700 py-2 rounded-lg mt-2 transition font-medium"
          >
            Add LP
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalCreateLP;
