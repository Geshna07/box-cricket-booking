import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Admin() {
  const [tab, setTab] = useState('dashboard')
  const [bookings, setBookings] = useState([])
  const [users, setUsers] = useState([])
  const [slots, setSlots] = useState([])
  const [newSlot, setNewSlot] = useState({
    date: '', time: '', sport: 'Box Cricket', price: '', venue: 'Ground A'
  })
  const [slotMsg, setSlotMsg] = useState('')
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  useEffect(() => {
    if (!user?.isAdmin) { navigate('/login'); return }
    axios.get('http://localhost:5000/bookings').then(r => setBookings(r.data))
    axios.get('http://localhost:5000/users').then(r => setUsers(r.data))
    axios.get('http://localhost:5000/slots').then(r => setSlots(r.data))
  }, [])

  const handleCancelBooking = async (booking) => {
    if (!window.confirm(`Cancel booking ${booking.bookingId}?`)) return
    await axios.patch(`http://localhost:5000/bookings/${booking.id}`, { status: 'cancelled' })
    await axios.patch(`http://localhost:5000/slots/${booking.slotId}`, { isBooked: false })
    setBookings(prev => prev.map(b => b.id === booking.id ? { ...b, status: 'cancelled' } : b))
  }

  const handleAddSlot = async (e) => {
    e.preventDefault()
    if (!newSlot.date || !newSlot.time || !newSlot.price) {
      setSlotMsg('Please fill all fields.')
      return
    }
    await axios.post('http://localhost:5000/slots', {
      ...newSlot,
      price: parseInt(newSlot.price),
      isBooked: false,
      id: 'slot' + Date.now()
    })
    setSlotMsg('✅ Slot added successfully!')
    setNewSlot({ date: '', time: '', sport: 'Box Cricket', price: '', venue: 'Ground A' })
    const res = await axios.get('http://localhost:5000/slots')
    setSlots(res.data)
    setTimeout(() => setSlotMsg(''), 3000)
  }

  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + b.price, 0)
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length
  const todayStr = new Date().toISOString().split('T')[0]
  const todayBookings = bookings.filter(b => b.date === todayStr).length
  const availableSlots = slots.filter(s => !s.isBooked).length

  // Revenue by sport for chart
  const sports = ['Box Cricket', 'Badminton', 'Football']
  const revenueBySort = sports.map(sport => ({
    sport,
    revenue: bookings
      .filter(b => b.sport === sport && b.status === 'confirmed')
      .reduce((sum, b) => sum + b.price, 0)
  }))
  const maxRev = Math.max(...revenueBySort.map(r => r.revenue), 1)

  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'bookings', label: '📋 Bookings' },
    { id: 'addslot', label: '➕ Add Slot' },
    { id: 'users', label: '👥 Users' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-green-700">Admin Panel</h1>
          <p className="text-xs text-gray-400">BoxCricket Management System</p>
        </div>
        <span className="text-sm text-gray-500">👋 {user?.name}</span>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b px-6 flex gap-1 overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap ${
              tab === t.id
                ? 'border-green-600 text-green-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* DASHBOARD TAB */}
        {tab === 'dashboard' && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Bookings', value: bookings.length, color: 'text-green-700', bg: 'bg-green-50' },
                { label: 'Confirmed', value: confirmedBookings, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: "Today's Bookings", value: todayBookings, color: 'text-purple-600', bg: 'bg-purple-50' },
                { label: 'Total Revenue', value: `₹${totalRevenue}`, color: 'text-orange-600', bg: 'bg-orange-50' }
              ].map(card => (
                <div key={card.label} className={`${card.bg} rounded-2xl p-5 shadow text-center`}>
                  <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
                  <p className="text-gray-500 text-sm mt-1">{card.label}</p>
                </div>
              ))}
            </div>

            {/* Revenue Chart */}
            <div className="bg-white rounded-2xl shadow p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-700 mb-6">Revenue by Sport</h2>
              <div className="flex items-end gap-8 justify-center h-48">
                {revenueBySort.map(({ sport, revenue }) => {
                  const height = maxRev > 0 ? Math.max((revenue / maxRev) * 160, 8) : 8
                  const colors = {
                    'Box Cricket': 'bg-green-500',
                    'Badminton': 'bg-blue-500',
                    'Football': 'bg-orange-500'
                  }
                  return (
                    <div key={sport} className="flex flex-col items-center gap-2">
                      <span className="text-sm font-bold text-gray-700">₹{revenue}</span>
                      <div
                        className={`w-16 rounded-t-lg ${colors[sport]} transition-all duration-700`}
                        style={{ height: `${height}px` }}
                      ></div>
                      <span className="text-xs text-gray-500 text-center">{sport}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl shadow p-5">
                <h3 className="font-bold text-gray-700 mb-3">Slot Overview</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Slots</span>
                    <span className="font-bold">{slots.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Available</span>
                    <span className="font-bold text-green-600">{availableSlots}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Booked</span>
                    <span className="font-bold text-red-500">{slots.length - availableSlots}</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow p-5">
                <h3 className="font-bold text-gray-700 mb-3">User Overview</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Users</span>
                    <span className="font-bold">{users.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Admins</span>
                    <span className="font-bold text-purple-600">{users.filter(u => u.isAdmin).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Customers</span>
                    <span className="font-bold text-blue-600">{users.filter(u => !u.isAdmin).length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BOOKINGS TAB */}
        {tab === 'bookings' && (
          <div>
            <h2 className="text-xl font-bold text-gray-700 mb-4">All Bookings ({bookings.length})</h2>
            <div className="bg-white rounded-2xl shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-green-700 text-white">
                    <tr>
                      {['Booking ID', 'Customer', 'Sport', 'Date', 'Time', 'Amount', 'Status', 'Action'].map(h => (
                        <th key={h} className="px-4 py-3 text-left whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.length === 0 ? (
                      <tr><td colSpan="8" className="text-center py-10 text-gray-400">No bookings yet</td></tr>
                    ) : bookings.map((b, i) => (
                      <tr key={b.id} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="px-4 py-3 font-mono text-green-700 text-xs">{b.bookingId}</td>
                        <td className="px-4 py-3">
                          <p className="font-medium">{b.userName}</p>
                          <p className="text-xs text-gray-400">{b.userPhone}</p>
                        </td>
                        <td className="px-4 py-3">{b.sport}</td>
                        <td className="px-4 py-3">{b.date}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{b.time}</td>
                        <td className="px-4 py-3 font-bold text-green-700">₹{b.price}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            b.status === 'confirmed'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-600'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {b.status === 'confirmed' && (
                            <button
                              onClick={() => handleCancelBooking(b)}
                              className="text-red-500 border border-red-300 px-3 py-1 rounded-lg text-xs hover:bg-red-50 transition"
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ADD SLOT TAB */}
        {tab === 'addslot' && (
          <div className="max-w-lg">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Add New Slot</h2>
            <div className="bg-white rounded-2xl shadow p-6">
              {slotMsg && (
                <div className={`rounded-lg px-4 py-3 text-sm mb-4 ${
                  slotMsg.startsWith('✅')
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-600 border border-red-200'
                }`}>
                  {slotMsg}
                </div>
              )}
              <form onSubmit={handleAddSlot} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400"
                    value={newSlot.date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => setNewSlot({ ...newSlot, date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot</label>
                  <select
                    className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400"
                    value={newSlot.time}
                    onChange={e => setNewSlot({ ...newSlot, time: e.target.value })}
                    required
                  >
                    <option value="">Select time</option>
                    {[
                      '05:00 AM - 06:00 AM', '06:00 AM - 07:00 AM',
                      '07:00 AM - 08:00 AM', '08:00 AM - 09:00 AM',
                      '09:00 AM - 10:00 AM', '04:00 PM - 05:00 PM',
                      '05:00 PM - 06:00 PM', '06:00 PM - 07:00 PM',
                      '07:00 PM - 08:00 PM', '08:00 PM - 09:00 PM',
                      '09:00 PM - 10:00 PM'
                    ].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sport</label>
                  <select
                    className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400"
                    value={newSlot.sport}
                    onChange={e => setNewSlot({ ...newSlot, sport: e.target.value })}
                  >
                    <option>Box Cricket</option>
                    <option>Badminton</option>
                    <option>Football</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                  <select
                    className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400"
                    value={newSlot.venue}
                    onChange={e => setNewSlot({ ...newSlot, venue: e.target.value })}
                  >
                    <option>Ground A</option>
                    <option>Ground C</option>
                    <option>Court B</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 600"
                    className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400"
                    value={newSlot.price}
                    onChange={e => setNewSlot({ ...newSlot, price: e.target.value })}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-700 text-white py-2.5 rounded-xl font-bold hover:bg-green-800 transition"
                >
                  ➕ Add Slot
                </button>
              </form>
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {tab === 'users' && (
          <div>
            <h2 className="text-xl font-bold text-gray-700 mb-4">All Users ({users.length})</h2>
            <div className="bg-white rounded-2xl shadow overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-green-700 text-white">
                  <tr>
                    {['Name', 'Email', 'Phone', 'Role'].map(h => (
                      <th key={h} className="px-4 py-3 text-left">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u.id} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-4 py-3 font-medium">{u.name}</td>
                      <td className="px-4 py-3 text-gray-500">{u.email}</td>
                      <td className="px-4 py-3">{u.phone}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          u.isAdmin
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {u.isAdmin ? '⚙️ Admin' : '👤 Customer'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}