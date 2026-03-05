import {useState} from 'react';

interface SideBarProps {
    isOpen: boolean;
    onClose: () => void;
    onToggleSidebar: () => void;
}

export function SideBar({onToggleSidebar, isOpen, onClose }: SideBarProps ){

    const [chatToDelete, setChatToDelete] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleNewChat = async () => {
        try {
            setIsLoading(true);
            // API call to create new chat
            // const response = await api.createNewChat();
            console.log("Creating new chat...");
            
            // Redirect to new chat or update UI
            // navigate(`/chat/${response.data.id}`);
            
        } catch (error) {
            console.error("Error creating new chat:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteChat = async (chatId: string) => {
        try {
            setIsLoading(true);
            // API call to delete chat
            // await api.deleteChat(chatId);
            console.log(`Deleting chat with ID: ${chatId}`);

            
            
            // Remove chat from UI or redirect
            setChatToDelete(null);
            
        } catch (error) {
            console.error("Error deleting chat:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
        {/* Overlay for mobile */}
        {isOpen && (
            <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                onClick={onClose}
            />
        )}
        
        {/* Sidebar */}
        <div className={`bg-linear-to-b from-blue-600 to-blue-700 h-full flex flex-col p-2 sm:p-3 md:p-4 transition-all duration-300 ease-in-out z-50 shadow-lg sm:shadow-xl ${
            isOpen ? 'w-56 sm:w-60 md:w-64 relative' : 'w-16 sm:w-18 md:w-20 relative'
        }`}>
            
            {/* top with SVG - ALWAYS VISIBLE */}
            <button 
                onClick={onToggleSidebar}
                className="mb-2 sm:mb-3 md:mb-4 p-1 sm:p-2 hover:bg-blue-800 rounded-lg sm:rounded-lg md:rounded-lg transition-all duration-300 hover:scale-110 self-start"
                aria-label="Toggle sidebar"
            >
                <svg 
                    width="20" 
                    height="20"
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className={`transition-transform duration-300 sm:w-5 sm:h-5 md:w-6 md:h-6 ${isOpen ? '' : 'rotate-180'}`}
                >
                    <path 
                        d="M3 6 h18 M3 12 h18 M3 18 h18" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round"
                    />
                </svg>
            </button>

            {/* Collapsible content */}
            {isOpen && (
                <div className="flex flex-col flex-1 transition-opacity duration-300">
                    {/* New chat with addition symbol */}
                    <button 
                        onClick={handleNewChat}
                        disabled={isLoading}
                        className="bg-blue-800 hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg sm:rounded-lg md:rounded-xl p-2 sm:p-2.5 md:p-3 mb-2 sm:mb-3 md:mb-4 flex items-center justify-center gap-1.5 sm:gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg transform"
                    >
                        <svg 
                            width="16" 
                            height="16"
                            viewBox="0 0 20 20" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                            className="sm:w-4 sm:h-4 md:w-5 md:h-5"
                        >
                            <path 
                                d="M10 4 V16 M4 10 H16" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round"
                            />
                        </svg>
                        <span className="font-semibold text-xs sm:text-sm md:text-sm">New Chat</span>
                    </button>

                    {/* Past chat section */}
                    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-800 scrollbar-track-blue-600">
                        <h3 className="text-white text-xs sm:text-xs md:text-sm font-semibold mb-2 sm:mb-3 px-1 sm:px-2 tracking-wide">Past Chats</h3>
                        <div className="group flex items-center justify-between text-white text-xs sm:text-xs md:text-sm p-2 sm:p-2.5 md:p-3 hover:bg-blue-800 rounded-lg cursor-pointer transition-all duration-200 hover:translate-x-0.5 sm:hover:translate-x-1">
                            <span className="truncate">Previous </span>
                            <button 
                                onClick={() => handleDeleteChat('previous-chat-id')}
                                disabled={!!chatToDelete}
                                className="opacity-0 group-hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 p-0.5 sm:p-1 hover:bg-blue-900 rounded hover:scale-110 transform shrink-0"
                            >
                                <svg 
                                    width="14" 
                                    height="14" 
                                    viewBox="0 0 16 16" 
                                    fill="none" 
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="sm:w-4 sm:h-4 md:w-4 md:h-4"
                                >
                                    <path 
                                        d="M3 4 L13 4 M5 4 V3 C5 2.5 5.5 2 6 2 L10 2 C10.5 2 11 2.5 11 3 V4 M6 7 V12 M10 7 V12 M4 4 L4.5 13 C4.5 13.5 5 14 5.5 14 L10.5 14 C11 14 11.5 13.5 11.5 13 L12 4" 
                                        stroke="currentColor" 
                                        strokeWidth="1.5" 
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Profile at the bottom */}
                    <div className="mt-auto pt-2 sm:pt-3 md:pt-4 border-t border-blue-500">
                        <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 p-1.5 sm:p-2 md:p-3 hover:bg-blue-800 rounded-lg sm:rounded-lg md:rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 transform">
                            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-linear-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base md:text-lg shadow-lg ring-2 ring-blue-300 shrink-0">
                                U
                            </div>
                            <div className="flex-1 min-w-0">
                                <span className="text-white font-semibold block text-xs sm:text-xs md:text-sm truncate">Profile</span>
                                <span className="text-blue-200 text-xs block truncate">View settings</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Optional: Show minimal content when collapsed */}
            {!isOpen && (
                <div className="flex flex-col items-center gap-2 sm:gap-3 md:gap-4 mt-2 sm:mt-3 md:mt-4">
                    <button 
                        onClick={handleNewChat}
                        className="p-1.5 sm:p-2 md:p-2 hover:bg-blue-800 rounded-lg transition-all duration-300"
                        title="New Chat"
                    >
                        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white sm:w-5 sm:h-5 md:w-5 md:h-5">
                            <path d="M10 4 V16 M4 10 H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </button>
                    
                    <div className="mt-auto">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-linear-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base md:text-lg shadow-lg ring-2 ring-blue-300">
                            U
                        </div>
                    </div>
                </div>
            )}
        </div>
        </>
    )
}