// pages/admin/ProjectFormPage.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProjectForm from './ProjectForm';
import axiosClient from '../../axios';
import { Loader } from 'lucide-react';

export default function ProjectFormPage() {
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      axiosClient.get(`/projects/${id}`)
        .then(res => setInitialData(res.data.project))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader className='w-16 h-16 animate-spin'/>
      </div>
    );
  }

  return <ProjectForm initialData={initialData} />;
}
