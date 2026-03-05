interface NavbarProps {
    onToggleSidebar: () => void;
}

export function Navbar({onToggleSidebar}: NavbarProps){
    return (
        <div className="flex items-center justify-between bg-linear-to-r from-blue-700 via-blue-600 to-blue-700 text-white px-3 sm:px-4 md:px-6 py-3 sm:py-4 shadow-lg gap-2 sm:gap-4">
            {/* Mobile Menu Button */}
            <button 
                onClick={onToggleSidebar}
                className="md:hidden p-1.5 hover:bg-blue-800 rounded-lg transition-all duration-300 shrink-0"
                aria-label="Toggle sidebar"
            >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
            
            <div className="flex-1 text-center">
                <h1 className="text-sm sm:text-base md:text-xl font-bold tracking-wide animate-pulse line-clamp-1">Art Style Image Transformation</h1>
            </div>
            
            {/* Spacer for alignment */}
            <div className="w-9 sm:w-10 md:hidden"></div>
        </div>
        
    );
}