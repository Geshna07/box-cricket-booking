import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

export default function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    axios.get(`http://localhost:5000/bookings?userId=${user.id}`)
      .then(res => {
        setBookings(res.data.reverse())
        setLoading(false)
      })
  }, [])

  const handleCancel = async (booking) => {
    const confirmed = window.confirm(
      `Cancel booking ${booking.bookingId}?\n\n${booking.sport} - ${booking.time} on ${booking.date}`
    )
    if (!confirmed) return
    await axios.patch(`http://localhost:5000/bookings/${booking.id}`, { status: 'cancelled' })
    await axios.patch(`http://localhost:5000/slots/${booking.slotId}`, { isBooked: false })
    setBookings(prev =>
      prev.map(b => b.id === booking.id ? { ...b, status: 'cancelled' } : b)
    )
    alert('Booking cancelled successfully!')
  }

  const sportIcon = { 'Box Cricket': '🏏', 'Badminton': '🏸', 'Football': '⚽' }

  const confirmed = bookings.filter(b => b.status === 'confirmed').length
  const cancelled = bookings.filter(b => b.status === 'cancelled').length
  const totalSpent = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + b.price, 0)

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-400">Loading your bookings...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="max-w-4xl mx-auto">

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-green-700">My Bookings</h1>
          <p className="text-gray-500">All your slot bookings in one place</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow p-5 text-center">
            <p className="text-3xl font-bold text-green-700">{bookings.length}</p>
            <p className="text-gray-500 text-sm mt-1">Total Bookings</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-5 text-center">
            <p className="text-3xl font-bold text-blue-600">{confirmed}</p>
            <p className="text-gray-500 text-sm mt-1">Confirmed</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-5 text-center">
            <p className="text-3xl font-bold text-orange-500">₹{totalSpent}</p>
            <p className="text-gray-500 text-sm mt-1">Total Spent</p>
          </div>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-20 text-gray-400 bg-white rounded-2xl shadow">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-lg font-medium">No bookings yet!</p>
            <p className="text-sm mt-1 mb-6">Start by booking a slot.</p>
            <Link
              to="/slots"
              className="bg-green-700 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-green-800 transition"
            >
              Book a Slot →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map(booking => (
              <div
                key={booking.id}
                className={`bg-white rounded-2xl shadow p-5 border-l-4 ${
                  booking.status === 'cancelled'
                    ? 'border-red-400 opacity-70'
                    : 'border-green-500'
                }`}
              >
                <div className="flex justify-between items-start flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{sportIcon[booking.sport]}</span>
                    <div>
                      <p className="font-bold text-gray-800">{booking.sport}</p>
                      <p className="text-sm text-gray-500">{booking.venue}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    booking.status === 'confirmed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {booking.status === 'confirmed' ? '✅ Confirmed' : '❌ Cancelled'}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-sm">
                  <div>
                    <p className="text-gray-400">Booking ID</p>
                    <p className="font-mono font-bold text-green-700">{booking.bookingId}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Date</p>
                    <p className="font-medium">{booking.date}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Time</p>
                    <p className="font-medium">{booking.time}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Amount</p>
                    <p className="font-bold text-lg text-green-700">₹{booking.price}</p>
                  </div>
                </div>

                {booking.status === 'confirmed' && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleCancel(booking)}
                      className="text-red-500 border border-red-300 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-red-50 transition"
                    >
                      Cancel Booking
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}