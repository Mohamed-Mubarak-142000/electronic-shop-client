'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Headset, Loader2 } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/useAuthStore';
import { useTranslation } from '@/hooks/useTranslation';
import chatService, { ChatMessage } from '@/services/chatService';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

const ChatPopup = () => {
    const { user } = useAuthStore();
    const { t, language } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [typingUser, setTypingUser] = useState<string>('');
    const [recipientOnline, setRecipientOnline] = useState(false);
    const [recipientLastSeen, setRecipientLastSeen] = useState<Date | null>(null);
    const socketRef = useRef<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const scrollToBottom = () => {
        if (!messagesEndRef.current) return;
        
        requestAnimationFrame(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        });
    };

    const connectSocket = () => {
        setIsConnecting(true);
        const socket = io(SOCKET_URL, {
            auth: { token: user?.token }
        });

        socket.on('connect', () => {
            setIsConnecting(false);
            socket.emit('join_room', user?._id);
        });

        socket.on('receive_message', (message: ChatMessage) => {
            setMessages((prev) => [...prev, message]);
            scrollToBottom();

            // Mark as read if window is open
            if (isOpen && message.to._id === user?._id) {
                chatService.markAsRead(user?._id);
            }
        });

        // New message notification with sound
        socket.on('new_message_notification', (data: { from: string, to: string, message: ChatMessage }) => {
            // Only play sound if I'm the recipient (not the sender)
            if (data.to === user?._id) {
                // Play notification sound
                const audio = new Audio('/notification.mp3');
                audio.play().catch(err => console.log('Audio play failed:', err));
            }
        });

        // Typing indicator
        socket.on('user_typing', (data: { userName: string, userRole: string, isTyping: boolean }) => {
            setIsTyping(data.isTyping);
            setTypingUser(data.userName);
        });

        // Online status updates
        socket.on('user_status_change', (data: { userId: string, isOnline: boolean, lastSeen: Date }) => {
            // Update recipient status if it's the admin (for user chats)
            setRecipientOnline(data.isOnline);
            setRecipientLastSeen(new Date(data.lastSeen));
        });

        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            setIsConnecting(false);
        });

        socketRef.current = socket;
    };

    const fetchHistory = async () => {
        setIsLoading(true);
        try {
            const history = await chatService.getMessages(user?._id || '');
            setMessages(history);
            scrollToBottom();
            chatService.markAsRead(user?._id || '');
        } catch (error) {
            console.error('Failed to fetch chat history:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const handleOpenChat = () => setIsOpen(true);
        window.addEventListener('open-chat', handleOpenChat);
        return () => window.removeEventListener('open-chat', handleOpenChat);
    }, []);

    useEffect(() => {
        if (isOpen && !socketRef.current && user) {
            connectSocket();
            fetchHistory();
        }
        // Cleanup socket on unmount
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };


    }, [isOpen, user]);

    // Only show for logged-in users who are NOT admins
    if (!user || user.role === 'admin') return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(e.target.value);

        // Send typing indicator
        if (socketRef.current && e.target.value) {
            socketRef.current.emit('typing_start', {
                roomId: user._id,
                userName: user.name,
                userRole: user.role
            });

            // Clear previous timeout
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }

            // Stop typing after 2 seconds of inactivity
            typingTimeoutRef.current = setTimeout(() => {
                if (socketRef.current) {
                    socketRef.current.emit('typing_stop', {
                        roomId: user._id,
                        userName: user.name,
                        userRole: user.role
                    });
                }
            }, 2000);
        }
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim() || !socketRef.current) return;

        // Stop typing indicator
        socketRef.current.emit('typing_stop', {
            roomId: user._id,
            userName: user.name,
            userRole: user.role
        });

        socketRef.current.emit('send_message', {
            roomId: user._id,
            text: inputText,
            // 'to' field is handled by backend if missing (finding admin)
        });

        setInputText('');
    };

    const isRtl = language === 'ar';

    const formatLastSeen = (lastSeen: Date | null) => {
        if (!lastSeen) return '';
        const now = new Date();
        const diff = now.getTime() - new Date(lastSeen).getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    return (
        <div className={`fixed bottom-6 ${isRtl ? 'left-6' : 'right-6'} z-50`} dir={isRtl ? 'rtl' : 'ltr'}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        // Performance: Use transform and opacity for better animation performance
                        initial={{ opacity: 0, transform: "translateY(20px) scale(0.95)" }}
                        animate={{ opacity: 1, transform: "translateY(0) scale(1)" }}
                        exit={{ opacity: 0, transform: "translateY(20px) scale(0.95)" }}
                        transition={{ duration: 0.2 }}
                        className="bg-white dark:bg-slate-900 shadow-2xl rounded-2xl w-80 sm:w-96 h-[500px] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 mb-4"
                    >
                        {/* Header */}
                        <div className="bg-primary p-4 flex items-center justify-between text-white">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/20 p-2 rounded-full relative">
                                    <Headset size={20} />
                                    {recipientOnline && (
                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-primary rounded-full"></span>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-semibold">{t('chat.title')}</h3>
                                    <p className="text-xs text-white/80">
                                        {recipientOnline ? 'Online' : recipientLastSeen ? formatLastSeen(recipientLastSeen) : t('chat.subtitle')}
                                    </p>
                                </div>
                            </div>
                            <button
                                aria-label="Close chat"
                                onClick={() => setIsOpen(false)}
                                className="hover:bg-white/10 p-1 rounded-full transition-colors"
                            >
                                <X size={20} aria-hidden="true" />
                            </button>
                        </div>

                        {/* Messages Body */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950/50">
                            {isLoading ? (
                                <div className="flex justify-center items-center h-full">
                                    <Loader2 className="animate-spin text-primary" size={24} />
                                </div>
                            ) : (
                                <>
                                    {messages.length === 0 && (
                                        <div className="text-center py-10 opacity-50">
                                            <MessageCircle size={40} className="mx-auto mb-2" />
                                            <p className="text-sm">{t('chat.startPrompt')}</p>
                                        </div>
                                    )}
                                    {messages.map((msg, index) => {
                                        const isMe = msg.from._id === user._id;
                                        return (
                                            <div
                                                key={msg._id || index}
                                                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${isMe
                                                    ? 'bg-primary text-white rounded-tr-none'
                                                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-sm rounded-tl-none border border-slate-100 dark:border-slate-700'
                                                    }`}>
                                                    {msg.text}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {isTyping && (
                                        <div className="flex justify-start">
                                            <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl text-sm shadow-sm border border-slate-100 dark:border-slate-700">
                                                <div className="flex gap-1">
                                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </>
                            )}
                        </div>

                        {/* Input Area */}
                        <form
                            onSubmit={handleSendMessage}
                            className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2"
                        >
                            <input
                                type="text"
                                value={inputText}
                                onChange={handleInputChange}
                                placeholder={t('chat.inputPlaceholder')}
                                className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none text-slate-900 dark:text-white"
                            />
                            <button
                                type="submit"
                                aria-label="Send message"
                                disabled={!inputText.trim()}
                                className="bg-primary text-white p-2 rounded-full hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                            >
                                <Send size={18} className={isRtl ? 'rotate-180' : ''} aria-hidden="true" />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                aria-label={isOpen ? "Close chat" : "Open chat"}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-center p-4 rounded-full shadow-lg transition-all ${isOpen
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    : 'bg-primary text-white'
                    }`}
            >
                {isOpen ? <X size={24} aria-hidden="true" /> : <MessageCircle size={24} aria-hidden="true" />}
                {!isOpen && (
                    <span className={`absolute -top-1 ${isRtl ? '-left-1' : '-right-1'} flex h-3 w-3`}>
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                )}
            </motion.button>
        </div>
    );
};

export default ChatPopup;
