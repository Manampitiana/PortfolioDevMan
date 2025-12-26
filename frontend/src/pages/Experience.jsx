import { motion } from 'framer-motion';
import { CalendarIcon, BriefcaseIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import axiosClient from '../axios';

// Formatage de la date en français
const formatDate = (date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('fr-FR', {
        month: 'short',
        year: 'numeric',
    }).format(new Date(date));
};

export default function Experience() {
    const [experiences, setExperiences] = useState([]);

    useEffect(() => {
        fetchExperiences();
    }, []);

    const fetchExperiences = async () => {
        try {
            const response = await axiosClient.get('/fetch_experiences');
            setExperiences(response.data.experiences);
        } catch (error) {
            console.error('Erreur lors de la récupération des expériences :', error);
        }
    };

    return (
        <section className="py-20 pt-5 px-4 bg-gray-100 dark:bg-[var(--theme-color)]">
            <div className="max-w-6xl mx-auto">

                {/* En-tête de la section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-[var(--theme-color)] dark:text-white mb-4">
                        Mon <span className="text-blue-600">Parcours</span> Professionnel
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Découvrez les étapes clés et les expériences acquises au fil de ma carrière.
                    </p>
                </motion.div>

                <div className="relative">
                    {/* Ligne de la Timeline */}
                    <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>

                    <div className="space-y-6 md:space-y-0">
                        {experiences.map((exp, index) => (
                            <motion.div
                                key={exp.id || index}
                                initial={{ opacity: 0, y: 60 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.15 }}
                                className={`relative flex flex-col md:flex-row items-center gap-8
                                ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                            >

                                {/* Point de la Timeline */}
                                <motion.div
                                    animate={{ scale: [1, 1.35, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="
                                        hidden md:flex 
                                        absolute 
                                        left-1/2
                                        transform -translate-x-1/2
                                        w-4 h-4 
                                        bg-blue-600 
                                        rounded-full
                                        border-4 border-gray-100 dark:border-[var(--theme-color)]
                                        shadow-lg z-10
                                    "
                                />

                                {/* Contenu */}
                                <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'}`}>

                                    {/* Effet de lueur (Glow) */}
                                    <div className="relative group">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>

                                        <motion.div
                                            whileHover={{ y: -8, scale: 1.03 }}
                                            transition={{ type: 'spring', stiffness: 200 }}
                                            className="relative bg-white dark:bg-[var(--theme-color)] p-8 rounded-2xl
                                                 shadow-lg border border-gray-200 dark:border-gray-700
                                                 transition-all duration-300"
                                        >
                                            {/* Header de la carte */}
                                            <div className="mb-6">
                                                <div className={`flex items-center mb-3 ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'} justify-between`}>
                                                    <div className="flex items-center text-blue-600 text-sm font-medium">
                                                        <CalendarIcon className="w-4 h-4 mr-2" />
                                                        <span className="capitalize">
                                                            {formatDate(exp.start_date)} –{' '}
                                                            {exp.is_current ? 'Aujourd’hui' : formatDate(exp.end_date)}
                                                        </span>
                                                    </div>

                                                    <div className={`w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-md ${index % 2 === 0 ? 'md:ml-4' : 'md:mr-4 ml-4 md:ml-0'}`}>
                                                        <BriefcaseIcon className="w-4 h-4 text-white" />
                                                    </div>
                                                </div>

                                                <h3 className="text-xl md:text-2xl font-bold text-[var(--theme-color)] dark:text-white mb-1">
                                                    {exp.title}
                                                </h3>
                                                <p className="text-blue-600 font-semibold">
                                                    {exp.company}
                                                </p>
                                            </div>

                                            {/* Description */}
                                            <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
                                                {exp.description}
                                            </p>

                                            {/* Technologies */}
                                            {exp.technologies?.length > 0 && (
                                                <div className={`flex flex-wrap gap-2 mt-5 ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                                                    {exp.technologies.map((tech, i) => (
                                                        <span
                                                            key={i}
                                                            className="
                                                                inline-block text-xs font-medium px-3 py-1 rounded-full
                                                                bg-blue-100 text-blue-800
                                                                dark:bg-blue-900 dark:text-blue-300
                                                                transition-all duration-300
                                                                hover:bg-blue-600 hover:text-white hover:scale-110
                                                            "
                                                        >
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Espaceur */}
                                <div className="hidden md:block w-5/12"></div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}