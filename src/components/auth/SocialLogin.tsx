import React from 'react';

export default function SocialLogin() {
    return (
        <>
            <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-gray-200 dark:border-border-dark"></div>
                <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">or continue with</span>
                <div className="flex-grow border-t border-gray-200 dark:border-border-dark"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <button type="button" className="flex items-center justify-center gap-2 rounded-full border border-gray-200 dark:border-border-dark bg-white dark:bg-surface-dark h-12 text-sm font-medium text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-[#23402f] transition-colors">
                    {/* Google Icon SVG */}
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                    </svg>
                    Google
                </button>
                <button type="button" className="flex items-center justify-center gap-2 rounded-full border border-gray-200 dark:border-border-dark bg-white dark:bg-surface-dark h-12 text-sm font-medium text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-[#23402f] transition-colors">
                    {/* Apple Icon */}
                    <svg className="w-5 h-5 dark:fill-white fill-gray-900" viewBox="0 0 24 24">
                        <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.15-.04-.21.02-1.35.584-2.75 1.38-3.68.777-.92 2.056-1.55 3.01-1.55 0 .05.11.08.114.82zM12.42 5.86c.325 0 .913.32 1.718.32 1.323 0 2.482-.9 3.23-1.07.72-.17 2.686.06 3.98 2.05-.13.08-2.28 1.41-2.28 4.3 0 3.12 2.47 4.54 2.57 4.61-.17.44-1.02 2.45-2.06 4.22-.64 1.08-1.57 2.13-2.73 2.13-1.09 0-1.48-.75-3.41-.75-1.92 0-2.52.75-3.56.75-1.22 0-2.3-1.42-3.23-2.92-1.9-3.05-3.1-8.15-1.11-11.66 1-1.76 2.94-2.65 4.75-2.65.66 0 1.25.26 1.83.61z"></path>
                    </svg>
                    Apple
                </button>
            </div>
        </>
    );
}
