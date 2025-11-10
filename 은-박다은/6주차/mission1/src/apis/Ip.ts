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
