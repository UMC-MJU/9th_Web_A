import { axiosInstance } from "./axios";
import type { PaginationDto } from "../types/common";
import type { Lp, RequestLpDto, ResponseLikeLpDto, ResponseLpListDto } from "../types/lp";

// LP 목록 조회
export const getLpList = async (paginationDto: PaginationDto): Promise<ResponseLpListDto> => {
    const { data } = await axiosInstance.get("/v1/lps", { params: paginationDto });
    return data;
};

// LP 상세 조회
export const getLpDetail = async ({ lpId }: RequestLpDto): Promise<Lp> => {
    const { data } = await axiosInstance.get(`/v1/lps/${lpId}`);
    // API 응답 구조: { json: { status, message, statusCode, data: {...} } }
    // 실제 LP 데이터는 data.data에 있음
    return data.data;
};

// LP 좋아요 추가
export const postLike = async ({
    lpId 
}: RequestLpDto): Promise<ResponseLikeLpDto> => {
    const { data } = await axiosInstance.post(`/v1/lps/${lpId}/likes`);
    
    return data;
}

// LP 좋아요 삭제
export const deleteLike = async ({
    lpId 
}: RequestLpDto): Promise<ResponseLikeLpDto> => {
    const { data } = await axiosInstance.delete(`/v1/lps/${lpId}/likes`);

    return data;
};

// LP 생성
export async function createLp(payload: {
    title: string;
    content: string;
    thumbnail: string;
    tags: string[];
}) {
    const res = await axiosInstance.post("/v1/lps", {
        ...payload,
        published: true,  // LP를 바로 게시 상태로 생성
    });
    return res.data;
}

