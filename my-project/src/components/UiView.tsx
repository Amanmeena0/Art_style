import { UserButton } from '@clerk/react'

export function Navbar(){
    return (
        <div className="flex items-center justify-between bg-linear-to-r from-blue-700 via-blue-600 to-blue-700 text-white px-3 sm:px-4 md:px-6 py-3 sm:py-4 shadow-lg gap-2 sm:gap-4">
            
            <div className="flex items-center gap-2">
                <img src="/image.png" alt="Styler Logo" className="h-10 w-10 object-contain" />
                <span className="text-lg font-bold text-pink-300">Styler</span>
            </div>
        
            <div className="flex-1 text-center">
                <h1 className="text-sm sm:text-base md:text-xl font-bold tracking-wide animate-pulse line-clamp-1">Art Style Image Transformation</h1>
            </div>
            
            <div className="flex items-center">
                <UserButton afterSignOutUrl="/" />
            </div>
        </div>
        
    );
}