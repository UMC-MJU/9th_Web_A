import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMyInfo } from "../apis/auth";
import type { ResponseMyInfoDto } from "../types/auth";
import { Settings, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useUpdateProfile } from "../hooks/mutations/useUpdateProfile";

// LP API
import { getMyWrittenLps, getMyLikedLps } from "../apis/lp";
import LpCard from "../components/LpCard/LpCard";
import type { LpData } from "../types/lp";

export const MyPage = () => {
  const [user, setUser] = useState<ResponseMyInfoDto["data"] | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { accessToken } = useAuth();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 내 정보 가져오기
  const { data: myInfo } = useQuery({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
    enabled: !!accessToken,
  });

  useEffect(() => {
    if (myInfo?.data) {
      setUser(myInfo.data);
      setName(myInfo.data.name || "");
      setBio(myInfo.data.bio || "");
      setPreview(myInfo.data.avatar || null);
    }
  }, [myInfo]);

  const updateProfile = useUpdateProfile();

  const handleSave = () => {
    updateProfile.mutate({ name, bio });
      setIsEditing(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  // ---------------------------
  // 아래부터 LP 조회 기능
  // ---------------------------

  // 탭
  const [activeTab, setActiveTab] = useState<"liked" | "written">("liked");

  // 내가 좋아요한 LP
  const { data: likedLpData, isLoading: likedLoading } = useQuery({
    queryKey: ["lps", "liked"],
    queryFn: getMyLikedLps,
    enabled: !!user,
  });

  // 내가 작성한 LP
  const { data: writtenLpData, isLoading: writtenLoading } = useQuery({
    queryKey: ["lps", "written"],
    queryFn: getMyWrittenLps,
    enabled: !!user,
  });

  // ❤️ LP 배열 정확한 위치 (너가 준 JSON 기반)
  const likedLps: LpData[] = likedLpData?.data?.data ?? [];
  const writtenLps: LpData[] = writtenLpData?.data?.data ?? [];

  if (!user) return null;

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-black text-white pt-10">
      {/* 프로필 섹션 */}
      <div className="relative flex items-center justify-between w-[85%] max-w-5xl mb-8">
        <div className="flex items-center gap-8">
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

          <div className="flex flex-col gap-4">
            {isEditing ? (
              <input
                type="text"
                className="bg-transparent border border-pink-500 rounded-md px-3 py-1 text-xl font-semibold text-white outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
              <p className="text-gray-400">{user.bio || "소개가 없습니다."}</p>
            )}

            <p className="text-gray-400">{user.email}</p>
          </div>
        </div>

        {/* 저장 버튼 */}
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
      <div className="w-[85%] border-t border-gray-700 mb-6" />

      {/* 탭 */}
      <div className="flex gap-6 mb-6 text-lg font-semibold">
        <button
          className={`pb-2 ${
            activeTab === "liked"
              ? "text-white border-b-2 border-pink-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("liked")}
        >
          내가 좋아요 한 LP
        </button>

        <button
          className={`pb-2 ${
            activeTab === "written"
              ? "text-white border-b-2 border-pink-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("written")}
        >
          내가 작성한 LP
        </button>
      </div>

      {/* LP 목록 */}
      <div className="w-[85%] max-w-5xl grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-20">
        {/* ❤️ 좋아요한 LP */}
        {activeTab === "liked" &&
          (likedLoading ? (
            <p className="text-gray-400 col-span-full">로딩 중...</p>
          ) : likedLps.length > 0 ? (
            likedLps.map((lp) => <LpCard key={lp.id} lp={lp} />)
          ) : (
            <p className="text-gray-400 col-span-full">
              좋아요한 LP가 없습니다.
            </p>
          ))}

        {/* 📝 작성한 LP */}
        {activeTab === "written" &&
          (writtenLoading ? (
            <p className="text-gray-400 col-span-full">로딩 중...</p>
          ) : writtenLps.length > 0 ? (
            writtenLps.map((lp) => <LpCard key={lp.id} lp={lp} />)
          ) : (
            <p className="text-gray-400 col-span-full">작성한 LP가 없습니다.</p>
          ))}
      </div>
    </div>
  );
};

export default MyPage;
