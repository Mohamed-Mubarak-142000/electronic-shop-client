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

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

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
        <div className="flex flex-col h-full">
            <div className="mb-6 px-6 pt-6">
                <AdminPageHeader
                    title={t('admin.messages.title')}
                    subtitle={t('admin.messages.subtitle')}
                />
            </div>

            {/* Chat Interface */}
            <div className="flex-1 bg-card-dark rounded-xl border border-white/10 overflow-hidden flex">
                {/* Conversation List - Left Side */}
                <div className="w-80 border-r border-white/10 flex-shrink-0">
                    <div className="p-4 border-b border-white/10">
                        <h2 className="font-semibold text-white">{t('admin.messages.conversations_list')}</h2>
                        <p className="text-xs text-gray-400 mt-1">
                            {conversations.length} {conversations.length === 1 ? t('admin.messages.conversation_count') : t('admin.messages.conversations_count')}
                        </p>
                    </div>
                    <ConversationList
                        conversations={conversations}
                        selectedUserId={selectedUserId}
                        onSelectUser={handleSelectUser}
                        isLoading={isLoadingConversations}
                    />
                </div>

                {/* Chat Interface - Right Side */}
                <div className="flex-1">
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
