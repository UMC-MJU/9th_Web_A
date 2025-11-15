import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../apis/axios";
import { type Likes, type LpData } from "../types/lp";
import { formatDistanceToNow } from "date-fns";
import LoadingSpinner from "../components/LoadingSpinner";
import Comment from "../components/Comment/Comment";
import { useAuth } from "../context/AuthContext";
import { ImageIcon, Heart, Edit, Trash } from "lucide-react";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import usePostLike from "../hooks/mutations/usePostLike";
import useDeleteLike from "../hooks/mutations/useDeleteLike";
import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";

export const LpDetailPage = () => {
  const { lpid } = useParams<{ lpid: string }>();
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const navigate = useNavigate();

  // ✅ LP 상세 데이터 불러오기
  const {
    data: lp,
    isLoading,
    isError,
    refetch,
  } = useQuery<LpData>({
    queryKey: ["lp", lpid],
    queryFn: async () => {
      const res = await axiosInstance.get(`/v1/lps/${lpid}`);
      return res.data?.data ?? res.data;
    },
    enabled: !!lpid,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const updateLpMutation = useMutation({
    mutationFn: async (payload: any) => {
      return await axiosInstance.patch(`/v1/lps/${lpid}`, payload);
    },
    onSuccess: () => {
      alert("LP 수정 완료!");
      queryClient.invalidateQueries(["lp", lpid]);
      setIsEditing(false);
    },
    onError: () => {
      alert("LP 수정 중 오류 발생");
    },
  });

  const deleteLpMutation = useMutation({
    mutationFn: async () => {
      return await axiosInstance.delete(`/v1/lps/${lpid}`);
    },
    onSuccess: () => {
      alert("LP가 삭제되었습니다.");
      queryClient.invalidateQueries(["lps"]);
      navigate("/");
    },
    onError: () => {
      alert("LP 삭제 실패");
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  useEffect(() => {
    if (lp) {
      setTitle(lp.title);
      setContent(lp.content);
      setTags(lp.tags.map((t: any) => t.name).join(", "));
      setThumbnail(lp.thumbnail);
    }
  }, [lp]);

  const { data: me } = useGetMyInfo(accessToken);

  const postLike = usePostLike();
  const deleteLike = useDeleteLike();

  const isLiked = lp?.likes?.some((like: Likes) => like.userId === me?.data.id);

  const handleToggleLike = () => {
    if (!accessToken) {
      alert("로그인이 필요한 서비스입니다!");
      return;
    }
    if (!lpid) return;

    // 낙관적 업데이트
    queryClient.setQueryData(["lp", lpid], (old: LpData | undefined) => {
      if (!old || !me?.data) return old;

      const alreadyLiked = old.likes.some((l) => l.userId === me.data.id);
      if (alreadyLiked) {
        return {
          ...old,
          likes: old.likes.filter((l) => l.userId !== me.data.id),
        };
      } else {
        return {
          ...old,
          likes: [
            ...old.likes,
            { id: Date.now(), lpId: old.id, userId: me.data.id },
          ],
        };
      }
    });

    // 서버 요청
    if (isLiked) {
      deleteLike.mutate(
        { lpId: Number(lpid) },
        {
          onError: () => {
            queryClient.invalidateQueries(["lp", lpid]);
          },
          onSettled: () => {
            queryClient.invalidateQueries(["lp", lpid]);
          },
        }
      );
    } else {
      postLike.mutate(
        { lpId: Number(lpid) },
        {
          onError: () => {
            queryClient.invalidateQueries(["lp", lpid]);
          },
          onSettled: () => {
            queryClient.invalidateQueries(["lp", lpid]);
          },
        }
      );
    }
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
    <div className="flex flex-col items-center w-full min-h-screen bg-black text-white px-4 py-10">
      <div className="bg-[#1e1e1e] max-w-3xl w-full rounded-2xl p-8 shadow">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <img src={lp.author?.avatar} className="w-10 h-10 rounded-full" />
            <div className="text-sm text-gray-300">
              <div className="font-bold">{lp.author?.name ?? "익명"}</div>
              <div>
                {formatDistanceToNow(new Date(lp.createdAt), {
                  addSuffix: true,
                })}
              </div>
            </div>
          </div>

          <div className="flex gap-4 text-gray-300 text-xl items-center">
            {isEditing && (
              <label className="cursor-pointer hover:text-white">
                <ImageIcon className="w-6 h-6" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const url = URL.createObjectURL(file);
                    setThumbnail(url);
                    setThumbnailFile(file);
                  }}
                />
              </label>
            )}

            <Edit
              onClick={() => setIsEditing(!isEditing)}
              className="cursor-pointer hover:text-white"
            />

            <Trash
              onClick={() => {
                if (window.confirm("정말 삭제하시겠습니까?")) {
                  deleteLpMutation.mutate();
                }
              }}
              className="cursor-pointer hover:text-red-400"
            />
          </div>
        </div>

        {isEditing ? (
          <input
            className="mt-6 w-full bg-[#2a2a2a] p-3 rounded text-lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        ) : (
          <h1 className="text-3xl font-bold mt-6">{lp.title}</h1>
        )}

        <div className="flex justify-center mt-6 mb-6">
          <img
            src={thumbnail}
            className="w-[320px] h-[320px] rounded-full object-cover shadow-xl"
          />
        </div>

        {isEditing && (
          <input
            type="file"
            accept="image/*"
            className="text-sm mb-6"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setThumbnail(URL.createObjectURL(f));
            }}
          />
        )}

        {isEditing ? (
          <textarea
            className="bg-[#2a2a2a] p-3 w-full rounded h-24"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        ) : (
          <p className="text-gray-300 leading-relaxed text-center">
            {lp.content}
          </p>
        )}

        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {isEditing ? (
            <input
              className="bg-[#2a2a2a] p-2 w-full rounded"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="태그 입력 (예: pop, jazz)"
            />
          ) : (
            lp.tags.map((tag: any) => (
              <span
                key={tag.id}
                className="px-4 py-1 bg-[#333] text-sm rounded-full border border-gray-600"
              >
                #{tag.name}
              </span>
            ))
          )}
        </div>

        <div className="flex justify-center items-center gap-2 mt-2">
          <button
            onClick={handleToggleLike}
            className="transition-transform hover:scale-110"
            disabled={postLike.isPending || deleteLike.isPending}
          >
            <Heart
              size={28}
              color={isLiked ? "#ff3366" : "#aaa"}
              fill={isLiked ? "#ff3366" : "transparent"}
            />
          </button>
          <span className="text-gray-300">{lp.likes?.length ?? 0}</span>
        </div>

        {isEditing && (
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => {
                updateLpMutation.mutate({
                  title,
                  content,
                  thumbnail,
                  tags: tags.split(",").map((t) => t.trim()),
                });
              }}
              className="bg-pink-500 px-4 py-2 rounded hover:bg-pink-600"
            >
              저장
            </button>

            <button
              onClick={() => {
                setIsEditing(false);
                setTitle(lp.title);
                setContent(lp.content);
                setTags(lp.tags.map((t: any) => t.name).join(", "));
                setThumbnail(lp.thumbnail);
              }}
              className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700"
            >
              취소
            </button>
          </div>
        )}
      </div>

      <div className="max-w-3xl w-full">
        <Comment />
      </div>
    </div>
  );
};

export default LpDetailPage;
