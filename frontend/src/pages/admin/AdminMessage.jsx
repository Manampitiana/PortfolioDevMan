import { useEffect, useState } from 'react';
import { EnvelopeIcon, TrashIcon, EyeIcon, ClockIcon } from '@heroicons/react/24/outline';
import axiosClient from '../../axios';
import toast from 'react-hot-toast';
import { useOutletContext } from "react-router-dom"; // Nampiana ity
import { Loader } from 'lucide-react';

export default function AdminMessage() {
    // 1. Eto vao miantso an'ilay Context (tsy any ivelany)
    const { setUnreadCount } = useOutletContext();

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [replyText, setReplyText] = useState("");
    const [sending, setSending] = useState(false);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await axiosClient.get('/messages');
            setMessages(response.data);
        } catch (error) {
            console.error("Error fetching messages:", error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (msg) => {
        if (msg.is_read) return; // Raha efa voavaky dia tsy manao na inona na inona

        try {
            await axiosClient.put(`/messages/${msg.id}`); // Na /messages/${msg.id}/read

            // Ity no manao "update" ny UI nefa tsy mila refresh
            setMessages(prevMessages =>
                prevMessages.map(m => m.id === msg.id ? { ...m, is_read: true } : m)
            );

            // Ity no manova ny isa any amin'ny Sidebar/Navbar
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Error marking as read:", error);
        }
    };

    const handleReply = async (e) => {
        e.preventDefault();
        if (!replyText.trim()) return toast.error("Soraty ny valin-kafatra!");

        setSending(true);
        try {
            await axiosClient.post(`/messages/${selectedMessage.id}/reply`, {
                message: replyText,
                email: selectedMessage.email
            });

            toast.success('Lasa soa aman-tsara ny mailaka!');
            setReplyText("");
            setSelectedMessage(null);
        } catch (error) {
            console.error("Error sending email:", error);
            toast.error("Tsy lasa ny mailaka.");
        } finally {
            setSending(false);
        }
    };

    const deleteMessage = async (id, wasRead) => {
        if (window.confirm('Tena hovonoina ve ity hafatra ity?')) {
            try {
                await axiosClient.delete(`/messages/${id}`);
                setMessages(messages.filter(m => m.id !== id));

                // Raha mbola tsy voavaky ilay hafatra no voafafa, ampidiniho koa ny count
                if (!wasRead) {
                    setUnreadCount(prev => Math.max(0, prev - 1));
                }

                toast.success('Message supprimé!');
            } catch (error) {
                console.error("Error deleting message:", error);
            }
        }
    };

    return (
        <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen pt-10">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center">
                        <EnvelopeIcon className="w-8 h-8 mr-3 text-cyan-500" />
                        Hafatra Voaray
                    </h1>
                    <span className="bg-cyan-500/20 text-cyan-500 px-4 py-1 rounded-full text-sm font-medium">
                        {messages.length} Hafatra
                    </span>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-[55vh]">
                        <Loader className='w-16 h-16 animate-[spin_1.5s_linear_infinite]' />
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {messages.length === 0 ? (
                            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-600">
                                <p className="text-gray-500">Tsy misy hafatra voaray aloha hatreto.</p>
                            </div>
                        ) : (
                            messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`p-5 rounded-xl border transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${msg.is_read
                                        ? 'bg-white dark:bg-gray-800/40 border-gray-700'
                                        : 'bg-white dark:bg-gray-800 border-cyan-500/50 shadow-lg shadow-cyan-500/5'
                                        }`}
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="font-bold text-gray-800 dark:text-white">{msg.name}</h3>
                                            {!msg.is_read && <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>}
                                        </div>
                                        <p className="text-sm text-cyan-600 dark:text-cyan-400 font-medium mb-2">{msg.subject}</p>
                                        <div className="flex items-center text-xs text-gray-500 gap-4">
                                            <span className="flex items-center"><ClockIcon className="w-3 h-3 mr-1" /> {new Date(msg.created_at).toLocaleDateString()}</span>
                                            <span className="flex items-center font-mono">{msg.email}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 w-full md:w-auto">
                                        <button
                                            onClick={() => { setSelectedMessage(msg); markAsRead(msg); }}
                                            className="flex-1 md:flex-none p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-colors flex justify-center items-center gap-2"
                                        >
                                            <EyeIcon className="w-5 h-5" /> <span className="md:hidden">Hamaky</span>
                                        </button>
                                        <button
                                            onClick={() => deleteMessage(msg.id)}
                                            className="flex-1 md:flex-none p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors flex justify-center items-center gap-2"
                                        >
                                            <TrashIcon className="w-5 h-5" /> <span className="md:hidden">Hafafa</span>
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* MODAL MBA HAMAKIANA SY HAMALIANA NY HAFATRA */}
            {selectedMessage && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                            <h2 className="text-xl font-bold dark:text-white">Hafatra avy amin'i {selectedMessage.name}</h2>
                            <button onClick={() => setSelectedMessage(null)} className="text-gray-400 hover:text-white">✕</button>
                        </div>

                        <div className="p-8 overflow-y-auto flex-1">
                            <div className="mb-6">
                                <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Lohahevitra</span>
                                <p className="text-lg font-semibold text-cyan-500">{selectedMessage.subject}</p>
                            </div>
                            <div className="mb-6">
                                <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Hafatra voaray</span>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap mt-2 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
                                    {selectedMessage.message}
                                </p>
                            </div>

                            {/* SECTION FAMALIANA */}
                            <div className="mt-8 pt-6 border-t border-gray-700">
                                <label className="block text-sm font-medium text-gray-400 mb-2">Hamaly amin'ny Email ({selectedMessage.email})</label>
                                <textarea
                                    rows="4"
                                    className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-600 focus:border-cyan-500 text-white outline-none transition-all"
                                    placeholder="Soraty eto ny valin-kafatra..."
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                ></textarea>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-700 flex justify-end gap-3">
                            <button
                                onClick={() => setSelectedMessage(null)}
                                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition-colors"
                            >
                                Hikatona
                            </button>
                            <button
                                onClick={handleReply}
                                disabled={sending}
                                className="bg-cyan-600 text-white px-6 py-2 rounded-lg hover:bg-cyan-500 transition-colors flex items-center gap-2"
                            >
                                {sending ? (
                                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Mandefa...</>
                                ) : (
                                    'Handefa Valiny'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}