import { useParams } from "react-router-dom";
import type { MovieDetails } from "../types/movieDetails";
import type { Credits } from "../types/Credits";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useCustomFetch } from "../hooks/useCustomFetch";

export default function MovieDetailPage() {
    const { movieId } = useParams<{ movieId: string }>();

    // 영화 상세 정보
    // 별칭 사용: useCustomFetch 반환값 이름 충돌 방지
    const {
        data: movieDetails,
        isPending: isMoviePending,
        isError: isMovieError
    } = useCustomFetch<MovieDetails>(
        `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
        [movieId]
    );

    // 크레딧 정보
    const {
        data: credits,
        isPending: isCreditsPending,
        isError: isCreditsError
    } = useCustomFetch<Credits>(
        `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`, 
        [movieId]
    );

    if (isMovieError || isCreditsError) {
        return (
            <div>
                <span className="text-red-500 text-2xl">에러가 발생했습니다.</span>
            </div>
        );
    }

    if (isMoviePending || isCreditsPending) {
        return (
            <div className="flex items-center justify-center h-dvh">
                <LoadingSpinner />
            </div>
        );
    }

    // 이미지 경로를 완성하기 위한 기본 URL (TMDB 공식 경로)
    const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";
    const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w200";

    return (
        // movieDetails가 null이 아닐 때만 렌더링
        <div className="min-h-screen bg-gray-900 text-white">
            {/* 배경 이미지 */}
            <div
                className="relative h-[60vh] bg-cover bg-center"
                style={{
                    // background_path를 배경 이미지로 사용
                    backgroundImage: `linear-gradient(to top, rgba(17, 24, 39, 1),
                                    rgba(0,0,0,0.5)), url(${IMAGE_BASE_URL}${movieDetails?.backdrop_path})`,
                }}
            >
                {/* 배경 위에 겹칠 메타 정보 및 줄거리 */}
                <div className="absolute inset-0 flex items-end p-8 md:p-12">
                    <div className="max-w-4xl">
                        {/* 제목 및 평점 */}
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-2 text-white-400">
                            {movieDetails?.title}
                        </h1>
                        <div className="flex items-center space-x-4 text-lg mb-4 text-gray-300">
                            <span>⭐ 평점 {movieDetails?.vote_average.toFixed(1)}</span>
                            <span>| {movieDetails?.release_date.substring(0, 4)}</span>
                            <span>| {movieDetails?.runtime}분</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 출연진 */}
            <div className="p-8 md:p-12">
                <h2 className="text-3xl font-bold mb-6 border-b border-gray-700 pb-2">
                    감독/출연
                </h2>

                {/* 출연진 목록: 가로 스크롤 및 원형 프로필 */}
                <div className="
                    grid grid-flow-col      /* 항목을 '열' 방향으로 채우도록 설정 */
                    grid-rows-2             /* 행을 정확히 2개로 제한 */
                    gap-x-6 gap-y-4         /* 행/열 간격 설정 */
                    overflow-x-auto pb-4    /* 가로 스크롤 허용 */
                    overflow-y-hidden       /* 세로 스크롤 방지 */
                    scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900
                ">
                    {credits?.cast?.map((c) => (
                        <div key={c.cast_id} className="w-32 text-center flex-shrink-0">
                            {/* 프로필 이미지 */}
                            <img
                                src={c.profile_path ? `${POSTER_BASE_URL}${c.profile_path}` : 'placeholder-url.png'}
                                alt={c.name}
                                className="w-24 h-24 object-cover rounded-full mx-auto border-2 border-white-400 mb-2"
                            />
                            {/* 이름 */}
                            <p className="font-semibold text-sm truncate">{c.name}</p>
                            {/* 배역 */}
                            <p className="text-xs text-gray-400 truncate">({c.character})</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* 포스터와 추가 정보(옵션) */}
            <div className="p-8 md:p-12 pt-0 grid md:grid-cols-3 gap-8">
                {/* 포스터 */}
                <div className="md:col-span-1">
                    <img
                        src={`${POSTER_BASE_URL}${movieDetails?.poster_path}`}
                        alt={movieDetails?.title}
                        className="rounded-lg shadow-xl w-full md:w-200 h-auto mx-auto"
                    />
                </div>
                {/* 추가 정보 (장르, 제작사 등) */}
                <div className="md:col-span-2 space-y-4">
                    <h3 className="text-xl font-bold border-b border-gray-700 pb-1">장르</h3>
                    <p className="flex flex-wrap gap-2">
                        {movieDetails?.genres.map((g) => (
                            <span key={g.id} className="bg-gray-700 text-xs px-3 py-1 rounded-full">{g.name}</span>
                        ))}
                    </p>
                    {/* 줄거리 */}
                    <h3 className="text-xl font-bold border-b border-gray-700 pb-1 pt-4">줄거리</h3>
                    <p className="text-lg leading-relaxed text-gray-200">
                        {movieDetails?.overview || "줄거리 정보가 없습니다."}
                    </p>
                </div>
            </div>
        </div>
    );
}