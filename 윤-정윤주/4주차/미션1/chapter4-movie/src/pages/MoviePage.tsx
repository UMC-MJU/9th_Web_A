import { useEffect, useState } from "react";
import { type MoviesResponse } from "../types/movie";
import MovieCard from "../components/MovieCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useParams } from "react-router-dom";
import Pagination from "../components/Pagination";
import { useCustomFetch } from "../hooks/useCustomFetch";

export default function MoviePage() {
    const { category } = useParams<{ category: string }>();
    const [page, setPage] = useState(1);

    // 카테고리 변경 시 1페이지로 초기화
    useEffect(() => setPage(1), [category]);

    const url = `https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}`;
    const { data, isPending, isError} = useCustomFetch<MoviesResponse>(url, [category, page]);

    if (isError) {
        return (
            <div>
                <span className="text-red-500 text-2xl">에러가 발생했습니다.</span>
            </div>
        );
    }

    return (
        <>
            <Pagination page={page} setPage={setPage} />

            {isPending && (
                <div className="flex items-center justify-center h-dvh">
                    <LoadingSpinner />
                </div>
            )}

            {!isPending && (
                <div className='p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 
                lg:grid-cols-5 xl:grid-cols-6'>
                    {data?.results.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            )}
        </>

    );
}