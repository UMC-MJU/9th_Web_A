import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import type { MovieDetails } from "../types/movieDetail";
import type { Credits } from "../types/Credits";
import { LoadingSpinner } from "../components/LoadingSpinner";

const MovieDetailPage = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsPending(true);
      setIsError(false);

      try {
        const [movieRes, creditsRes] = await Promise.all([
          axios.get<MovieDetails>(
            `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
            {
              headers: {
                accept: "application/json",
                Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
              },
            }
          ),
          axios.get<Credits>(
            `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`,
            {
              headers: {
                accept: "application/json",
                Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
              },
            }
          ),
        ]);

        setMovie(movieRes.data);
        setCredits(creditsRes.data);
      } catch {
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    if (movieId) fetchData();
  }, [movieId]);

  if (isError) return <div className="text-red-500">에러가 발생했습니다</div>;
  if (isPending) {
    return (
      <div className="flex items-center justify-center h-dvh">
        <LoadingSpinner />
      </div>
    );
  }
  if (!movie) return <div>영화 정보를 불러올 수 없습니다</div>;

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
