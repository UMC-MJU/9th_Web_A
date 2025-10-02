import { useEffect, useState } from "react";
import type { Movie, MovieResponse } from "../types/movie";
import axios from "axios";

const MoviesPage = () => {
    const [movies, setMovies] = useState<Movie[]>([]);

    console.log(movies);

    useEffect(() => {
        // 영화 데이터 불러오기
        const fetchMovies = async () => {
            const { data } = await axios.get<MovieResponse>(
                `https://api.themoviedb.org/3/movie/popular?&language=ko-KR&page=1`,
                {
                    headers: {
                        Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,  //  본인 TMDB 토큰 넣기
                    },
                }
            );
            setMovies(data.results);
        };
        fetchMovies();
    }, []);
    
    return (
        <ul>
            {movies?.map(movie => (
                <li key={movie.id}>
                    <h2>{movie.title}</h2>
                    <p>{movie.release_date}</p>
                </li>
            ))}
        </ul>
    );
};

export default MoviesPage;