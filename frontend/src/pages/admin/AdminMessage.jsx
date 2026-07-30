import { useEffect, useState } from 'react';
import { EnvelopeIcon, TrashIcon, EyeIcon, ClockIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import axiosClient from '../../axios';
import toast from 'react-hot-toast';
import { useOutletContext } from "react-router-dom";
import { Loader } from 'lucide-react';

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function AdminMessage() {
    const { setUnreadCount } = useOutletContext();

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [replyText, setReplyText] = useState("");
    const [sending, setSending] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get('/messages');
            setMessages(Array.isArray(response.data) ? response.data : response.data.messages || []);
        } catch (error) {
            console.error('Erreur lors de la récupération des messages :', error);
            toast.error('Impossible de charger les messages.');
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (msg) => {
        if (msg.is_read) return;

        try {
            await axiosClient.put(`/messages/${msg.id}`);
            setMessages(prevMessages =>
                prevMessages.map(m => m.id === msg.id ? { ...m, is_read: true } : m)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Erreur lors du marquage comme lu :', error);
        }
    };

    const handleReply = async (e) => {
        e.preventDefault();
        if (!replyText.trim()) return toast.error("Écrivez une réponse avant d'envoyer !");

        setSending(true);
        try {
            await axiosClient.post(`/messages/${selectedMessage.id}/reply`, {
                message: replyText,
                email: selectedMessage.email
            });

            toast.success('Réponse envoyée avec succès !');
            setReplyText("");
            setSelectedMessage(null);
        } catch (error) {
            console.error('Erreur lors de l\'envoi de la réponse :', error);
            toast.error("Échec de l'envoi de la réponse.");
        } finally {
            setSending(false);
        }
    };

    // "wasRead" doit venir du message lui-même, sinon le compteur de non-lus
    // se décrémente à tort même quand un message déjà lu est supprimé
    const deleteMessage = async (id, wasRead) => {
        if (!window.confirm('Supprimer ce message ? Cette action est irréversible.')) return;

        setDeletingId(id);
        try {
            await axiosClient.delete(`/messages/${id}`);
            setMessages(prev => prev.filter(m => m.id !== id));

            if (!wasRead) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }

            toast.success('Message supprimé !');
        } catch (error) {
            console.error('Erreur lors de la suppression du message :', error);
            toast.error('Échec de la suppression du message.');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-950 p-4 sm:p-6">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
                >
                    <h1 className="font-display text-3xl md:text-4xl font-semibold text-white flex items-center gap-3">
                        <EnvelopeIcon className="w-8 h-8 text-cyan-300" />
                        Messages reçus
                    </h1>
                    <span className="bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 px-4 py-1.5 rounded-full text-sm font-medium w-fit">
                        {messages.length} message{messages.length !== 1 ? 's' : ''}
                    </span>
                </motion.div>

                {loading ? (
                    <div className="flex items-center justify-center h-screen">
                        <Loader className="w-10 h-10 text-cyan-300 animate-[spin_1.5s_linear_infinite]" />
                    </div>
                ) : messages.length === 0 ? (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                        className="text-center py-20 bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-2xl"
                    >
                        <EnvelopeIcon className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
                        <p className="text-neutral-400 text-sm">Aucun message reçu pour le moment.</p>
                    </motion.div>
                ) : (
                    <div className="grid gap-3">
                        {messages.map((msg, index) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, x: -12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.35, delay: index * 0.04 }}
                                className={`p-4 sm:p-5 rounded-2xl border backdrop-blur-xl transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${msg.is_read
                                        ? 'bg-white/[0.02] border-white/10'
                                        : 'bg-white/[0.04] border-cyan-400/30 shadow-lg shadow-cyan-500/5'
                                    }`}
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-semibold text-white truncate">{msg.name}</h3>
                                        {!msg.is_read && <span className="w-2 h-2 bg-cyan-400 rounded-full flex-shrink-0" />}
                                    </div>
                                    <p className="text-sm text-cyan-300 font-medium mb-2 truncate">{msg.subject}</p>
                                    <div className="flex items-center text-xs text-neutral-500 gap-4 flex-wrap">
                                        <span className="flex items-center">
                                            <ClockIcon className="w-3 h-3 mr-1" />
                                            {new Date(msg.created_at).toLocaleDateString('fr-FR')}
                                        </span>
                                        <span className="font-mono truncate">{msg.email}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 w-full md:w-auto">
                                    <button
                                        onClick={() => { setSelectedMessage(msg); markAsRead(msg); }}
                                        className="flex-1 md:flex-none px-3 py-2 bg-cyan-400/10 text-cyan-300 rounded-lg hover:bg-cyan-400/20 transition-colors flex justify-center items-center gap-2"
                                    >
                                        <EyeIcon className="w-4 h-4" /> <span className="md:hidden text-sm">Lire</span>
                                    </button>
                                    <button
                                        onClick={() => deleteMessage(msg.id, msg.is_read)}
                                        disabled={deletingId === msg.id}
                                        className="flex-1 md:flex-none px-3 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors flex justify-center items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        {deletingId === msg.id ? (
                                            <Loader className="w-4 h-4 animate-[spin_1.5s_linear_infinite]" />
                                        ) : (
                                            <TrashIcon className="w-4 h-4" />
                                        )}
                                        <span className="md:hidden text-sm">Supprimer</span>
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* MODAL POUR LIRE ET RÉPONDRE AU MESSAGE */}
            <AnimatePresence>
                {selectedMessage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedMessage(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 16, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 16, scale: 0.98 }}
                            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-neutral-900/95 border border-white/10 backdrop-blur-2xl w-full max-w-2xl rounded-2xl shadow-2xl shadow-black/40 overflow-hidden max-h-[90vh] flex flex-col"
                        >
                            <div className="p-5 sm:p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                                <h2 className="text-lg sm:text-xl font-bold text-white truncate pr-4">
                                    Message de {selectedMessage.name}
                                </h2>
                                <button
                                    onClick={() => setSelectedMessage(null)}
                                    className="text-neutral-400 hover:text-white transition-colors flex-shrink-0"
                                >
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-5 sm:p-8 overflow-y-auto flex-1">
                                <div className="mb-6">
                                    <span className="text-xs text-neutral-500 uppercase font-bold tracking-wider">Sujet</span>
                                    <p className="text-lg font-semibold text-cyan-300 mt-1">{selectedMessage.subject}</p>
                                </div>
                                <div className="mb-6">
                                    <span className="text-xs text-neutral-500 uppercase font-bold tracking-wider">Message reçu</span>
                                    <p className="text-neutral-300 leading-relaxed whitespace-pre-wrap mt-2 p-4 bg-white/[0.03] border border-white/5 rounded-xl">
                                        {selectedMessage.message}
                                    </p>
                                </div>

                                {/* SECTION RÉPONSE */}
                                <div className="mt-8 pt-6 border-t border-white/10">
                                    <label htmlFor="reply" className="block text-sm font-medium text-neutral-400 mb-2">
                                        Répondre à ({selectedMessage.email})
                                    </label>
                                    <textarea
                                        id="reply"
                                        rows="4"
                                        className="w-full p-4 rounded-xl bg-white/[0.04] border border-white/10 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/30 text-white placeholder:text-neutral-500 outline-none transition-all"
                                        placeholder="Écrivez votre réponse ici..."
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="p-4 bg-white/[0.02] border-t border-white/10 flex flex-col-reverse sm:flex-row justify-end gap-3">
                                <button
                                    onClick={() => setSelectedMessage(null)}
                                    className="px-5 py-2.5 rounded-xl border border-white/10 text-neutral-300 hover:text-white hover:bg-white/[0.04] transition-colors"
                                >
                                    Fermer
                                </button>
                                <button
                                    onClick={handleReply}
                                    disabled={sending}
                                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white font-semibold shadow-lg shadow-fuchsia-500/10 hover:shadow-fuchsia-500/20 hover:opacity-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {sending && <Loader className="w-4 h-4 animate-[spin_1.5s_linear_infinite]" />}
                                    {sending ? 'Envoi...' : 'Envoyer la réponse'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}