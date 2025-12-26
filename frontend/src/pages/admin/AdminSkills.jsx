import { PlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../axios';
import { Loader } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminSkills() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState([]);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get('/skills');
      setSkills(response.data.skills);
      setLoading(false); // Aorian'ny fetch
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  }

  useEffect(() => {
    fetchSkills();
  }, []);


  const handleDelete = async (id) => {
    if (!confirm('Delete this skill?')) return;
    const response = await axiosClient.delete(`/skills/${id}`);
    toast.success( response.data.message || 'Skill deleted successfully!!!');
    fetchSkills();
  };


  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Skills</h1>
        <button onClick={() => navigate('/admin/add_skills')} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white">
          <PlusIcon className="h-5 w-5" />
          Add Skill
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center h-[50vh]">
          <Loader className='w-16 h-16 animate-[spin_1.5s_linear_infinite]' />
        </div>
      ) : (
      <div className="bg-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm text-gray-300">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Logo</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Level</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {skills.map((skill, index) => (
              <tr key={index} className="border-t border-gray-700">
                <td className="px-4 py-3">
                  <img src={`http://localhost:8000/storage/${skill.logo}`} alt={skill.name} className='w-12 h-12 object-cover' />
                </td>
                <td className="px-4 py-3">{skill.name}</td>
                <td className="px-4 py-3">{skill.category}</td>
                <td className="px-4 py-3">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${skill.level}%` }} />
                  </div>
                </td>
                <td className={`px-4 py-3 ${Number(skill.is_active) === 1 ? 'text-green-400' : 'text-red-400'}`}>
                  {Number(skill.is_active) === 1 ? 'Visible' : 'Hidden'}
                </td>
                <td className="px-4 py-3 text-right flex justify-end gap-3">
                  <PencilSquareIcon onClick={() => navigate(`/admin/edit_skills/${skill.id}`)} className="h-5 w-5 text-yellow-400 cursor-pointer" />
                  <TrashIcon onClick={() => handleDelete(skill.id)} className="h-5 w-5 text-red-400 cursor-pointer" />
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
