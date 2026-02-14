'use client';

import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/useAuthStore';
import chatService, { ChatMessage, Conversation } from '@/services/chatService';
import ConversationList from '@/components/admin/ConversationList';
import AdminChatInterface from '@/components/admin/AdminChatInterface';
import { MessageCircle } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { AdminPageHeader } from '@/components/admin/shared/AdminPageHeader';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'https://electronic-shop-server-one.vercel.app';

export default function MessagesPage() {
    const { t } = useTranslation();
    const { user } = useAuthStore();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoadingConversations, setIsLoadingConversations] = useState(true);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const socketRef = useRef<Socket | null>(null);

    // Fetch all conversations on mount
    useEffect(() => {
        fetchConversations();
    }, []);

    // Connect to socket and join rooms
    useEffect(() => {
        if (!user) return;

        const socket = io(SOCKET_URL, {
            auth: { token: user.token }
        });

        socket.on('connect', () => {
            // Connected
        });

        socket.on('receive_message', (message: ChatMessage) => {
            // Update messages if the message is for the currently selected conversation
            if (
                selectedUserId &&
                (message.roomId === selectedUserId ||
                    message.from._id === selectedUserId ||
                    message.to._id === selectedUserId)
            ) {
                setMessages((prev) => [...prev, message]);
                // Mark as read since admin is viewing
                chatService.markAsRead(selectedUserId);
            }

            // Refresh conversations to update last message and unread count
            fetchConversations();
        });

        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        socketRef.current = socket;

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, [user, selectedUserId]);

    // Join room when user is selected
    useEffect(() => {
        if (selectedUserId && socketRef.current) {
            socketRef.current.emit('join_room', selectedUserId);
            fetchMessages(selectedUserId);
        }
    }, [selectedUserId]);

    const fetchConversations = async () => {
        setIsLoadingConversations(true);
        try {
            const data = await chatService.getAllConversations();
            setConversations(data);
        } catch (error) {
            console.error('Failed to fetch conversations:', error);
        } finally {
            setIsLoadingConversations(false);
        }
    };

    const fetchMessages = async (userId: string) => {
        setIsLoadingMessages(true);
        try {
            const data = await chatService.getMessages(userId);
            setMessages(data);
            // Mark messages as read
            await chatService.markAsRead(userId);
            // Refresh conversations to update unread count
            fetchConversations();
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        } finally {
            setIsLoadingMessages(false);
        }
    };

    const handleSelectUser = (userId: string) => {
        setSelectedUserId(userId);
    };

    const handleSendMessage = (text: string) => {
        if (!socketRef.current || !selectedUserId) return;

        socketRef.current.emit('send_message', {
            roomId: selectedUserId,
            text,
            to: selectedUserId
        });
    };

    const selectedUserName = conversations.find(
        (conv) => conv.user._id === selectedUserId
    )?.user.name || null;

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-180px)]">
            <div className="mb-4 md:mb-6">
                <AdminPageHeader
                    title={t('admin.messages.title')}
                    subtitle={t('admin.messages.subtitle')}
                />
            </div>

            {/* Chat Interface Container */}
            <div className="flex-1 bg-card-dark rounded-xl border border-border overflow-hidden flex flex-col md:flex-row shadow-2xl">

                {/* Conversation List Side */}
                <div className={`w-full md:w-80 border-r border-border flex-shrink-0 flex flex-col ${selectedUserId ? 'hidden md:flex' : 'flex'}`}>
                    <div className="p-4 border-b border-border bg-card-dark/50">
                        <h2 className="font-semibold text-foreground">{t('admin.messages.conversations_list')}</h2>
                        <p className="text-xs text-text-secondary mt-1">
                            {conversations.length} {conversations.length === 1 ? t('admin.messages.conversation_count') : t('admin.messages.conversations_count')}
                        </p>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <ConversationList
                            conversations={conversations}
                            selectedUserId={selectedUserId}
                            onSelectUser={handleSelectUser}
                            isLoading={isLoadingConversations}
                        />
                    </div>
                </div>

                {/* Chat Interface Side */}
                <div className={`flex-1 flex flex-col min-h-0 ${!selectedUserId ? 'hidden md:flex' : 'flex'}`}>
                    {selectedUserId && (
                        <div className="md:hidden p-2 border-b border-white/10 bg-card-dark/50">
                            <button
                                onClick={() => setSelectedUserId(null)}
                                className="flex items-center gap-2 text-primary text-sm font-medium p-2 hover:bg-white/5 rounded-lg transition-colors"
                            >
                                <span className="material-symbols-outlined text-[20px] transform transition-transform group-hover:-translate-x-1">arrow_back</span>
                                {t('common.back')}
                            </button>
                        </div>
                    )}
                    <AdminChatInterface
                        userId={selectedUserId}
                        userName={selectedUserName}
                        messages={messages}
                        onSendMessage={handleSendMessage}
                        isLoading={isLoadingMessages}
                        socket={socketRef.current}
                    />
                </div>
            </div>
        </div>
    );
}
