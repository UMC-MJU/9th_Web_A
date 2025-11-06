import type { CommonResponse } from "./common";

// 회원가입
export type RequestSignupDto = {
    name: string;
    email: string;
    bio?: string;  // 필수 아님
    avatar?: string;
    password: string;
};

export type ResponseSignupDto = CommonResponse<{
    id: number;
    name: string;
    email: string;
    bio: string | null;
    avatar: string | null;
    createdAt: Date;
    updatedAt: Date;
}>;

// 로그인
export type RequestSigninDto = {
    email: string;
    password: string;
};

export type ResponseSigninDto = CommonResponse<{
    id: number;
    name: string;
    accessToken: string;
    refreshToken: string;
    nickname: string | null;
}>;

// 내 정보 조회
export type ResponseMyInfoDto = CommonResponse<{
    id: number;
    name: string;
    email: string;
    bio: string | null;
    avatar: string | null;
    createdAt: Date;
    updatedAt: Date;
}>;
