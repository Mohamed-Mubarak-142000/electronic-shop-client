'use client';

import { useTranslation } from '@/hooks/useTranslation';
import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '@/services/chatService';
import { Send, Loader2, MessageCircle } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { Socket } from 'socket.io-client';
import { formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';

interface AdminChatInterfaceProps {
    userId: string | null;
    userName: string | null;
    messages: ChatMessage[];
    onSendMessage: (text: string) => void;
    isLoading: boolean;
    socket: Socket | null;
}

const AdminChatInterface: React.FC<AdminChatInterfaceProps> = ({
    userId,
    userName,
    messages,
    onSendMessage,
    isLoading,
    socket
}) => {
    const { user } = useAuthStore();
    const { t, language } = useTranslation();
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior });
        }
    };

    useEffect(() => {
        if (messages.length > 0) {
            // Use 'auto' for initial load to avoid jumping, 'smooth' for new messages
            scrollToBottom(messages.length <= 20 ? 'auto' : 'smooth');
        }
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim() || !userId) return;

        onSendMessage(inputText);
        setInputText('');
    };

    if (!userId) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center animate-in fade-in duration-500">
                <div className="bg-primary/5 p-8 rounded-full mb-6">
                    <MessageCircle size={64} className="text-primary/20" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{t('admin.chat.select_conversation')}</h3>
                <p className="max-w-xs text-gray-500">{t('admin.chat.choose_user')}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-background-dark/30">
            {/* Header */}
            <div className="flex items-center gap-4 p-4 border-b border-white/10 bg-card-dark/80 backdrop-blur-md sticky top-0 z-10 shadow-sm">
                <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-primary font-bold text-lg border border-primary/20 shadow-inner">
                        {userName?.charAt(0).toUpperCase()}
                    </div>
                    <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-card-dark ${socket?.connected ? 'bg-green-500' : 'bg-gray-500'}`} />
                </div>
                <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-white truncate text-lg leading-tight">{userName}</h2>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${socket?.connected ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
                        <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">
                            {socket?.connected ? t('admin.chat.online') : t('admin.chat.offline')}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {/* Placeholder for more actions */}
                    <button className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400">
                        <span className="material-symbols-outlined">more_vert</span>
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto scrollbar-hide p-4 md:p-6 space-y-6"
            >
                {isLoading ? (
                    <div className="flex flex-col justify-center items-center h-full gap-4">
                        <div className="relative">
                            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary text-sm">chat</span>
                            </div>
                        </div>
                        <p className="text-gray-500 font-medium text-sm animate-pulse">{t('common.loading')}</p>
                    </div>
                ) : (
                    <>
                        {messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full opacity-40 py-20">
                                <div className="bg-white/5 p-6 rounded-3xl mb-4">
                                    <MessageCircle size={48} className="text-gray-400" />
                                </div>
                                <p className="text-sm font-medium text-gray-400">{t('admin.chat.no_messages')}</p>
                            </div>
                        )}
                        {messages.map((msg, index) => {
                            const isMe = msg.from._id === user?._id;
                            const prevMsg = messages[index - 1];
                            const showAvatar = !isMe && (!prevMsg || prevMsg.from._id !== msg.from._id);

                            return (
                                <div
                                    key={msg._id || index}
                                    className={`flex items-end gap-2 group ${isMe ? 'flex-row-reverse' : 'flex-row'} animate-in slide-in-from-bottom-2 duration-300`}
                                >
                                    {/* User Avatar (only for other users) */}
                                    {!isMe ? (
                                        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold transition-all ${showAvatar ? 'bg-primary/20 text-primary border border-primary/20 scale-100' : 'opacity-0 scale-50'}`}>
                                            {userName?.charAt(0).toUpperCase()}
                                        </div>
                                    ) : (
                                        <div className="w-8 flex-shrink-0" />
                                    )}

                                    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[80%] md:max-w-[70%]`}>
                                        <div
                                            className={`p-3 md:p-4 shadow-lg transition-all duration-200 ${isMe
                                                ? 'bg-primary text-white rounded-2xl rounded-tr-sm hover:shadow-primary/20'
                                                : 'bg-card-dark text-white border border-white/5 rounded-2xl rounded-tl-sm hover:bg-card-dark/80 shadow-black/20'
                                                }`}
                                        >
                                            <p className="text-[13px] md:text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                        </div>
                                        <span className={`text-[10px] font-medium text-gray-500 mt-1.5 px-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                            <span className="material-symbols-outlined text-[10px]">schedule</span>
                                            {formatDistanceToNow(new Date(msg.createdAt), {
                                                addSuffix: true,
                                                locale: language === 'ar' ? ar : enUS
                                            })}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} className="h-4" />
                    </>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-card-dark/80 backdrop-blur-md border-t border-white/10 sticky bottom-0 z-10">
                <form
                    onSubmit={handleSendMessage}
                    className="relative flex items-center gap-3 bg-background-dark/50 p-1.5 pr-2 rounded-2xl border border-white/5 focus-within:border-primary/30 transition-all shadow-inner"
                >
                    <button type="button" className="p-2 text-gray-500 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">sentiment_satisfied</span>
                    </button>
                    <textarea
                        rows={1}
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage(e);
                            }
                        }}
                        placeholder={t('admin.chat.type_message')}
                        className="flex-1 bg-transparent border-none py-2 text-sm outline-none text-white placeholder-gray-500 resize-none max-h-32 scrollbar-hide min-h-[40px]"
                    />
                    <button
                        type="submit"
                        disabled={!inputText.trim()}
                        className={`p-3 rounded-xl transition-all flex items-center justify-center shadow-lg ${inputText.trim()
                                ? 'bg-primary text-secondary hover:scale-105 active:scale-95 shadow-primary/20'
                                : 'bg-white/5 text-gray-600 cursor-not-allowed'
                            }`}
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>

            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
};

export default AdminChatInterface;
