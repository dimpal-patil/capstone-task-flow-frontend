import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ThemeToggle from "./ui/ThemeToggle";
import { Button } from "./ui/primitives";

function Navbar() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    auth?.logout();
    navigate("/login");
  };

  return (
    <nav className="border-b border-slate-200 bg-white text-slate-900 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <button
          type="button"
          className="group inline-flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
          onClick={() => navigate("/dashboard")}
        >
          <span className="grid size-10 place-items-center rounded-lg bg-brand-700 text-lg font-black text-white shadow-sm transition group-hover:bg-brand-800">
            T
          </span>
          <span className="text-xl font-extrabold text-slate-900 dark:text-white">
            TaskFlow
          </span>
        </button>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button onClick={handleLogout} className="px-4 py-2.5">
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
