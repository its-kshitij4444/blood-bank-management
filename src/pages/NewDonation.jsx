import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from 'react-toastify';

function NewDonation() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    pid: '',
    units: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('donation')
        .insert([{
          person_id: formData.pid,
          quantity: parseInt(formData.units),
          donation_date: new Date().toISOString().split('T')[0],
          donation_time: new Date().toLocaleTimeString()
        }]);

      if (error) throw error;

      toast.success('Donation successfully recorded');
      navigate('/donation-history');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">New Donation</h2>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div>
          <label htmlFor="pid" className="block text-sm font-medium text-gray-700">
            Personal ID
          </label>
          <input
            type="text"
            id="pid"
            name="pid"
            value={formData.pid}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            required
          />
        </div>

        <div>
          <label htmlFor="units" className="block text-sm font-medium text-gray-700">
            Units of Blood Donated
          </label>
          <input
            type="number"
            id="units"
            name="units"
            min="1"
            value={formData.units}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
        >
          {loading ? 'Recording...' : 'Record Donation'}
        </button>
      </form>
    </div>
  );
}

export default NewDonation;