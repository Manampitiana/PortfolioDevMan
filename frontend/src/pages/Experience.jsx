import { motion } from 'framer-motion';
import { CalendarIcon, BriefcaseIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import axiosClient from '../axios';
import WindowFrame from '../components/os/WindowFrame';

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
        <section className="relative py-20 sm:py-24 px-4 sm:px-6 bg-neutral-950 border-t border-white/5 overflow-hidden">
            {/* Aurora ambient */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute top-0 left-1/3 w-96 h-96 bg-cyan-500/[0.06] rounded-full blur-3xl" />
                <div className="absolute bottom-0 -right-20 w-96 h-96 bg-fuchsia-500/[0.06] rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-6xl mx-auto">
                <WindowFrame title="Experience" breadcrumb="Accueil > Expérience" bodyClassName="p-6 sm:p-10">

                {/* En-tête de la section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <p className="text-[11px] font-mono tracking-widest text-cyan-300 mb-3">PARCOURS</p>
                    <h2 className="font-display text-3xl md:text-4xl font-semibold text-white mb-4">
                        Mon <span className="bg-gradient-to-r from-cyan-300 to-fuchsia-300 bg-clip-text text-transparent">Parcours</span> Professionnel
                    </h2>
                    <p className="text-neutral-400 max-w-2xl mx-auto">
                        Découvrez les étapes clés et les expériences acquises au fil de ma carrière.
                    </p>
                </motion.div>

                {/* Timeline — rail à gauche, identique sur tous les écrans */}
                <div className="relative pl-10 sm:pl-14">
                    {/* Ligne verticale */}
                    <div className="absolute left-[11px] sm:left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-cyan-400/50 via-white/10 to-fuchsia-400/50" />

                    <div className="space-y-8">
                        {experiences.map((exp, index) => (
                            <motion.div
                                key={exp.id || index}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="relative group"
                            >
                                {/* Point de la Timeline */}
                                <span className="absolute -left-10 sm:-left-14 top-6 flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-neutral-950 border border-cyan-400/40">
                                    <motion.span
                                        animate={{ scale: [1, 1.3, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="w-2 h-2 rounded-full bg-gradient-to-br from-cyan-400 to-fuchsia-400"
                                    />
                                </span>

                                {/* Card */}
                                <div className="relative rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-400/25 p-6 sm:p-8 transition-colors duration-300">
                                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-cyan-400/10 to-fuchsia-400/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    <div className="relative flex items-start justify-between gap-3 flex-wrap mb-3">
                                        <div>
                                            <h3 className="text-lg sm:text-xl font-display font-semibold text-white mb-1">
                                                {exp.title}
                                            </h3>
                                            <p className="text-cyan-300 text-sm font-medium">{exp.company}</p>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-500 bg-white/5 border border-white/10 rounded-full px-3 py-1 shrink-0">
                                            <CalendarIcon className="w-3.5 h-3.5" />
                                            <span className="capitalize">
                                                {formatDate(exp.start_date)} – {exp.is_current ? "Aujourd'hui" : formatDate(exp.end_date)}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="relative text-sm text-neutral-400 leading-relaxed">
                                        {exp.description}
                                    </p>

                                    {/* Technologies */}
                                    {exp.technologies?.length > 0 && (
                                        <div className="relative flex flex-wrap gap-2 mt-5">
                                            {exp.technologies.map((tech, i) => (
                                                <span
                                                    key={i}
                                                    className="inline-block text-[11px] font-mono px-2.5 py-1 rounded-full
                                                        bg-white/5 border border-white/10 text-neutral-400
                                                        transition-colors duration-300
                                                        hover:border-cyan-400/40 hover:text-cyan-200"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
                </WindowFrame>
            </div>
        </section>
    );
}