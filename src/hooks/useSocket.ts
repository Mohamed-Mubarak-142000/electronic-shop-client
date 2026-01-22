/// <reference types="node" />
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/useAuthStore';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

export const useSocket = () => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const { user } = useAuthStore();

    useEffect(() => {
        const newSocket = io(SOCKET_URL, {
            auth: {
                token: user?.token
            }
        });

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [user]);

    return socket;
};
