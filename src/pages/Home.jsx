import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [stats, setStats] = useState({
    totalPersons: 0,
    totalDonations: 0,
    totalReceives: 0,
  })

  useEffect(() => {
    async function fetchStats() {
      const [
        { count: personsCount },
        { count: donationsCount },
        { count: receivesCount },
      ] = await Promise.all([
        supabase.from('person').select('*', { count: 'exact', head: true }),
        supabase.from('donation').select('*', { count: 'exact', head: true }),
        supabase.from('receive').select('*', { count: 'exact', head: true }),
      ])

      setStats({
        totalPersons: personsCount,
        totalDonations: donationsCount,
        totalReceives: receivesCount,
      })
    }

    fetchStats()
  }, [])

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Blood Bank Management System
      </h1>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900">
            System Overview
          </h2>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Total Registered Persons
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {stats.totalPersons}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Total Donations
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {stats.totalDonations}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Total Receives
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {stats.totalReceives}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="prose max-w-none">
        <h2 className='font-bold text-2xl'>About the System</h2>
        <p className='mb-2'>
          The Blood Bank Management System is a comprehensive solution for managing blood donation
          and distribution. It helps track donors, recipients, and maintain accurate blood stock
          levels. The system ensures efficient management of blood inventory and facilitates
          quick access to donor and recipient information.
        </p>
        
        <h2 className='font-bold text-2xl'>Key Features</h2>
        <ul>
          <li>Donor and recipient registration and management</li>
          <li>Blood donation tracking</li>
          <li>Blood stock management</li>
          <li>Donation and receiving history</li>
          <li>Secure user authentication</li>
          <li>Real-time stock updates</li>
        </ul>
      </div>
    </div>
  )
}