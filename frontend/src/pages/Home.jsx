import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-700 to-green-900 text-white py-24 px-6 text-center">
        <h1 className="text-5xl font-bold mb-4">Premier Sports Arena</h1>
        <p className="text-xl opacity-90 mb-2">Hyderabad's #1 Box Cricket & Sports Venue</p>
        <p className="text-md opacity-75 mb-10">
          No more WhatsApp bookings. Check availability, pick your time, confirm instantly.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link
            to="/slots"
            className="bg-white text-green-700 font-bold px-8 py-3 rounded-lg text-lg hover:bg-green-100 transition shadow-lg"
          >
            Book a Slot →
          </Link>
          <Link
            to="/register"
            className="border-2 border-white text-white font-bold px-8 py-3 rounded-lg text-lg hover:bg-green-600 transition"
          >
            Register Free
          </Link>
        </div>
      </div>

      {/* Sports Offered */}
      <div className="max-w-5xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Sports We Offer</h2>
        <p className="text-center text-gray-500 mb-10">World-class facilities for every sport</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-8 shadow text-center hover:shadow-lg transition">
            <div className="text-6xl mb-4">🏏</div>
            <h3 className="font-bold text-xl mb-2 text-green-700">Box Cricket</h3>
            <p className="text-gray-500 text-sm mb-3">Professional turf with floodlights. Perfect for corporate and friend groups.</p>
            <p className="font-bold text-green-700">₹400 - ₹800 / hr</p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow text-center hover:shadow-lg transition">
            <div className="text-6xl mb-4">🏸</div>
            <h3 className="font-bold text-xl mb-2 text-blue-600">Badminton</h3>
            <p className="text-gray-500 text-sm mb-3">4 synthetic courts with professional nets. Available morning and evening.</p>
            <p className="font-bold text-blue-600">₹300 - ₹400 / hr</p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow text-center hover:shadow-lg transition">
            <div className="text-6xl mb-4">⚽</div>
            <h3 className="font-bold text-xl mb-2 text-orange-600">Football</h3>
            <p className="text-gray-500 text-sm mb-3">Full-size turf ground with goal posts. Great for 5-a-side matches.</p>
            <p className="font-bold text-orange-600">₹600 - ₹700 / hr</p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-green-50 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Why Book With Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="bg-white rounded-xl p-6 shadow">
              <div className="text-4xl mb-3">📅</div>
              <h3 className="font-bold mb-1">Real-time Slots</h3>
              <p className="text-gray-500 text-sm">See live availability. No calls needed.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="font-bold mb-1">Instant Booking</h3>
              <p className="text-gray-500 text-sm">Get confirmed booking ID instantly.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow">
              <div className="text-4xl mb-3">❌</div>
              <h3 className="font-bold mb-1">Easy Cancellation</h3>
              <p className="text-gray-500 text-sm">Cancel anytime from My Bookings.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow">
              <div className="text-4xl mb-3">🔒</div>
              <h3 className="font-bold mb-1">Secure & Safe</h3>
              <p className="text-gray-500 text-sm">Your data is always protected.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Venue Info */}
      <div className="max-w-5xl mx-auto py-16 px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Visit Us</h2>
          <div className="space-y-3 text-gray-600">
            <p>📍 <strong>Address:</strong> Gachibowli, Hyderabad, Telangana - 500032</p>
            <p>⏰ <strong>Hours:</strong> 5:00 AM – 11:00 PM (All days)</p>
            <p>📞 <strong>Phone:</strong> +91 98765 43210</p>
            <p>📧 <strong>Email:</strong> hello@boxcricket.com</p>
            <p>🅿️ <strong>Parking:</strong> Free parking available</p>
          </div>
          <Link
            to="/slots"
            className="inline-block mt-6 bg-green-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-800 transition"
          >
            Check Available Slots →
          </Link>
        </div>
        <div className="bg-green-700 rounded-2xl p-8 text-white text-center">
          <div className="text-5xl mb-4">🏆</div>
          <h3 className="text-2xl font-bold mb-2">500+ Happy Teams</h3>
          <p className="opacity-80 mb-4">Trusted by corporate teams, colleges and cricket lovers across Hyderabad</p>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div>
              <p className="text-2xl font-bold">3</p>
              <p className="text-xs opacity-70">Sports</p>
            </div>
            <div>
              <p className="text-2xl font-bold">30+</p>
              <p className="text-xs opacity-70">Slots/Day</p>
            </div>
            <div>
              <p className="text-2xl font-bold">5★</p>
              <p className="text-xs opacity-70">Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-green-800 text-white text-center py-6 text-sm opacity-80">
        © 2026 BoxCricket Premier Arena, Hyderabad. All rights reserved.
      </footer>
    </div>
  )
}