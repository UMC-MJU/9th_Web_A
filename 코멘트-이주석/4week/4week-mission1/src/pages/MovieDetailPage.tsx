import { useParams } from "react-router-dom";
import { useCustomFetch } from "../hooks/useCustomFetch";
import { LoadingSpinner } from "../components/LoadingSpinner";
import type { MovieDetails } from "../types/movieDetail";
import type { Credits } from "../types/credit";

export default function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>();

  const {
    data: movie,
    isPending: isMovieLoading,
    isError: isMovieError,
  } = useCustomFetch<MovieDetails>(
    movieId
      ? `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`
      : null
  );

  const {
    data: credits,
    isPending: isCreditsLoading,
    isError: isCreditsError,
  } = useCustomFetch<Credits>(
    movieId
      ? `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`
      : null
  );

  if (isMovieLoading || isCreditsLoading)
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <LoadingSpinner />
      </div>
    );

  if (isMovieError || isCreditsError)
    return (
      <div className="flex justify-center items-center h-screen bg-black text-red-400 text-2xl">
        데이터를 불러오지 못했습니다
      </div>
    );

  if (!movie || !credits) return null;

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="relative w-full h-[500px] overflow-hidden">
        <img
          src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
          alt={movie.title}
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />

        <div className="absolute bottom-10 left-10 max-w-3xl">
          <h1 className="text-5xl font-bold mb-4">{movie.title}</h1>
          <div className="text-gray-300 mb-2 space-x-4">
            <span>⭐ {movie.vote_average.toFixed(1)}</span>
            <span>{movie.release_date.split("-")[0]}</span>
            <span>{movie.runtime}분</span>
          </div>
          <p className="text-gray-300 leading-relaxed max-w-2xl">
            {movie.overview}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-semibold mb-6 border-l-4 border-yellow-400 pl-3">
          출연진
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
          {credits.cast.map((c) => (
            <div key={c.cast_id} className="text-center">
              <div className="w-32 h-32 mx-auto mb-2 rounded-full overflow-hidden border-2 border-gray-700 shadow-md">
                {c.profile_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w200${c.profile_path}`}
                    alt={c.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-black" />
                )}
              </div>
              <p className="font-medium text-gray-100">{c.name}</p>
              <p className="text-gray-500 text-sm">{c.character}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
