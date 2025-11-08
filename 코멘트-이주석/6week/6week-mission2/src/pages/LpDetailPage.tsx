import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../apis/axios";
import { type LpData } from "../types/lp";
import {
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineHeart,
  AiFillHeart,
} from "react-icons/ai";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import Comment from "../components/Comment/Comment"; // ✅ 댓글 컴포넌트 import

export const LpDetailPage = () => {
  const { lpid } = useParams<{ lpid: string }>();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const {
    data: lp,
    isLoading,
    isError,
    refetch,
  } = useQuery<LpData>({
    queryKey: ["lp", lpid],
    queryFn: async () => {
      const res = await axiosInstance.get(`/v1/lps/${lpid}`);
      const result = res.data?.data ?? res.data;
      setLikeCount(result.likes?.length ?? 0);
      return result;
    },
    enabled: !!lpid,
    staleTime: 1000 * 60 * 5, // 5분 동안 캐시 유지
    gcTime: 1000 * 60 * 10, // 10분 후 가비지컬렉션
  });

  const handleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        <LoadingSpinner />
      </div>
    );

  if (isError || !lp)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-500">
        <p>LP 정보를 불러오는 중 오류가 발생했습니다.</p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-pink-500 rounded-md hover:bg-pink-600 transition"
        >
          다시 시도
        </button>
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-black text-white px-4 py-10">
      <div className="max-w-3xl w-full bg-[#1e1e1e] rounded-2xl shadow-lg p-8 flex flex-col gap-8 mb-10">
        <div className="flex justify-between items-center text-gray-400 text-sm">
          <div className="flex items-center gap-3">
            <img
              src={lp.thumbnail}
              alt="avatar"
              className="w-8 h-8 rounded-full bg-gray-700"
            />
            <span className="font-semibold">{lp.authorId ?? "익명"}</span>
          </div>
          <span>
            {formatDistanceToNow(new Date(lp.createdAt), { addSuffix: true })}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{lp.title}</h1>
          <div className="flex gap-3 text-gray-400">
            <AiOutlineEdit className="cursor-pointer hover:text-white" />
            <AiOutlineDelete className="cursor-pointer hover:text-white" />
          </div>
        </div>

        <div className="flex justify-center">
          <div className="relative w-80 h-80 bg-gray-900 rounded-full border-4 border-gray-700 overflow-hidden shadow-2xl">
            <img
              src={lp.thumbnail}
              alt={lp.title}
              className="w-full h-full object-cover rounded-full animate-spin"
              style={{ animationDuration: "8s" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 bg-black rounded-full" />
            </div>
          </div>
        </div>

        <p className="text-center text-gray-300 leading-relaxed">
          {lp.content}
        </p>

        <div className="flex justify-center items-center gap-2 mt-2">
          <button onClick={handleLike} className="focus:outline-none">
            {liked ? (
              <AiFillHeart className="w-8 h-8 text-pink-500" />
            ) : (
              <AiOutlineHeart className="w-8 h-8 text-pink-500 border-2 border-pink-500 rounded-full p-[3px]" />
            )}
          </button>
          <span className="text-gray-300">{likeCount}</span>
        </div>
      </div>

      <div className="max-w-3xl w-full">
        <Comment />
      </div>
    </div>
  );
};

export default LpDetailPage;
