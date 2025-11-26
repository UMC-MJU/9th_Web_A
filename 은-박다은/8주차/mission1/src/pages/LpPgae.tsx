import { useParams, useNavigate } from "react-router-dom";
import { Edit3, Trash2 } from "lucide-react";
import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";

import { useGetLpDetail } from "../hooks/queries/useGetLpDetail";
import LpComments from "../components/LpComments";
import { addLike, deleteLp, removeLike, updateLp } from "../apis/Ip";

const LpPage = () => {
  const { lpid } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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

  /* 로컬 상태 (Optimistic Update를 위해 분리) */
  const [isLiked, setIsLiked] = useState(lp.isLiked);
  const [likeCount, setLikeCount] = useState(lp.likes?.length ?? 0);

  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState(lp.title);
  const [content, setContent] = useState(lp.content);
  const [thumbnail, setThumbnail] = useState(lp.thumbnail);
  const [tags, setTags] = useState<string[]>(lp.tags.map((t: any) => t.name));

  /* ❤️ 좋아요 - Optimistic Update */
  const likeMutation = useMutation({
    mutationFn: () => (isLiked ? removeLike(lp.id) : addLike(lp.id)),

    onMutate: async () => {
      // 기존 쿼리 중단
      await queryClient.cancelQueries({ queryKey: ["lpDetail", lp.id] });

      // 이전 데이터 저장
      const previous = queryClient.getQueryData(["lpDetail", lp.id]);

      // 즉시 UI 변경
      setIsLiked((prev: boolean) => !prev);
      setLikeCount((prev: number) => (isLiked ? prev - 1 : prev + 1));

      return { previous };
    },

    onError: (_, __, context) => {
      // 실패 → 롤백
      if (context?.previous) {
        queryClient.setQueryData(["lpDetail", lp.id], context.previous);
      }
    },

    onSettled: () => {
      // 서버 데이터 동기화
      queryClient.invalidateQueries({ queryKey: ["lpDetail", lp.id] });
    },
  });

  /* LP 삭제 */
  const deleteMutation = useMutation({
    mutationFn: () => deleteLp(lp.id),
    onSuccess: () => {
      alert("삭제되었습니다.");
      navigate("/");
    },
  });

  /* LP 수정 */
  const updateMutation = useMutation({
    mutationFn: (body: any) => updateLp({ lpId: lp.id, body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lpDetail", lp.id] });
      setEditMode(false);
    },
  });

  const handleSave = () => {
    updateMutation.mutate({
      title,
      content,
      thumbnail,
      tags,
      published: true,
    });
  };

  const authorName = lp.author?.name ?? "작성자";
  const createdAtDate = new Date(lp.createdAt);
  const uploadedLabel = `${Math.floor(
    (Date.now() - createdAtDate.getTime()) / 86400000
  )}일 전`;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center pt-24 pb-16 px-4 gap-8">
      <div className="w-full max-w-4xl bg-[#18181b] rounded-2xl px-10 py-8 shadow-xl">
        {/* 헤더 */}
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

          {!editMode && (
            <div className="flex items-center gap-3 text-gray-400">
              <button
                onClick={() => setEditMode(true)}
                className="p-1 hover:text-pink-400 transition"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => deleteMutation.mutate()}
                className="p-1 hover:text-pink-400 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* 제목 */}
        {editMode ? (
          <input
            className="w-full bg-[#2b2b2b] p-3 rounded-lg mb-6"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        ) : (
          <h1 className="text-2xl font-semibold mb-6">{lp.title}</h1>
        )}

        {/* 이미지 */}
        {editMode ? (
          <div className="mb-6">
            <p className="text-sm text-gray-400 mb-2">파일 선택</p>
            <input
              type="file"
              className="text-sm"
              onChange={(e) =>
                e.target.files &&
                setThumbnail(URL.createObjectURL(e.target.files[0]))
              }
            />

            <div className="flex justify-center mt-4">
              <div className="w-48 h-48 rounded-full overflow-hidden border border-gray-600">
                <img src={thumbnail} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center mb-8">
            <div className="relative w-80 h-80 flex items-center justify-center rounded-full bg-[#0f0f0f] shadow-2xl">
              <img
                src={lp.thumbnail}
                className="w-80 h-80 object-cover rounded-full border-[6px] border-[#111]"
              />
              <div className="absolute w-12 h-12 bg-white rounded-full"></div>
            </div>
          </div>
        )}

        {/* 내용 */}
        {editMode ? (
          <textarea
            className="w-full bg-[#2b2b2b] p-3 rounded-lg mb-6"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
          />
        ) : (
          <p className="text-gray-300 text-sm leading-relaxed text-center mb-8">
            {lp.content}
          </p>
        )}

        {/* 태그 */}
        {editMode ? (
          <input
            className="w-full bg-[#2b2b2b] p-3 rounded-lg mb-6"
            value={tags.join(", ")}
            onChange={(e) =>
              setTags(e.target.value.split(",").map((t) => t.trim()))
            }
          />
        ) : (
          <div className="flex justify-center gap-2 mb-6">
            {lp.tags.map((tag: any) => (
              <span
                key={tag.id}
                className="px-3 py-1 rounded-full bg-slate-700 text-xs"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        {/* ❤️ 좋아요 (Optimistic UI) */}
        <div
          onClick={() => likeMutation.mutate()}
          className="flex justify-center items-center gap-2 text-pink-400 cursor-pointer"
        >
          {isLiked ? "💖" : "🤍"} {likeCount}
        </div>

        {/* 수정 저장 버튼 */}
        {editMode && (
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={handleSave}
              className="px-6 py-2 rounded-lg bg-pink-500 text-white"
            >
              저장
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="px-6 py-2 rounded-lg bg-gray-600 text-white"
            >
              취소
            </button>
          </div>
        )}
      </div>

      <LpComments lpId={Number(lpid)} />
    </div>
  );
};

export default LpPage;
