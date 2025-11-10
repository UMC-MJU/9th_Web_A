import { useParams } from "react-router-dom";

const LpPage = () => {
  const { lpid } = useParams();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 pl-64">
      <h1 className="text-2xl font-bold mb-4">LP 상세 페이지</h1>
      <p className="text-gray-400">LP ID: {lpid}</p>
    </div>
  );
};

export default LpPage;
