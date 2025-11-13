// src/components/MyPage/EditProfileModal.tsx
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Camera, Upload } from "lucide-react";
import { axiosInstance } from "../../apis/axios";

interface EditProfileModalProps {
  currentName: string;
  currentBio: string | null;
  currentAvatar: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

const EditProfileModal = ({
  currentName,
  currentBio,
  currentAvatar,
  onClose,
  onSuccess,
}: EditProfileModalProps) => {
  const [name, setName] = useState(currentName);
  const [bio, setBio] = useState(currentBio ?? "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(currentAvatar ?? "");
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();

  // 이미지 파일을 서버에 업로드하고 URL 받기
  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      // 이미지 업로드 엔드포인트 (실제 엔드포인트로 변경 필요)
      const { data } = await axiosInstance.post("/v1/upload/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      // 서버에서 반환한 이미지 URL
      return data.data.url || data.data.imageUrl || data.url;
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      throw new Error("이미지 업로드에 실패했습니다.");
    }
  };

  const updateMutation = useMutation({
    mutationFn: async () => {
      setIsUploading(true);
      
      const payload: any = {
        name: name.trim(),
      };
      
      if (bio.trim()) {
        payload.bio = bio.trim();
      }
      
      // 새 이미지 파일이 있으면 업로드 후 URL 받기
      if (avatarFile) {
        try {
          const uploadedUrl = await uploadImage(avatarFile);
          payload.avatar = uploadedUrl;
        } catch (error) {
          setIsUploading(false);
          throw error;
        }
      } else if (previewUrl && previewUrl !== currentAvatar) {
        // URL이 변경된 경우 (기존과 다른 경우)
        payload.avatar = previewUrl;
      }

      console.log("📤 전송할 데이터:", payload);

      const { data } = await axiosInstance.patch("/v1/users", payload);
      setIsUploading(false);
      return data;
    },
    onSuccess: async (responseData) => {
      console.log("✅ 서버 응답:", responseData);
      queryClient.invalidateQueries({ queryKey: ["myInfo"] });
      
      // 부모 컴포넌트의 데이터 갱신
      await onSuccess();
      
      // Navbar 강제 새로고침을 위한 이벤트 발생
      window.dispatchEvent(new Event("profileUpdated"));
      
      alert("프로필이 성공적으로 업데이트되었습니다!");
      onClose();
    },
    onError: (error: any) => {
      console.error("프로필 업데이트 실패:", error);
      setIsUploading(false);
      alert(error?.message || error?.response?.data?.message || "프로필 업데이트에 실패했습니다.");
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 파일 크기 체크 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("파일 크기는 5MB 이하여야 합니다.");
        return;
      }

      // 이미지 파일 타입 체크
      if (!file.type.startsWith("image/")) {
        alert("이미지 파일만 업로드 가능합니다.");
        return;
      }

      setAvatarFile(file);
      
      // 미리보기 URL 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert("이름은 필수입니다.");
      return;
    }

    updateMutation.mutate();
  };

  const isPending = updateMutation.isPending || isUploading;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-[#1a1d24] rounded-2xl p-6 w-full max-w-md text-white shadow-2xl">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">프로필 수정</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
            disabled={isPending}
          >
            <X size={24} />
          </button>
        </div>

        {/* 프로필 이미지 */}
        <div className="flex flex-col items-center mb-6">
          <label htmlFor="avatar-input" className="cursor-pointer group">
            <div className="relative">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="프로필 이미지"
                  className="w-32 h-32 rounded-full object-cover border-4 border-pink-500 group-hover:opacity-80 transition"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-pink-500 border-4 border-pink-500 flex items-center justify-center text-white text-4xl font-bold group-hover:opacity-80 transition">
                  {currentName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="absolute bottom-0 right-0 bg-pink-500 group-hover:bg-pink-600 rounded-full p-2 transition shadow-lg">
                <Camera size={20} />
              </div>
              {isPending && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                  <Upload className="animate-bounce text-white" size={24} />
                </div>
              )}
            </div>
          </label>
          <input
            id="avatar-input"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
            disabled={isPending}
          />
          <p className="text-sm text-gray-400 mt-2">
            {isPending ? "업로드 중..." : "클릭하여 이미지 변경"}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            JPG, PNG, GIF (최대 5MB)
          </p>
        </div>

        {/* 이름 입력 */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            이름 <span className="text-pink-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg p-3 bg-[#0f1117] text-white border border-gray-700 focus:border-pink-500 focus:outline-none transition"
            placeholder="이름을 입력하세요"
            disabled={isPending}
          />
        </div>

        {/* Bio 입력 */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Bio (선택)</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="w-full rounded-lg p-3 bg-[#0f1117] text-white border border-gray-700 focus:border-pink-500 focus:outline-none resize-none transition"
            placeholder="자기소개를 입력하세요"
            disabled={isPending}
          />
        </div>

        {/* 버튼 */}
        <div className="flex justify-end gap-3">
          <button
            className="px-5 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition disabled:opacity-50"
            onClick={onClose}
            disabled={isPending}
          >
            취소
          </button>
          <button
            className="px-5 py-2 bg-pink-500 rounded-lg hover:bg-pink-600 transition disabled:opacity-50 flex items-center gap-2"
            onClick={handleSave}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Upload className="animate-bounce" size={16} />
                <span>저장 중...</span>
              </>
            ) : (
              "저장"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;