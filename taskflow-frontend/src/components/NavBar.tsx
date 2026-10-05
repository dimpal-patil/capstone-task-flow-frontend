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
    <nav className="border-b border-slate-200 bg-white text-slate-900 shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <button
          type="button"
          className="group inline-flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          onClick={() => navigate("/dashboard")}
        >
          <span className="grid size-10 place-items-center rounded-lg bg-blue-700 text-lg font-black text-white shadow-sm transition group-hover:bg-blue-800">
            T
          </span>
          <span className="text-xl font-extrabold text-slate-900">TaskFlow</span>
        </button>

        <button
          onClick={handleLogout}
          className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;