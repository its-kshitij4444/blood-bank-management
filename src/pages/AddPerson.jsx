import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { supabase } from '../lib/supabase'

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']

export default function AddPerson() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    try {
      const { error } = await supabase
        .from('person')
        .insert([{
          name: data.name,
          phone: data.phone,
          gender: data.gender,
          dob: data.dob,
          blood_group: data.blood_group,
          address: data.address,
          med_issues: data.med_issues || null
        }])

      if (error) throw error

      toast.success('Person added successfully')
      reset()
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Add Person</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            {...register('name', { required: 'Name is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            {...register('phone', { 
              required: 'Phone number is required',
              pattern: {
                value: /^\d{10}$/,
                message: 'Please enter a valid 10-digit phone number'
              }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <div className="mt-2 space-y-2">
            <div className="flex items-center">
              <input
                type="radio"
                {...register('gender', { required: 'Gender is required' })}
                value="m"
                className="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300"
              />
              <label className="ml-3 block text-sm font-medium text-gray-700">Male</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                {...register('gender')}
                value="f"
                className="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300"
              />
              <label className="ml-3 block text-sm font-medium text-gray-700">Female</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                {...register('gender')}
                value="o"
                className="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300"
              />
              <label className="ml-3 block text-sm font-medium text-gray-700">Other</label>
            </div>
          </div>
          {errors.gender && (
            <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
          <input
            type="date"
            {...register('dob', { required: 'Date of birth is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          />
          {errors.dob && (
            <p className="mt-1 text-sm text-red-600">{errors.dob.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Blood Group</label>
          <select
            {...register('blood_group', { required: 'Blood group is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          >
            <option value="">Select blood group</option>
            {bloodGroups.map(group => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
          {errors.blood_group && (
            <p className="mt-1 text-sm text-red-600">{errors.blood_group.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <textarea
            {...register('address', { required: 'Address is required' })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Medical Issues (if any)</label>
          <textarea
            {...register('med_issues')}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Register Person
          </button>
        </div>
      </form>
    </div>
  )
}