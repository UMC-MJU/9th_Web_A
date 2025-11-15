import type { PaginationDto } from "../types/common";
import type {
  RequestLpDto,
  ResponseLikeLpDto,
  ResponseLpListDto,
} from "../types/lp";
import { axiosInstance } from "./axios";

export const getLpList = async (
  paginationDto: PaginationDto
): Promise<ResponseLpListDto> => {
  const { data } = await axiosInstance.get("/v1/lps", {
    params: paginationDto,
  });

  return data;
};

export const getLpDetail = async ({ lpId }: RequestLpDto) => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}`);

  return data;
};

export const postLike = async ({
  lpId,
}: RequestLpDto): Promise<ResponseLikeLpDto> => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/likes`);

  return data;
};

export const deleteLike = async ({
  lpId,
}: RequestLpDto): Promise<ResponseLikeLpDto> => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}/likes`);

  return data;
};

export const createLp = async (formData: FormData) => {
  const { data } = await axiosInstance.post("/v1/lps", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const getMyWrittenLps = async () => {
  const { data } = await axiosInstance.get("/v1/lps/user");
  return data; // LP 목록 배열
};

export const getMyLikedLps = async () => {
  const { data } = await axiosInstance.get("/v1/lps/likes/me");
  return data; // LP 목록 배열
};
