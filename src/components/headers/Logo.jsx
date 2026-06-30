import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <div>
      <Link to={"/"}>
        <h1 className="lg:text-3xl text-2xl font-bold text-gray-800 hover:cursor-pointer">
          my<span className="text-red-500">Store</span>
        </h1>
      </Link>
    </div>
  );
}
