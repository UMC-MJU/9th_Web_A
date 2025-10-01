import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { MovieDetails } from "../types/movieDetails";
import type { Credits } from "../types/Credits";
import axios from "axios";
import { LoadingSpinner } from "../components/LoadingSpinner";

export default function MovieDetailPage() {
    const { movieId } = useParams<{ movieId: string }>();
    const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
    const [credits, setCredits] = useState<Credits | null>(null);
    // 1. 로딩 상태
    const [isPending, setIsPending] = useState(false);
    // 2. 에러 상태(에러 상태 인지만 판단)
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsPending(true);
            setIsError(false);

            try {
                const movieDetailsReponse = await axios.get(
                    `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
                    {
                        headers: {
                            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                        },
                    }
                );
                setMovieDetails(movieDetailsReponse.data);

                const creditsResponse = await axios.get(
                    `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`,
                    {
                        headers: {
                            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                        },
                    }
                );
                setCredits(creditsResponse.data);

                setIsPending(false);
            } catch (error) {
                setIsError(true);
                setIsPending(false);
            }
        };

        fetchData();
    }, [movieId]);

    if (isError) {
        return (
            <div>
                <span className="text-red-500 text-2xl">에러가 발생했습니다.</span>
            </div>
        );
    }

    if (isPending) {
        return (
            <div className="flex items-center justify-center h-dvh">
                <LoadingSpinner />
            </div>
        );
    }

    return (
                <div>
            <h1>{movieDetails?.title}</h1>
            <p>{movieDetails?.overview}</p>

            <h2>Cast</h2>
            <ul>
                {credits?.cast?.map((c) => (
                    <li key={c.cast_id}>
                        {c.name} as {c.character}
                    </li>
                ))}
            </ul>
        </div>
    );
}