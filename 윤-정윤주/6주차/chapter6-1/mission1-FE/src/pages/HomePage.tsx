import { useState } from "react";
import useGetLpList from "../hooks/queries/useGetLpList";

const HomePage = () => {
  const [search, setSearch] = useState("");
  const { data, isPending, isError } = useGetLpList({});

  if (isPending) {
    return <div className="mt-20">Loading...</div>;
  }

  if (isError) {
    return <div className="mt-20">Error</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] gap-6 p-6">
      <h1 className="text-3xl font-bold text-gray-800">Welcome to UMC WEB</h1>
      {data?.map((lp) => <h1>{lp.title}</h1>)}
    </div>
  );
};

export default HomePage;