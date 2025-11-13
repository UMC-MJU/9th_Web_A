import type { RequestSigninDto, RequestSignupDto, ResponseMyInfoDto, ResponseSigninDto, ResponseSignupDto } from "../types/auth"
import { axiosInstance } from "./axios";

export const postSignup = async (
    body: RequestSignupDto
):Promise<ResponseSignupDto> => {
    const { data } = await axiosInstance.post("/v1/auth/signup", body,);

    return data;
}

export const postSignin = async (
    body: RequestSigninDto 
):Promise<ResponseSigninDto> => {
    const { data } = await axiosInstance.post("/v1/auth/signin", body,);

    return data;
}

export const getMyInfo = async ():Promise<ResponseMyInfoDto> => {
    const { data } = await axiosInstance.get("/v1/users/me");

    return data;
};

export const postLogout = async () => {
    const {data} = await axiosInstance.post("/v1/auth/signout");

    return data;
};

export interface UpdateUserPayload {
    name?: string;
    bio?: string;
    avatar?: string; // URL 문자열
}

export const updateMyInfo = async (payload: UpdateUserPayload) => {
    const { data } = await axiosInstance.patch("/v1/users", payload);
    return data;
};
