import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, X } from "lucide-react";
import { getMyInfo } from "../apis/auth";
import { updateMyInfo } from "../apis/user";

const MyPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const qc = useQueryClient();

  const [editMode, setEditMode] = useState(false);

  // react-query로 유저 정보 관리
  const { data } = useQuery({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
  });

  const user = data?.data;

  // 수정 상태
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  // 수정 버튼 눌렀을 때 값 채우기
  const openEdit = () => {
    if (!user) return; // 안전하게 막아줌

    setName(user.name);
    setBio(user.bio ?? "");
    setPreview(user.avatar ?? null);
    setEditMode(true);
  };

  // 이미지 Base64 변환
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // 수정 저장
  const mutation = useMutation({
    mutationFn: (payload: { name: string; bio: string; avatar: string }) =>
      updateMyInfo(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myInfo"] });
      setEditMode(false);
      alert("프로필이 수정되었습니다!");
    },
  });

  const handleSave = () => {
    mutation.mutate({
      name,
      bio,
      avatar: preview || "",
    });
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="relative max-w-xl mx-auto p-6 bg-black text-white rounded-xl mt-10 shadow-lg">
      {/* 상단 버튼 */}
      <div className="flex justify-end gap-4 mb-4">
        <button
          className="text-gray-300 hover:text-pink-500 transition"
          onClick={openEdit}
        >
          설정
        </button>

        <button
          className="text-gray-300 hover:text-red-400 transition"
          onClick={handleLogout}
        >
          로그아웃
        </button>
      </div>

      {/* 조회 UI */}
      <div className="flex gap-6 items-center">
        <img
          src={user.avatar ?? "/default_profile.png"}
          className="w-28 h-28 rounded-full object-cover border border-gray-700"
        />

        <div className="flex flex-col gap-2 flex-1">
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-gray-400">{user.bio ?? ""}</p>
          <p className="text-gray-500 text-sm">{user.email}</p>
        </div>
      </div>

      {/* 프로필 수정 모달 (전체 화면 중앙에 뜸) */}
      {editMode && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] p-6 rounded-xl w-[350px] shadow-lg relative">
            {/* 닫기 */}
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
              onClick={() => setEditMode(false)}
            >
              <X size={22} />
            </button>

            {/* 수정 UI */}
            <div className="flex flex-col items-center gap-4">
              <label className="cursor-pointer">
                <img
                  src={preview ?? "/default_profile.png"}
                  className="w-28 h-28 rounded-full object-cover border border-gray-700"
                />
                <input type="file" className="hidden" onChange={handleImage} />
              </label>

              <input
                className="w-full bg-black border border-gray-500 rounded-md px-3 py-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                className="w-full bg-black border border-gray-500 rounded-md px-3 py-2"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />

              <button
                onClick={handleSave}
                className="w-full bg-pink-600 hover:bg-pink-700 py-2 rounded-lg mt-2 transition"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPage;
