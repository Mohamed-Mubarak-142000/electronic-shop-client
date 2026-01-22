import api from './api';

export interface ChatMessage {
    _id: string;
    from: {
        _id: string;
        name: string;
        role: string;
    };
    to: {
        _id: string;
        name: string;
        role: string;
    };
    roomId: string;
    text: string;
    read: boolean;
    createdAt: string;
}

export interface Conversation {
    user: {
        _id: string;
        name: string;
        email: string;
        role: string;
    };
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
}

const chatService = {
    getMessages: async (userId: string): Promise<ChatMessage[]> => {
        const response = await api.get(`/chat/messages/${userId}`);
        return response.data;
    },
    markAsRead: async (userId: string) => {
        const response = await api.put(`/chat/read/${userId}`);
        return response.data;
    },
    getAllConversations: async (): Promise<Conversation[]> => {
        const response = await api.get('/chat/conversations');
        return response.data;
    },
    getUnreadCount: async (): Promise<{ unreadCount: number }> => {
        const response = await api.get('/chat/unread');
        return response.data;
    }
};

export default chatService;
