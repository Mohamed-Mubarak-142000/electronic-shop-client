'use client';

import React from 'react';
import { Conversation } from '@/services/chatService';
import { User, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { useTranslation } from '@/hooks/useTranslation';

interface ConversationListProps {
    conversations: Conversation[];
    selectedUserId: string | null;
    onSelectUser: (userId: string) => void;
    isLoading: boolean;
}

const ConversationList: React.FC<ConversationListProps> = ({
    conversations,
    selectedUserId,
    onSelectUser,
    isLoading
}) => {
    const { t, language } = useTranslation();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (conversations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <User size={48} className="mb-4 opacity-50" />
                <p className="text-sm">{t('admin.chat.no_conversations')}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full overflow-y-auto">
            {conversations.map((conversation) => (
                <button
                    key={conversation.user._id}
                    onClick={() => onSelectUser(conversation.user._id)}
                    className={`flex items-start gap-3 p-4 border-b border-white/5 hover:bg-white/5 transition-colors text-left ${selectedUserId === conversation.user._id ? 'bg-primary/10 border-l-4 border-l-primary' : ''
                        }`}
                >
                    {/* Avatar */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                        {conversation.user.name.charAt(0).toUpperCase()}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-white text-sm truncate">
                                {conversation.user.name}
                            </h3>
                            {conversation.unreadCount > 0 && (
                                <span className="flex-shrink-0 bg-primary text-white text-xs font-bold rounded-full px-2 py-0.5 ml-2">
                                    {conversation.unreadCount}
                                </span>
                            )}
                        </div>
                        <p className="text-gray-400 text-xs truncate mb-1">
                            {conversation.lastMessage}
                        </p>
                        <div className="flex items-center gap-1 text-gray-500 text-xs">
                            <Clock size={12} />
                            <span>
                                {formatDistanceToNow(new Date(conversation.lastMessageTime), { 
                                    addSuffix: true,
                                    locale: language === 'ar' ? ar : enUS
                                })}
                            </span>
                        </div>
                    </div>
                </button>
            ))}
        </div>
    );
};

export default ConversationList;
