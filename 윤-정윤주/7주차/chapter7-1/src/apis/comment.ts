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
    const { lpId, cursor = 0, limit, order } = params;
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

export async function createComment(params: {
    lpId: number;
    content: string;
}) {
    const { lpId, content } = params;
    const res = await axiosInstance.post(`/v1/lps/${lpId}/comments`, {
        content,
    });
    return res.data;
}

export async function updateComment(params: {
    lpId: number;
    commentId: number;
    content: string;
}) {
    const { lpId, commentId, content } = params;
    const res = await axiosInstance.patch(`/v1/lps/${lpId}/comments/${commentId}`, { content });
    return res.data;
}

export async function deleteComment(params: { lpId: number; commentId: number }) {
    const { lpId, commentId } = params;
    const res = await axiosInstance.delete(`/v1/lps/${lpId}/comments/${commentId}`);
    return res.data;
}