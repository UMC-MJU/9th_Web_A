import { useNavigate } from "react-router-dom";
import type { Lp } from "../types/Ip";

interface Props {
  lp: Lp;
}

const LpCard = ({ lp }: Props) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/lp/${lp.id}`)}
      className="relative group cursor-pointer overflow-hidden rounded-lg bg-[#141414] shadow-md transition-transform duration-300 hover:scale-105"
    >
      <img
        src={lp.thumbnail || "/default_cover.jpg"}
        alt={lp.title || "lp cover"}
        className="w-full h-56 object-cover"
      />

      <div className="absolute inset-0 bg-black bg-opacity-80 group-hover:bg-opacity-0 transition-all duration-300 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-70">
        <h3 className="text-sm font-semibold truncate mb-1">
          {lp.title || "제목 없음"}
        </h3>
        <div className="flex justify-between text-xs text-gray-400">
          <span>
            {lp.createdAt
              ? new Date(lp.createdAt).toLocaleDateString()
              : "날짜 없음"}
          </span>
          <span>❤️ {lp.likes?.length ?? 0}</span>
        </div>
      </div>
    </div>
  );
};

export default LpCard;
