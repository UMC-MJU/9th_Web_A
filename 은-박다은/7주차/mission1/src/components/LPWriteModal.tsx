import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

interface LPWriteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LPWriteModal = ({ isOpen, onClose }: LPWriteModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // 바깥 클릭 닫기
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, onClose]);

  // 파일 업로드 처리
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageURL = URL.createObjectURL(file);
    setPreview(imageURL);
  };

  if (!isOpen) return null;

  return (
    <div
      className="
      fixed inset-0 z-50
      bg-black/70
      flex items-center justify-center
      "
    >
      <div
        ref={modalRef}
        className="
        w-[380px] bg-[#1a1a1a] rounded-xl p-12 relative 
        flex flex-col gap-4 shadow-2xl border border-gray-800
      "
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          <X size={26} />
        </button>

        {/* 이미지 컨테이너 (겹치기 구조) */}
        <div className="relative w-40 h-40 mx-auto">
          {/* LP 이미지 (항상 뒤에 있음) */}
          <img
            src="/lp.png"
            className={`
    w-full h-full object-cover rounded-full transition-transform
    ${preview ? "translate-x-8" : ""}
  `}
            alt="LP background"
          />

          {/* 업로드 이미지 (LP 위에 겹쳐짐 - 왼쪽 정렬) */}
          {preview && (
            <img
              src={preview}
              className="
        absolute top-1/2 right-10
        -translate-y-1/2
        w-40 h-40
        object-cover  shadow-xl
      "
              alt="Uploaded"
            />
          )}

          {/* 클릭 영역 (LP + 업로드 이미지 모두 클릭 가능) */}
          <label className="absolute inset-0 cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
        </div>

        {/* 입력 폼 */}
        <input
          placeholder="LP Name"
          className="w-full bg-[#1f1f1f] text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-pink-500 outline-none"
        />

        <input
          placeholder="LP Content"
          className="w-full bg-[#1f1f1f] text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-pink-500 outline-none"
        />

        {/* Tag 입력 */}
        <div className="flex gap-2">
          <input
            placeholder="LP Tag"
            className="flex-1 bg-[#1f1f1f] text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-pink-500 outline-none"
          />
          <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 rounded-lg transition">
            Add
          </button>
        </div>

        {/* LP 생성 버튼 */}
        <button className="w-full mt-2 bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg transition active:scale-95">
          Add LP
        </button>
      </div>
    </div>
  );
};

export default LPWriteModal;
