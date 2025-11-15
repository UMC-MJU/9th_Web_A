import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../apis/axios";
import { getMyInfo } from "../apis/auth";
import type { ResponseMyInfoDto } from "../types/auth";
import { Settings, Check } from "lucide-react";

export const MyPage = () => {
  const [user, setUser] = useState<ResponseMyInfoDto["data"] | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ✅ 내 정보 불러오기
  useEffect(() => {
    const fetchData = async () => {
      const res = await getMyInfo();
      setUser(res.data);
      setName(res.data.name || "");
      setBio(res.data.bio || "");
      setPreview(res.data.avatar || null);
    };
    fetchData();
  }, []);

  const updateProfile = useMutation({
    mutationFn: async () => {
      const payload = {
        name,
        bio: bio || null, // bio는 선택사항이므로 null 허용
        avatar: preview || null, // avatar도 URL 기반으로 보낼 수 있음
      };

      const { data } = await axiosInstance.patch("/v1/users", payload, {
        headers: { "Content-Type": "application/json" },
      });

      return data;
    },
    onSuccess: (data) => {
      setIsEditing(false);

      if (data?.data) {
        setUser(data.data);
        setName(data.data.name || "");
        setBio(data.data.bio || "");
        setPreview(data.data.avatar || null);
      }
    },
    onError: () => {
      alert("프로필 수정 중 오류가 발생했습니다.");
    },
  });

  const handleSave = () => updateProfile.mutate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-black text-white pt-10">
      {/* 프로필 섹션 */}
      <div className="relative flex items-center justify-between w-[85%] max-w-5xl mb-8">
        {/* 왼쪽 - 프로필 사진 + 텍스트 */}
        <div className="flex items-center gap-8">
          {/* 프로필 이미지 */}
          <div
            onClick={() => isEditing && fileInputRef.current?.click()}
            className={`relative w-36 h-36 rounded-full overflow-hidden ${
              isEditing
                ? "border-4 border-pink-500 cursor-pointer"
                : "border-4 border-gray-700"
            }`}
          >
            {preview ? (
              <img
                src={preview}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src="/default-profile.png"
                alt="default avatar"
                className="w-full h-full object-cover opacity-90"
              />
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* 이름, bio, 이메일 */}
          <div className="flex flex-col gap-4">
            {isEditing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-transparent border border-pink-500 rounded-md px-3 py-1 text-xl font-semibold text-white outline-none"
              />
            ) : (
              <span className="text-2xl font-semibold">{user.name}</span>
            )}

            {isEditing ? (
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="소개를 입력하세요 (선택)"
                className="bg-transparent border border-pink-500 rounded-md px-3 py-1 text-sm text-gray-300 outline-none w-80"
              />
            ) : (
              <p className="text-gray-400 text-m">
                {user.bio || "소개가 없습니다."}
              </p>
            )}

            <p className="text-gray-400 text-m">{user.email}</p>
          </div>
        </div>

        {/* 오른쪽 상단 톱니바퀴 / 저장 버튼 */}
        <div className="absolute right-0 top-2">
          {isEditing ? (
            <button
              onClick={handleSave}
              disabled={updateProfile.isPending}
              className="text-pink-500 hover:text-pink-400 transition"
            >
              <Check size={28} />
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-400 hover:text-white transition"
            >
              <Settings size={28} />
            </button>
          )}
        </div>
      </div>

      {/* 구분선 */}
      <div className="w-[85%] border-t border-gray-700" />
    </div>
  );
};

export default MyPage;
