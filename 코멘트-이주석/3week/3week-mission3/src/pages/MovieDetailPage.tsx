import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { LoadingSpinner } from "../components/LoadingSpinner";
import type { MovieDetails } from "../types/movieDetail";
import type { Credits } from "../types/credit";

export default function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!movieId) return;

    const fetchData = async () => {
      setIsPending(true);
      setIsError(false);

      try {
        // 1. 영화 상세 정보 요청
        const movieRes = await axios.get<MovieDetails>(
          `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          }
        );
        setMovie(movieRes.data);

        // 2. 출연진/제작진 정보 요청
        const creditsRes = await axios.get<Credits>(
          `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          }
        );
        setCredits(creditsRes.data);
      } catch {
        // API 요청이 실패하면 에러 상태 true
        setIsError(true);
      } finally {
        // 요청이 끝나면 로딩 종료
        setIsPending(false);
      }
    };

    fetchData();
  }, [movieId]); // movieId가 바뀌면 다시 실행됨

  // 로딩 중 UI
  if (isPending) {
    return (
      <div className="flex justify-center h-dvh">
        <LoadingSpinner />
      </div>
    );
  }

  // 에러 발생 UI
  if (isError) {
    return <p className="text-red-500 text-xl">에러가 발생했습니다.</p>;
  }

  // 데이터가 아직 없을 때 UI
  if (!movie || !credits) {
    return <p>데이터를 불러오는 중입니다...</p>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-64 rounded-lg shadow-lg"
        />
        <div>
          <p className="mt-1">개봉일: {movie.release_date}</p>
          <p className="mt-1">평점: {movie.vote_average}</p>
          <p className="mt-1">{movie.runtime}분</p>
          <h2 className="text-2xl font-semibold mt-4 mb-2">줄거리</h2>
          <p className="text-gray-700 leading-relaxed">{movie.overview}</p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">출연진</h2>
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {credits.cast.map((c) => (
          <li key={c.cast_id} className="text-sm text-center">
            <img
              src={`https://image.tmdb.org/t/p/w200${c.profile_path}`}
              alt={c.name}
              className="rounded-lg w-28 h-40 mx-auto object-cover"
            />
            <p className="mt-2 font-medium">{c.name}</p>
            <p className="text-gray-500 text-xs">{c.character}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
