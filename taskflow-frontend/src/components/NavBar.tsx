import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    auth?.logout();
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between bg-blue-600 px-6 py-4 text-white">
      <h1
        className="cursor-pointer text-2xl font-bold"
        onClick={() => navigate("/dashboard")}
      >
        TaskFlow
      </h1>

      <button
        onClick={handleLogout}
        className="rounded-md bg-white px-4 py-2 font-medium text-blue-600 hover:bg-gray-100"
      >
        Logout
      </button>
    </nav>
  );
}

export default Navbar;