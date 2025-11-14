export default function ErrorFallback({ message }: { message?: string }) {
  return (
    <div className="flex items-center justify-center h-screen text-gray-400">
      <div className="text-center">
        <p className="text-lg mb-2 font-semibold">⚠️ 오류 발생</p>
        <p>{message || '데이터를 불러오는 중 오류가 발생했습니다.'}</p>
      </div>
    </div>
  );
}
