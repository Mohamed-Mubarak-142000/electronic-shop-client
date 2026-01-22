'use client';

import dynamic from 'next/dynamic';

const ChatPopup = dynamic(() => import('./ChatPopup'), {
    ssr: false,
});

export default function DynamicChatWidget() {
    return <ChatPopup />;
}
