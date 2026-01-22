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

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim() || !userId) return;

        onSendMessage(inputText);
        setInputText('');
    };

    if (!userId) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <MessageCircle size={64} className="mb-4 opacity-30" />
                <p className="text-lg font-medium">{t('admin.chat.select_conversation')}</p>
                <p className="text-sm mt-2">{t('admin.chat.choose_user')}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-white/10 bg-card-dark">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                    {userName?.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h2 className="font-semibold text-white">{userName}</h2>
                    <p className="text-xs text-gray-400">
                        {socket?.connected ? t('admin.chat.online') : t('admin.chat.offline')}
                    </p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background-dark">
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loader2 className="animate-spin text-primary" size={32} />
                    </div>
                ) : (
                    <>
                        {messages.length === 0 && (
                            <div className="text-center py-10 opacity-50">
                                <MessageCircle size={40} className="mx-auto mb-2 text-gray-400" />
                                <p className="text-sm text-gray-400">{t('admin.chat.no_messages')}</p>
                            </div>
                        )}
                        {messages.map((msg, index) => {
                            const isMe = msg.from._id === user?._id;
                            return (
                                <div
                                    key={msg._id || index}
                                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className="flex flex-col max-w-[70%]">
                                        <div
                                            className={`p-3 rounded-2xl text-sm ${isMe
                                                    ? 'bg-primary text-white rounded-tr-none'
                                                    : 'bg-card-dark text-white border border-white/10 rounded-tl-none'
                                                }`}
                                        >
                                            {msg.text}
                                        </div>
                                        <span className="text-xs text-gray-500 mt-1 px-2">
                                            {formatDistanceToNow(new Date(msg.createdAt), { 
                                                addSuffix: true,
                                                locale: language === 'ar' ? ar : enUS
                                            })}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Input */}
            <form
                onSubmit={handleSendMessage}
                className="p-4 border-t border-white/10 bg-card-dark flex items-center gap-3"
            >
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={t('admin.chat.type_message')}
                    className="flex-1 bg-background-dark border border-white/10 rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none text-white placeholder-gray-500"
                />
                <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="bg-primary text-white p-2.5 rounded-full hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center"
                >
                    <Send size={20} />
                </button>
            </form>
        </div>
    );
};

export default AdminChatInterface;
