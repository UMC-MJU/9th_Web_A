import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useCreateLp } from "../hooks/mutations/useCreateLp";

type ModalCreateLPProps = {
  open: boolean;
  onClose: () => void;
};

const ModalCreateLP = ({ open, onClose }: ModalCreateLPProps) => {
  if (!open) return null;
  const modalRef = useRef<HTMLDivElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const [name, setName] = useState("");
  const [content, setContent] = useState("");

  // 태그 상태
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // 이미지 파일 선택
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const createLpMutation = useCreateLp(onClose);

  // LP 등록
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return alert("LP Name is required!");
    if (!content.trim()) return alert("LP Content is required!");
    if (!file) return alert("Please select an image file!");

    createLpMutation.mutate({
      title: name.trim(),
      content: content.trim(),
      tags,
      file,
    });
  };


  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-40">
      <div
        ref={modalRef}
        className="bg-[#1C1F26] p-8 rounded-2xl w-[90%] max-w-md shadow-xl relative text-white"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
        >
          <X size={22} />
        </button>

        {/* LP 이미지 미리보기 */}
        <div className="flex justify-center mb-5 relative">
          <label className="relative cursor-pointer block w-52 h-52">
            <img
              src="/images/vinyl.png"
              alt="Default LP"
              className={`absolute top-1/2 -translate-y-1/2 w-36 h-36 object-contain transition-all duration-300 ${
                preview ? "-right-4" : "left-1/2 -translate-x-1/2"
              }`}
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-40 h-40 object-cover rounded-md shadow-lg z-10"
              />
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
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="LP Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-[#0B0E13] border border-gray-600 rounded-lg p-2 focus:outline-none focus:border-pink-500"
          />
          <input
            type="text"
            placeholder="LP Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="bg-[#0B0E13] border border-gray-600 rounded-lg p-2 focus:outline-none focus:border-pink-500"
          />

          {/* 태그 입력 */}
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="LP Tag"
                className="flex-1 bg-[#0B0E13] border border-gray-600 rounded-lg p-2 focus:outline-none focus:border-pink-500"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <button
                type="button"
                className="bg-gray-500 hover:bg-gray-600 text-white rounded-lg px-3 transition"
                onClick={handleAddTag}
              >
                Add
              </button>
            </div>

            <div className="flex gap-2 flex-wrap">
              {tags.map((tag) => (
                <div
                  key={tag}
                  className="flex items-center gap-1 bg-gray-700 px-3 py-1 rounded-lg text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-gray-300 hover:text-white ml-1"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={createLpMutation.isPending}
            className="bg-pink-600 hover:bg-pink-700 py-2 rounded-lg mt-2 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createLpMutation.isPending ? "Adding..." : "Add LP"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalCreateLP;
