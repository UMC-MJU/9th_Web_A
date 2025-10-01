import { useEffect, useState } from "react";
import axios from "axios";
import { type MoviesResponse, type Movie } from "../types/movie";
import MovieCard from "../components/MovieCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useParams } from "react-router-dom";
import Pagination from "../components/Pagination";

export default function MoviePage() {
    const [movies, setMovies] = useState<Movie[]>([]);
    // 1. 로딩 상태
    const [isPending, setIsPending] = useState(false);
    // 2. 에러 상태(에러 상태 인지만 판단)
    const [isError, setIsError] = useState(false);
    // 3. 페이지 상태(페이지가 몇 번째인지)
    const [page, setPage] = useState(1);
    // 4. 카테고리 상태(현재 어떤 카테고리인지)
    //  => URL 파라미터로 받아오기
    const { category } = useParams<{  // 구조 분해 할당
        category: string;
    }>();

    // 카테고리 변경 시 1페이지로 초기화
    useEffect(() => {
        setPage(1);
    }, [category]);

    useEffect(() => {
        const fetchMovies = async () => {
            setIsPending(true);
            try {
                const { data } = await axios.get<MoviesResponse>(
                    `https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}`,
                    {
                        headers: {
                            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                        },
                    }
                );

                setMovies(data.results);
                setIsError(false);  // 성공 시 에러 상태 초기화
                // setIsPending(false);
            } catch {
                setIsError(true);
                // setIsPending(false);
            } finally {
                setIsPending(false);  // 성공, 실패 여부와 상관없이 무조건 실행(공통으로 처리)
            }
        };

        fetchMovies();
    }, [page, category]); // 페이지 혹은 카테고리가 바뀔 때마다 useEffect 재실행

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
                    {movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            )}
        </>

    );
}