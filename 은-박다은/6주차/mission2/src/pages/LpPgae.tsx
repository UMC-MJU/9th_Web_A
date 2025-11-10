import { useParams } from "react-router-dom";
import { Edit3, Trash2 } from "lucide-react";
import { useGetLpDetail } from "../hooks/queries/useGetLpDetail";
import LpComments from "../components/LpComments";

const LpPage = () => {
  const { lpid } = useParams();
  const { data, isPending, isError } = useGetLpDetail(Number(lpid));

  if (isPending) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-gray-400">불러오는 중...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-red-400">오류가 발생했습니다.</p>
      </div>
    );
  }

  const lp = (data as any)?.data;
  if (!lp) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-gray-400">LP 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const authorName = lp.author?.name ?? "작성자";
  const createdAtDate = lp.createdAt ? new Date(lp.createdAt) : null;
  const uploadedLabel =
    createdAtDate != null
      ? `${Math.max(
          1,
          Math.floor(
            (Date.now() - createdAtDate.getTime()) / (1000 * 60 * 60 * 24)
          )
        )}일 전`
      : "";

  const likesCount = lp.likes?.length ?? 0;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center pt-24 pb-16 px-4 gap-8">
      <div className="w-full max-w-4xl bg-[#18181b] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.7)] px-10 py-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-pink-500 to-purple-500 flex items-center justify-center text-xs font-semibold">
              {authorName.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-300">{authorName}</span>
              <span className="text-xs text-gray-500">{uploadedLabel}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-gray-400">
            <button className="p-1 hover:text-pink-400 transition">
              <Edit3 className="w-4 h-4" />
            </button>
            <button className="p-1 hover:text-pink-400 transition">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 제목 */}
        <h1 className="text-2xl font-semibold mb-6">{lp.title}</h1>

        {/* 썸네일 (LP 원형 디자인) */}
        <div className="flex justify-center mb-8">
          <div className="relative w-80 h-80 flex items-center justify-center rounded-full bg-[#0f0f0f] shadow-2xl">
            <img
              src={lp.thumbnail}
              alt={lp.title}
              className="w-80 h-80 object-cover rounded-full border-[6px] border-[#111] shadow-lg"
            />
            {/* LP 구멍 (가운데 흰색 원) */}
            <div className="absolute w-12 h-12 bg-white rounded-full"></div>
          </div>
        </div>

        {/* 본문 설명 */}
        <p className="text-gray-300 text-sm leading-relaxed text-center mb-8">
          {lp.content}
        </p>

        {/* 태그들 */}
        {lp.tags?.length ? (
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {lp.tags.map((tag: any) => (
              <span
                key={tag.id}
                className="px-3 py-1 rounded-full text-xs bg-slate-700 text-slate-100"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        ) : null}

        {/* 좋아요 */}
        <div className="flex justify-center items-center gap-2 text-pink-500 text-sm">
          <span>❤️</span>
          <span>{likesCount}</span>
        </div>
      </div>
      <LpComments lpId={Number(lpid)} />
    </div>
  );
};

export default LpPage;
