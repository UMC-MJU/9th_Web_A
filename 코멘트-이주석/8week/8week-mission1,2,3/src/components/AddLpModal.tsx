import { useState, useRef } from "react";
import { X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../apis/axios";

type AddLpModalProps = {
  onClose: () => void;
};

export const AddLpModal = ({ onClose }: AddLpModalProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [thumbnailUrl, setThumbnailUrl] = useState("/LP.png"); // 기본 LP.png
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const queryClient = useQueryClient();

  // ✅ LP 생성 mutation (JSON 형식)
  const createLpMutation = useMutation({
    mutationFn: async (payload: {
      title: string;
      content: string;
      thumbnail: string;
      tags: string[];
      published: boolean;
    }) => {
      const { data } = await axiosInstance.post("/v1/lps", payload, {
        headers: { "Content-Type": "application/json" },
      });
      return data;
    },
    onSuccess: () => {
      alert("LP가 성공적으로 등록되었습니다!");
      queryClient.invalidateQueries({ queryKey: ["lps"] });
      onClose();
    },
    onError: (error) => {
      console.error("LP 등록 실패:", error);
      alert("LP 등록 중 오류가 발생했습니다.");
    },
  });

  /** ✅ 태그 추가 */
  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    if (tags.includes(tagInput.trim())) return;
    setTags([...tags, tagInput.trim()]);
    setTagInput("");
  };

  /** ✅ 태그 삭제 */
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  /** ✅ LP 등록 요청 */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content) {
      alert("제목과 내용을 입력해주세요!");
      return;
    }

    const payload = {
      title,
      content,
      tags,
      thumbnail: thumbnailUrl,
      published: true,
    };

    createLpMutation.mutate(payload);
  };

  /** ✅ 썸네일 파일 업로드 (URL 미리보기만) */
  const handleThumbnailClick = () => fileInputRef.current?.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setLocalPreview(preview);
      setThumbnailUrl(preview); // 실제 업로드는 안 하지만 임시 표시
    }
  };

  const previewUrl = localPreview;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex justify-center items-center z-[100]"
      onClick={onClose}
    >
      <div
        className="bg-[#2a2a2a] text-white rounded-2xl p-8 w-[400px] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          <X size={22} />
        </button>

        {/* LP 썸네일 영역 */}
        <div className="flex justify-center mb-4">
          <div
            onClick={handleThumbnailClick}
            className="cursor-pointer relative w-48 h-48 rounded-lg overflow-hidden flex items-center justify-center"
          >
            {/* 업로드 전 */}
            {!previewUrl && (
              <img
                src="/LP.png"
                alt="LP Disk"
                className="w-44 h-44 object-contain"
              />
            )}
            {/* 업로드 후 */}
            {previewUrl && (
              <>
                <img
                  src={previewUrl}
                  alt="Uploaded thumbnail"
                  className="absolute top-0 left-0 w-[65%] h-full object-cover"
                />
                <img
                  src="/LP.png"
                  alt="LP Disk"
                  className="absolute top-0 right-[-15%] w-[70%] h-full object-contain pointer-events-none"
                />
              </>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* 입력 폼 */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="LP Name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-[#1e1e1e] p-2 rounded-md outline-none"
          />
          <input
            type="text"
            placeholder="LP Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="bg-[#1e1e1e] p-2 rounded-md outline-none"
          />

          {/* 태그 입력 */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="LP Tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="flex-1 bg-[#1e1e1e] p-2 rounded-md outline-none"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="bg-gray-500 hover:bg-gray-600 px-4 rounded-md transition"
            >
              Add
            </button>
          </div>

          {/* 추가된 태그 표시 */}
          <div className="flex flex-wrap gap-2 mt-1">
            {tags.map((tag) => (
              <div
                key={tag}
                className="flex items-center gap-1 bg-gray-700 px-2 py-1 rounded-md text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 text-gray-300 hover:text-white"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={createLpMutation.isPending}
            className="mt-4 bg-pink-500 hover:bg-pink-600 py-2 rounded-md transition disabled:opacity-60"
          >
            {createLpMutation.isPending ? "등록 중..." : "Add LP"}
          </button>
        </form>
      </div>
    </div>
  );
};
