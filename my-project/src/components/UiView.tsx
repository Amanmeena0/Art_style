export function Navbar(){
    return (
        <div className="flex items-center justify-between bg-linear-to-r from-blue-700 via-blue-600 to-blue-700 text-white px-3 sm:px-4 md:px-6 py-3 sm:py-4 shadow-lg gap-2 sm:gap-4">
            {/* Profile Icon */}
            <button 
                className="p-1.5 hover:bg-blue-800 rounded-full transition-all duration-300 shrink-0"
                aria-label="Profile"
            >
                <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </button>
            
            <div className="flex-1 text-center">
                <h1 className="text-sm sm:text-base md:text-xl font-bold tracking-wide animate-pulse line-clamp-1">Art Style Image Transformation</h1>
            </div>
            
            {/* Spacer for alignment */}
            <div className="w-8 sm:w-9"></div>
        </div>
        
    );
}