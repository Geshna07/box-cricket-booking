import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  const logout = () => {
    localStorage.removeItem('user')
    navigate('/')
    window.location.reload()
  }

  return (
    <nav className="bg-green-700 text-white px-6 py-4 flex justify-between items-center shadow-md sticky top-0 z-50">
      <Link to="/" className="text-xl font-bold tracking-wide flex items-center gap-2">
        🏏 BoxCricket
      </Link>

      <div className="flex gap-4 items-center text-sm">
        <Link to="/slots" className="hover:underline">Book Slot</Link>

        {user && !user.isAdmin && (
          <Link to="/my-bookings" className="hover:underline">My Bookings</Link>
        )}

        {user?.isAdmin && (
          <Link to="/admin" className="hover:underline font-semibold">
            ⚙️ Admin
          </Link>
        )}

        {user ? (
          <div className="flex items-center gap-3">
            <span className="opacity-80">Hi, {user.name}</span>
            <button
              onClick={logout}
              className="bg-white text-green-700 px-3 py-1 rounded font-medium hover:bg-green-100 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link
              to="/login"
              className="bg-white text-green-700 px-3 py-1 rounded font-medium hover:bg-green-100 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="border border-white px-3 py-1 rounded hover:bg-green-600 transition"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}