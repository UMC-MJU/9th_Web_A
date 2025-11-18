import { axiosInstance } from "./axios";

export const updateMyInfo = async (payload: {
  name?: string;
  bio?: string;
  avatar?: string;
}) => {
  const { data } = await axiosInstance.patch("/v1/users", payload);
  return data;
};
