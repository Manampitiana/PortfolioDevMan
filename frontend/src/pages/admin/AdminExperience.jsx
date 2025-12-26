import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import axiosClient from '../../axios';
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { Loader } from 'lucide-react';

export default function AdminExperience() {
  const navigate = useNavigate()
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get('/experiences');
      setExperiences(response.data.experiences);
    } catch (error) {
      console.error('Error fetching experiences:', error);
    }finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this experience?')) return;
    const response = await axiosClient.delete(`/experiences/${id}`);
    toast.success( response.data.message || 'Experience deleted successfully!!!');
    fetchExperiences();
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      year: 'numeric',
    }).format(new Date(date));
  }

  // if (loading) {
  //   return (
     
  //   );
  // }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Experiences</h1>
        <button
          onClick={() => navigate('/admin/add_experiences')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
        >
          <PlusIcon className="h-5 w-5" />
          Add Experience
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-[50vh]">
          <Loader className='w-16 h-16 animate-[spin_1.5s_linear_infinite]' />
        </div>
      ) :(
      <div className="bg-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm text-gray-300">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Period</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Company</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {experiences.map((exp) => (
              <tr key={exp.id} className="border-t border-gray-700">
                <td className="px-4 py-3">
                  {formatDate(exp.start_date)} –{' '}
                  {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                </td>
                <td className="px-4 py-3">{exp.title}</td>
                <td className="px-4 py-3">{exp.company}</td>
                <td className="px-4 py-3">{exp.type}</td>
                <td
                  className={`px-4 py-3 ${exp.is_active ? 'text-green-400' : 'text-red-400'
                    }`}
                >
                  {exp.is_active ? 'Visible' : 'Hidden'}
                </td>
                <td className="px-4 py-3 text-right flex justify-end gap-3">
                  <PencilSquareIcon
                    onClick={() => navigate(`/admin/edit_experiences/${exp.id}`)}
                    className="h-5 w-5 text-yellow-400 cursor-pointer"
                  />
                  <TrashIcon
                    onClick={() => handleDelete(exp.id)}
                    className="h-5 w-5 text-red-400 cursor-pointer"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
}
