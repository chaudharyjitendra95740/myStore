import { useEffect, useState } from "react";

export default function SearchProduct() {
  const [search, setSearch] = useState("");

  const handleClick = useEffect(() => {
    
  }, [search]);

  return (
    <div className="border-gray-400 flex w-auto items-center">
      <input
        type="text"
        placeholder="search product"
        className="w-auto p-1.5  border-2 border-gray-400 rounded-md focus:outline-green-400 text-gray-700 font-semibold"
        onChange={(e) => setSearch(e.target.value)}
        value={search}
      />
      <i
        className="fa-solid fa-magnifying-glass"
        style={{ position: "relative", right: "30px" }}
        onClick={handleClick}
      ></i>
    </div>
  );
}
