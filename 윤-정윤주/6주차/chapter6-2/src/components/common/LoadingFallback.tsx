export default function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-screen text-gray-400">
      <div className="animate-spin w-8 h-8 mx-2 border-4 border-t-pink-500 border-gray-700 rounded-full"></div>
      <p>LP 정보를 불러오는 중...</p>
    </div>
  );
}
