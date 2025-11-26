import { axiosInstance } from "./axios";

export const getComments = async (lpId: number, cursor?: number) => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}/comments`, {
    params: { cursor, limit: 4 },
  });

  return {
    data: data?.data?.data ?? [],
    hasNext: data?.data?.hasNext ?? false,
    nextCursor: data?.data?.nextCursor ?? null,
  };
};

export const postComment = async (lpId: number, content: string) => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/comments`, {
    content,
  });
  return data;
};
