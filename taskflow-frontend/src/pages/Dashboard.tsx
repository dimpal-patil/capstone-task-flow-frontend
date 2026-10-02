import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Dashboard() {
  const auth = useContext(AuthContext);

  return (
    <div>
      <h1>Dashboard Page</h1>

      <p>Token: {auth?.token || "No token"}</p>

      <button onClick={() => auth?.login("test-token")}>
        Test Login
      </button>

      <button onClick={() => auth?.logout()}>
        Test Logout
      </button>
    </div>
  );
}

export default Dashboard;