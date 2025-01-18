import { useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import useAuth from './hooks/useAuth'
import Layout from './components/Layout'
import Login from './pages/Login'
import Home from './pages/Home'
import AddPerson from './pages/AddPerson'
import SearchPerson from './pages/SearchPerson'
import NewDonation from './pages/NewDonation'
import NewReceive from './pages/NewReceive'
import CheckStock from './pages/CheckStock'
import DonationHistory from './pages/DonationHistory'
import ReceivingHistory from './pages/ReceivingHistory'

function ProtectedRoute({ children }) {
  const { session } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!session) {
      navigate('/login')
    }
  }, [session, navigate])

  return session ? children : null
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Home />} />
        <Route path="add-person" element={<AddPerson />} />
        <Route path="search-person" element={<SearchPerson />} />
        <Route path="new-donation" element={<NewDonation />} />
        <Route path="new-receive" element={<NewReceive />} />
        <Route path="check-stock" element={<CheckStock />} />
        <Route path="donation-history" element={<DonationHistory />} />
        <Route path="receiving-history" element={<ReceivingHistory />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}