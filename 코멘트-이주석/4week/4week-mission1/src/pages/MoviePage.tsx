import { useParams } from "react-router-dom";
import { useCustomFetch } from "../hooks/useCustomFetch";
import type { MovieResponse } from "../types/movie";
import MovieCard from "../components/MovieCard";
import { LoadingSpinner } from "../components/LoadingSpinner";

export default function MoviePage() {
  const { category } = useParams<{ category: string }>();
  const { data, isPending, isError } = useCustomFetch<MovieResponse>(
    category
      ? `https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=1`
      : null
  );

  if (isPending)
    return (
      <div className="flex items-center justify-center h-dvh">
        <LoadingSpinner />
      </div>
    );
  if (isError)
    return <p className="text-red-500 text-xl">에러가 발생했습니다.</p>;
  if (!data) return null;

  return (
    <div className="p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {data.results.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
