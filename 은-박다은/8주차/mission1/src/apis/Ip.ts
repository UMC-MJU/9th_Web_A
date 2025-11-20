import type { PaginationDto } from "../types/common";
import type { ResponseLPistDto } from "../types/Ip";
import { axiosInstance } from "./axios";

export const getLpList = async (
  paginationDto: PaginationDto
): Promise<ResponseLPistDto> => {
  const { data } = await axiosInstance.get("/v1/lps", {
    params: paginationDto,
  });
  return data;
};

export const getLpDetail = async (lpid: number): Promise<ResponseLPistDto> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpid}`);
  return data;
};

export const getLpComments = async ({
  lpId,
  cursor = 0,
  limit,
  order,
}: {
  lpId: number;
  cursor?: number;
  limit: number;
  order: string;
}) => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}/comments`, {
    params: { cursor, limit, order },
  });
  return data;
};

export const createLP = async (body: {
  title: string;
  content: string;
  thumbnail: string;
  tags: string[];
  published: boolean;
}) => {
  const { data } = await axiosInstance.post("/v1/lps", body);
  return data;
};

/* LP 수정 */
export const updateLp = async ({
  lpId,
  body,
}: {
  lpId: number;
  body: {
    title: string;
    content: string;
    thumbnail: string;
    tags: string[];
    published: boolean;
  };
}) => {
  const { data } = await axiosInstance.patch(`/v1/lps/${lpId}`, body);
  return data;
};

/* LP 삭제 */
export const deleteLp = async (lpId: number) => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}`);
  return data;
};

/* 좋아요 추가 */
export const addLike = async (lpId: number) => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/likes`);
  return data;
};

/* 좋아요 취소 */
export const removeLike = async (lpId: number) => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}/likes`);
  return data;
};
