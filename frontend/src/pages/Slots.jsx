import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Slots() {
  const [slots, setSlots] = useState([])
  const [filteredSlots, setFilteredSlots] = useState([])
  const [date, setDate] = useState('')
  const [sportFilter, setSportFilter] = useState('All')
  const [priceFilter, setPriceFilter] = useState('All')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  const fetchSlots = async (d) => {
    setLoading(true)
    const res = await axios.get(`http://localhost:5000/slots?date=${d}`)
    setSlots(res.data)
    setFilteredSlots(res.data)
    setLoading(false)
  }

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    setDate(today)
    fetchSlots(today)
  }, [])

  useEffect(() => {
    let result = [...slots]
    if (sportFilter !== 'All') {
      result = result.filter(s => s.sport === sportFilter)
    }
    if (priceFilter === 'Under 500') {
      result = result.filter(s => s.price < 500)
    } else if (priceFilter === '500-700') {
      result = result.filter(s => s.price >= 500 && s.price <= 700)
    } else if (priceFilter === 'Above 700') {
      result = result.filter(s => s.price > 700)
    }
    setFilteredSlots(result)
  }, [sportFilter, priceFilter, slots])

  const handleBook = async (slot) => {
    if (!user) { navigate('/login'); return }
    if (slot.isBooked) return
    const confirmed = window.confirm(
      `Confirm booking?\n\n🏟️ ${slot.sport} - ${slot.venue}\n⏰ ${slot.time}\n📅 ${slot.date}\n💰 ₹${slot.price}`
    )
    if (!confirmed) return

    await axios.patch(`http://localhost:5000/slots/${slot.id}`, { isBooked: true })

    const booking = {
      slotId: slot.id,
      userId: user.id,
      userName: user.name,
      userPhone: user.phone,
      date: slot.date,
      time: slot.time,
      sport: slot.sport,
      venue: slot.venue,
      price: slot.price,
      bookingId: 'BK' + Date.now(),
      status: 'confirmed',
      bookedAt: new Date().toISOString()
    }
    const res = await axios.post('http://localhost:5000/bookings', booking)
    navigate(`/booking/${res.data.id}`)
  }

  const sportIcon = { 'Box Cricket': '🏏', 'Badminton': '🏸', 'Football': '⚽' }
  const sportColor = {
    'Box Cricket': 'text-green-700',
    'Badminton': 'text-blue-600',
    'Football': 'text-orange-600'
  }

  const available = filteredSlots.filter(s => !s.isBooked).length
  const booked = filteredSlots.filter(s => s.isBooked).length

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="max-w-5xl mx-auto">

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-green-700">Book a Slot</h1>
          <p className="text-gray-500">Select your date, sport and time</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow p-5 mb-6 flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">📅 Date</label>
            <input
              type="date"
              value={date}
              min={new Date().toISOString().split('T')[0]}
              onChange={e => { setDate(e.target.value); fetchSlots(e.target.value) }}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">🏅 Sport</label>
            <select
              value={sportFilter}
              onChange={e => setSportFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option>All</option>
              <option>Box Cricket</option>
              <option>Badminton</option>
              <option>Football</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">💰 Price Range</label>
            <select
              value={priceFilter}
              onChange={e => setPriceFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option>All</option>
              <option>Under 500</option>
              <option>500-700</option>
              <option>Above 700</option>
            </select>
          </div>
          <div className="flex gap-4 ml-auto text-sm">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
              {available} Available
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-red-400 inline-block"></span>
              {booked} Booked
            </span>
          </div>
        </div>

        {/* Slots Grid */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-3">⏳</div>
            <p>Loading slots...</p>
          </div>
        ) : filteredSlots.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-3">📅</div>
            <p className="text-lg">No slots found for selected filters.</p>
            <p className="text-sm mt-1">Try changing the date or sport filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {filteredSlots.map(slot => (
              <div
                key={slot.id}
                className={`bg-white rounded-2xl shadow p-5 border-2 transition hover:shadow-lg ${
                  slot.isBooked ? 'border-red-100' : 'border-green-100 hover:border-green-400'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    slot.isBooked
                      ? 'bg-red-100 text-red-600'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {slot.isBooked ? '🔴 Booked' : '🟢 Available'}
                  </span>
                  <span className="text-xl font-bold text-gray-800">₹{slot.price}</span>
                </div>

                <div className="mb-3">
                  <p className="text-2xl mb-1">{sportIcon[slot.sport]}</p>
                  <p className={`font-bold text-lg ${sportColor[slot.sport]}`}>{slot.sport}</p>
                  <p className="text-gray-700 font-medium">{slot.time}</p>
                  <p className="text-gray-400 text-sm">📍 {slot.venue}</p>
                </div>

                <button
                  onClick={() => handleBook(slot)}
                  disabled={slot.isBooked}
                  className={`w-full py-2.5 rounded-xl font-bold text-sm transition ${
                    slot.isBooked
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-green-700 text-white hover:bg-green-800 active:scale-95'
                  }`}
                >
                  {slot.isBooked ? 'Not Available' : 'Book Now →'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}