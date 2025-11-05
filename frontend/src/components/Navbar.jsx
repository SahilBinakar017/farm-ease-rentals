import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-green-700 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold hover:underline">
        FarmEase
      </Link>

      {user ? (
        <div className="flex items-center gap-6">
          {user.role === "farmer" && (
            <>
              <Link to="/machines" className="hover:underline">
                Machines
              </Link>
              <Link to="/my-bookings" className="hover:underline">
                My Bookings
              </Link>
            </>
          )}

          {user.role === "owner" && (
            <>
              <Link to="/add-machine" className="hover:underline">
                Add Machine
              </Link>
              <Link to="/my-machines" className="hover:underline">
                My Machines
              </Link>
              <Link to="/owner-bookings" className="hover:underline">
                My Bookings
              </Link>
            </>
          )}

          {user.role === "admin" && (
            <>
              <Link to="/admin/farmers" className="hover:underline">
                Farmers
              </Link>
              <Link to="/admin/owners" className="hover:underline">
                Owners
              </Link>
              <Link to="/admin/machines" className="hover:underline">
                Machines
              </Link>
              <Link to="/admin/bookings" className="hover:underline">
                Bookings
              </Link>
            </>
          )}

          <button
            onClick={handleLogout}
            className="bg-white text-green-700 px-3 py-1 rounded hover:bg-gray-200"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex gap-4">
          <Link to="/login" className="hover:underline">
            Login
          </Link>
          <Link to="/register" className="hover:underline">
            Register
          </Link>
        </div>
      )}
    </nav>
  );
}
