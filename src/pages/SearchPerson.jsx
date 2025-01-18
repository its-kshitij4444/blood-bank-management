import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { supabase } from '../lib/supabase'
import { format } from 'date-fns'

export default function SearchPerson() {
  const [person, setPerson] = useState(null)
  const [donations, setDonations] = useState([])
  const [receives, setReceives] = useState([])
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    try {
      // Fetch person details
      const { data: personData, error: personError } = await supabase
        .from('person')
        .select('*')
        .eq('id', data.id)
        .single()

      if (personError) throw personError
      if (!personData) {
        toast.error('Person not found')
        return
      }

      setPerson(personData)

      // Fetch donations
      const { data: donationData, error: donationError } = await supabase
        .from('donation')
        .select('*')
        .eq('person_id', data.id)
        .order('donation_date', { ascending: false })

      if (donationError) throw donationError
      setDonations(donationData)

      // Fetch receives
      const { data: receiveData, error: receiveError } = await supabase
        .from('receive')
        .select('*')
        .eq('person_id', data.id)
        .order('receive_date', { ascending: false })

      if (receiveError) throw receiveError
      setReceives(receiveData)

    } catch (error) {
      toast.error(error.message)
    }
  }

  const formatGender = (gender) => {
    switch (gender) {
      case 'm': return 'Male'
      case 'f': return 'Female'
      case 'o': return 'Other'
      default: return gender
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Search Person</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            {...register('id', { required: 'ID is required' })}
            placeholder="Enter Person ID"
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          />
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Search
          </button>
        </div>
        {errors.id && (
          <p className="mt-1 text-sm text-red-600">{errors.id.message}</p>
        )}
      </form>

      {person && (
        <div className="space-y-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg leading-6 font-medium text-gray-900">Person Information</h2>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{person.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="mt-1 text-sm text-gray-900">{person.phone}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Gender</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatGender(person.gender)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                  <dd className="mt-1 text-sm text-gray-900">{format(new Date(person.dob), 'PP')}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Blood Group</dt>
                  <dd className="mt-1 text-sm text-gray-900">{person.blood_group}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Address</dt>
                  <dd className="mt-1 text-sm text-gray-900">{person.address}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Medical Issues</dt>
                  <dd className="mt-1 text-sm text-gray-900">{person.med_issues || 'None'}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Donation History</h3>
            </div>
            <div className="border-t border-gray-200">
              {donations.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {donations.map((donation) => (
                      <tr key={donation.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {format(new Date(donation.donation_date), 'PP')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {donation.donation_time}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {donation.quantity} units
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="px-6 py-4 text-sm text-gray-500">No donations yet</p>
              )}
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Receiving History</h3>
            </div>
            <div className="border-t border-gray-200">
              {receives.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hospital</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {receives.map((receive) => (
                      <tr key={receive.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {format(new Date(receive.receive_date), 'PP')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {receive.receive_time}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {receive.quantity} units
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {receive.hospital}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="px-6 py-4 text-sm text-gray-500">No receives yet</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}