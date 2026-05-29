import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

export default function Booking() {
  const { id } = useParams()
  const [booking, setBooking] = useState(null)

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/bookings/${id}`)
      .then(res => setBooking(res.data))
  }, [id])

  if (!booking) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-400 text-lg">Loading booking details...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">

        <div className="text-center mb-6">
          <div className="text-6xl mb-3">✅</div>
          <h1 className="text-2xl font-bold text-green-700">Booking Confirmed!</h1>
          <p className="text-gray-500 text-sm mt-1">
            Your slot has been successfully booked.
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 space-y-3 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">Booking ID</span>
            <span className="font-bold text-green-700 font-mono">{booking.bookingId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">Name</span>
            <span className="font-medium">{booking.userName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">Phone</span>
            <span className="font-medium">{booking.userPhone}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">Sport</span>
            <span className="font-medium">{booking.sport}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">Venue</span>
            <span className="font-medium">{booking.venue}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">Date</span>
            <span className="font-medium">{booking.date}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">Time</span>
            <span className="font-medium">{booking.time}</span>
          </div>
          <div className="flex justify-between items-center border-t border-green-200 pt-3">
            <span className="text-gray-600 font-medium">Amount Paid</span>
            <span className="font-bold text-2xl text-green-700">₹{booking.price}</span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => window.print()}
            className="w-full border-2 border-green-700 text-green-700 py-2.5 rounded-xl font-bold hover:bg-green-50 transition"
          >
            🖨️ Print Confirmation
          </button>
          <Link
            to="/slots"
            className="block w-full bg-green-700 text-white py-2.5 rounded-xl font-bold text-center hover:bg-green-800 transition"
          >
            Book Another Slot
          </Link>
          <Link
            to="/my-bookings"
            className="block text-center text-sm text-green-700 hover:underline mt-2"
          >
            View My Bookings →
          </Link>
        </div>
      </div>
    </div>
  )
}