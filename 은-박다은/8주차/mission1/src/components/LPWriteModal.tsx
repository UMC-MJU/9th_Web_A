import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLP } from "../apis/Ip";

interface LPWriteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LPWriteModal = ({ isOpen, onClose }: LPWriteModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // 이미지 미리보기
  const [preview, setPreview] = useState<string | null>(null);

  // 입력값들
  const [lpName, setLpName] = useState("");
  const [lpContent, setLpContent] = useState("");

  // 태그 관련 상태
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const qc = useQueryClient();

  // 바깥 클릭 → 모달 닫기
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

    setPreview(URL.createObjectURL(file));
  };

  // 태그 추가
  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    if (tags.includes(tagInput.trim())) return; // 중복 방지
    setTags((prev) => [...prev, tagInput.trim()]);
    setTagInput("");
  };

  // 태그 삭제
  const handleRemoveTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  // LP 생성 mutation
  const mutation = useMutation({
    mutationFn: createLP,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lpList"] }); // 목록 새로고침
      onClose(); // 모달 닫기

      // 입력값 초기화
      setLpName("");
      setLpContent("");
      setTagInput("");
      setTags([]);
      setPreview(null);
    },
  });

  // "Add LP" 클릭
  const handleSubmit = () => {
    if (!lpName.trim() || !lpContent.trim()) return;

    const body = {
      title: lpName,
      content: lpContent,
      thumbnail: "", // 지금은 URL 없는 버전이므로 빈 값
      tags: tags,
      published: true,
    };

    mutation.mutate(body);
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
        w-[380px] bg-[#1a1a1a] rounded-xl p-10 relative 
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
          {/* LP 이미지 */}
          <img
            src="/lp.png"
            className={`w-full h-full object-cover rounded-full transition-transform
              ${preview ? "translate-x-8" : ""}
            `}
            alt="LP background"
          />

          {/* 업로드 이미지 */}
          {preview && (
            <img
              src={preview}
              className="
                absolute top-1/2 right-10
                -translate-y-1/2
                w-40 h-40 object-cover shadow-xl
              "
              alt="Uploaded"
            />
          )}

          <label className="absolute inset-0 cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
        </div>

        {/* LP Name */}
        <input
          value={lpName}
          onChange={(e) => setLpName(e.target.value)}
          placeholder="LP Name"
          className="w-full bg-[#1f1f1f] text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-pink-500 outline-none"
        />

        {/* LP Content */}
        <input
          value={lpContent}
          onChange={(e) => setLpContent(e.target.value)}
          placeholder="LP Content"
          className="w-full bg-[#1f1f1f] text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-pink-500 outline-none"
        />

        {/* Tag 입력 */}
        <div className="flex gap-2">
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="LP Tag"
            className="flex-1 bg-[#1f1f1f] text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-pink-500 outline-none"
          />
          <button
            onClick={handleAddTag}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 rounded-lg transition"
          >
            Add
          </button>
        </div>

        {/* 태그 리스트 */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <div
              key={tag}
              className="bg-[#333] text-white px-3 py-1 rounded-lg flex items-center gap-2"
            >
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="text-gray-400 hover:text-red-400"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {/* LP 생성 버튼 */}
        <button
          onClick={handleSubmit}
          disabled={mutation.isPending}
          className="w-full mt-2 bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg transition active:scale-95"
        >
          {mutation.isPending ? "Uploading..." : "Add LP"}
        </button>
      </div>
    </div>
  );
};

export default LPWriteModal;
