import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, LogOut, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import EditProfileModal from "../components/MyPage/EditProfileModal";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";

const MyPage = () => {
  const navigate = useNavigate();
  const { accessToken, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const { data, isLoading } = useGetMyInfo(accessToken);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0B0E13]">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0B0E13]">
        <div className="text-white text-xl">사용자 정보를 불러올 수 없습니다.</div>
      </div>
    );
  }

  const { name, bio, avatar, email } = data.data;

  return (
    <div className="min-h-screen bg-[#0B0E13] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* 프로필 이미지 */}
        <div className="flex justify-center mb-8">
          {avatar ? (
            <img
              src={avatar}
              alt="프로필 이미지"
              className="w-40 h-40 rounded-full object-cover border-4 border-pink-500"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src =
                  "https://ui-avatars.com/api/?name=" +
                  encodeURIComponent(name) +
                  "&size=160&background=ec4899&color=fff&bold=true";
              }}
            />
          ) : (
            <div className="w-40 h-40 rounded-full bg-pink-500 border-4 border-pink-500 flex items-center justify-center text-white text-5xl font-bold">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* 이름 */}
        <div className="text-center mb-2">
          <h1 className="text-3xl font-bold text-white">{name}님 환영합니다!</h1>
        </div>

        {/* Bio */}
        {bio && (
          <div className="text-center mb-8">
            <p className="text-gray-400">{bio}</p>
          </div>
        )}

        {/* 이메일 */}
        <div className="flex items-center justify-center gap-2 text-gray-300 mb-12">
          <Mail size={18} />
          <span>{email}</span>
        </div>

        {/* 버튼 그룹 */}
        <div className="flex gap-4">
          <button
            onClick={() => setIsEditing(true)}
            className="flex-1 flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg px-6 py-3 font-medium transition"
          >
            <Settings size={20} />
            설정
          </button>

          <button
            onClick={handleLogout}
            className="flex-1 flex items-center justify-center gap-2 bg-[#2A2D35] hover:bg-[#353842] text-white rounded-lg px-6 py-3 font-medium transition"
          >
            <LogOut size={20} />
            로그아웃
          </button>
        </div>
      </div>

      {/* 프로필 수정 모달 */}
      {isEditing && (
        <EditProfileModal
          currentName={name}
          currentBio={bio}
          currentAvatar={avatar}
          onClose={() => setIsEditing(false)}
        />
      )}
    </div>
  );
};

export default MyPage;
