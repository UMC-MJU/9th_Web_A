import type { CommonResponse, CursorBasedResponse } from "./common";

export type Tag = {
  id: number;
  name: string;
};

export type Like = {
  id: number;
  userId: number;
  lpId: number;
};

export type Author = {
  id: number;
  name: string;
  email?: string;
  avatar?: string | null;
  bio?: string | null;
};

export type Lp = {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  published: boolean;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
  likes: Like[];
  author?: Author;
};

export type RequestLpDto = {
  lpId: number;
};

export type LpDetail = Lp & {
  author: Author;
};

export type ResponseLpListDto = CursorBasedResponse<Lp[]>;

export interface Comment {
  id: number;
  content: string;
  lpId: number;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author: Author;
}

export type ResponseCommentListDto = CursorBasedResponse<Comment[]>;

export type ResponseLikeLpDto = CommonResponse<{
  id: number;
  userId: number;
  lpId: number;
}>;

export type ResponseLpDto = CommonResponse<Lp>;

export type RequestCreateLpDto = {
  name: string;
  content: string;
  tags: string[];
  image?: string;
};