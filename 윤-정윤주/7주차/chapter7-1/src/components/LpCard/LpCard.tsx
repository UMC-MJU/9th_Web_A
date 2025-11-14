// LpCard.tsx
import { useNavigate } from "react-router-dom";
import type { Lp } from "../../types/lp";

interface LpCardProps {
    lp: Lp;
}

const LpCard = ({ lp }: LpCardProps) => {
    const navigate = useNavigate();

    return (
        <div
        onClick={() => navigate(`/lp/${lp.id}`)}
        className="relative cursor-pointer overflow-hidden group"
        >
        {/* 썸네일 이미지 */}
        <img
            src={lp.thumbnail}
            alt={lp.title}
            className="w-full h-full object-cover aspect-square transform transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
            (e.target as HTMLImageElement).src = "/fallback-image.png";
            }}
        />

        {/* hover 시 오버레이 */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end text-white text-left p-3">
            <h2 className="font-semibold text-base mb-1 truncate leading-snug">
            {lp.title}
            </h2>
            <div className="flex justify-between items-center text-xs mt-1">
            <p className="text-gray-300">
                {new Date(lp.createdAt).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                })}
            </p>
            <p className="text-white font-medium">❤️ {lp.likes?.length || 0}</p>
            </div>
        </div>
        </div>
    );
};

export default LpCard;