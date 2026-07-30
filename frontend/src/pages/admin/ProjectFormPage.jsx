// pages/admin/ProjectFormPage.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProjectForm from './ProjectForm';
import axiosClient from '../../axios';
import { Loader } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProjectFormPage() {
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    if (id) {
      setLoading(true);
      axiosClient.get(`/projects/${id}`)
        .then(res => setInitialData(res.data.project))
        .catch(err => {
          console.error('Erreur lors de la récupération du projet :', err);
          toast.error('Impossible de charger les données du projet.');
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh] bg-neutral-950">
        <Loader className="w-10 h-10 text-cyan-300 animate-[spin_1.5s_linear_infinite]" />
      </div>
    );
  }

  return <ProjectForm id={id} initialData={initialData} />;
}