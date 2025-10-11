import { useParams } from "react-router-dom";
import { useCustomFetch } from "../hooks/useCustomFetch";
import { LoadingSpinner } from "../components/LoadingSpinner";
import type { MovieDetails } from "../types/movieDetail";
import type { Credits } from "../types/Credits";

const MovieDetailPage = () => {
  const { movieId } = useParams<{ movieId: string }>();

  // ✅ 커스텀 훅으로 영화 상세, 출연진 데이터 요청
  const {
    data: movie,
    loading: movieLoading,
    error: movieError,
  } = useCustomFetch<MovieDetails>(
    `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
    [movieId]
  );

  const {
    data: credits,
    loading: creditsLoading,
    error: creditsError,
  } = useCustomFetch<Credits>(
    `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`,
    [movieId]
  );

  // ✅ 로딩 & 에러 상태 처리
  if (movieLoading || creditsLoading) {
    return (
      <div className="flex items-center justify-center h-dvh">
        <LoadingSpinner />
      </div>
    );
  }

  if (movieError || creditsError) {
    return (
      <div className="text-red-500 text-center">에러가 발생했습니다 😢</div>
    );
  }

  if (!movie) {
    return (
      <div className="text-gray-400 text-center">
        영화 정보를 불러올 수 없습니다
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      {/* 1. 상단 배너 */}
      <div className="relative w-full h-[400px]">
        <img
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="relative z-10 p-8 max-w-3xl">
          <h1 className="text-4xl font-bold">{movie.title}</h1>
          <p className="mt-2">평균 {movie.vote_average.toFixed(1)}</p>
          <p>{movie.release_date}</p>
          <p>{movie.runtime}분</p>
          <p className="mt-4 italic">{movie.tagline}</p>
          <p className="mt-4">{movie.overview}</p>
        </div>
      </div>

      {/* 2. 출연진 */}
      {credits && (
        <section className="mt-10 p-6">
          <h2 className="text-2xl font-bold mb-4">감독 / 출연</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
            {credits.cast.slice(0, 20).map((actor) => (
              <div key={actor.id} className="flex-shrink-0 w-28 text-center">
                {actor.profile_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                    alt={actor.name}
                    className="w-28 h-28 object-cover rounded-full mx-auto"
                  />
                ) : (
                  <div className="w-28 h-28 bg-gray-600 rounded-full mx-auto" />
                )}
                <p className="mt-2 font-semibold text-sm">{actor.name}</p>
                <p className="text-xs text-gray-400">{actor.character}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default MovieDetailPage;
