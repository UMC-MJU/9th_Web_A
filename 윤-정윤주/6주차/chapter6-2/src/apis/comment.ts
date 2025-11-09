import type { PAGINATION_ORDER } from "../enums/common";
import type { Comment } from "../types/lp";
import { axiosInstance } from "./axios";

export interface getCommentsResponse {
    status: boolean;
    statusCode: number;
    message: string;
    data: {
        data: Comment[];
        nextCursor: number | null;
        hasNext: boolean;
    };
}

export function getComments(params: {
    lpId: number;
    cursor: number;
    limit: number;
    order: PAGINATION_ORDER;
}) {
    const { lpId, cursor, limit, order } = params;
    return axiosInstance.get<getCommentsResponse>(`v1/lps/${lpId}/comments`, {
        params: {
            cursor,
            limit,
            order,
        },
    }).then(response => ({
        data: response.data.data.data,
        nextCursor: response.data.data.nextCursor,
        hasNext: response.data.data.hasNext,
    }));
}