import { useNavigate } from "react-router-dom";
import type { LpData } from "../../types/lp";
import { useAuth } from "../../context/AuthContext";

interface LpCardProps {
  lp: LpData;
}

const LpCard = ({ lp }: LpCardProps) => {
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const handleClick = () => {
    if (!accessToken) {
      alert("로그인이 필요한 서비스입니다. 로그인 후 이용해주세요!");
      navigate("/login");
      return;
    }
    navigate(`/lp/${lp.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group relative rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer bg-[#1a1a1a]"
    >
      {/* 썸네일 */}
      <img
        src={lp.thumbnail}
        alt={lp.title}
        className="object-cover w-full h-48"
      />

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h3 className="text-white text-lg font-bold truncate">{lp.title}</h3>
        <p className="text-gray-300 text-sm">
          {new Date(lp.createdAt).toLocaleDateString()}
        </p>
        <p className="text-gray-300 text-sm flex items-center">
          ❤️ <span className="ml-1">{lp.likes?.length ?? 0}</span>
        </p>
      </div>
    </div>
  );
};

export default LpCard;
