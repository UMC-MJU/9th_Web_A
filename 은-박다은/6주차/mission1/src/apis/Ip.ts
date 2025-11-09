import type { PaginationDto } from "../types/common";
import type { ResponseLPistDto } from "../types/Ip";
import { axiosInstance } from "./axios";

export const getLpList = async (
  paginationDto: PaginationDto
): Promise<ResponseLPistDto> => {
  const { data } = await axiosInstance.get("/v1/Ips", {
    params: paginationDto,
  });

  return data;
};
