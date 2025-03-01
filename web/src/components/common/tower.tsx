 
export default function Tower() { 
    return ( 
        <div className="relative h-96 w-48">
            {/* Tower Base */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-black rounded-b-lg shadow-lg border-t border-cyan-800"></div>
            
            {/* Tower Main Structure */}
            <div className="absolute bottom-12 left-6 right-6 h-64 bg-gradient-to-t from-gray-950 to-gray-900 rounded-lg shadow-lg">
            {/* Windows - Vertical strips */}
            <div className="absolute top-4 bottom-4 left-4 w-1 bg-cyan-400 rounded-full opacity-70 animate-pulse"></div>
            <div className="absolute top-12 bottom-12 left-8 w-1 bg-cyan-400 rounded-full opacity-60"></div>
            <div className="absolute top-8 bottom-8 left-12 w-1 bg-cyan-400 rounded-full opacity-70 animate-pulse"></div>
            
            <div className="absolute top-4 bottom-4 right-4 w-1 bg-cyan-400 rounded-full opacity-70 animate-pulse"></div>
            <div className="absolute top-12 bottom-12 right-8 w-1 bg-cyan-400 rounded-full opacity-60"></div>
            <div className="absolute top-8 bottom-8 right-12 w-1 bg-cyan-400 rounded-full opacity-70 animate-pulse"></div>
            
            {/* Horizontal window bands */}
            <div className="absolute top-16 left-0 right-0 h-1 bg-cyan-500 opacity-60"></div>
            <div className="absolute top-32 left-0 right-0 h-1 bg-cyan-500 opacity-60"></div>
            <div className="absolute top-48 left-0 right-0 h-1 bg-cyan-500 opacity-60"></div>
            </div>
            
            {/* Middle Section with sleek design */}
            <div className="absolute bottom-76 left-8 right-8 h-10 bg-black rounded-lg shadow-lg border-t border-b border-cyan-900"></div>
            
            {/* Upper Tower Section */}
            <div className="absolute bottom-86 left-10 right-10 h-20 bg-gradient-to-t from-gray-900 to-black rounded-lg shadow-md">
            {/* Upper section windows */}
            <div className="absolute inset-2 bg-transparent border border-cyan-800 rounded-lg opacity-80">
                <div className="absolute top-2 left-2 right-2 h-1 bg-cyan-400 opacity-70"></div>
                <div className="absolute bottom-2 left-2 right-2 h-1 bg-cyan-400 opacity-70"></div>
            </div>
            </div>
            
            {/* Tower Spire Base */}
            <div className="absolute bottom-106 left-12 right-12 h-6 bg-black rounded-lg shadow-md border-t border-cyan-900"></div>
            
            {/* Tower Spire */}
            <div className="absolute bottom-112 left-16 right-16 h-16 bg-gradient-to-t from-gray-900 to-black rounded-full shadow-md">
            {/* Spire details */}
            <div className="absolute inset-1 rounded-full border border-cyan-800 opacity-80"></div>
            </div>
            
            {/* Tower Beacon */}
            <div className="absolute bottom-128 left-20 right-20 h-6 w-6 mx-auto bg-cyan-500 rounded-full shadow-lg animate-pulse">
            <div className="absolute inset-0 bg-cyan-400 rounded-full opacity-50 animate-ping"></div>
            <div className="absolute inset-2 bg-cyan-200 rounded-full opacity-90"></div>
            </div>
            
            {/* Light beams from beacon */}
            <div className="absolute bottom-134 left-0 right-0 mx-auto w-1 h-16 bg-cyan-400 opacity-20 blur-sm"></div>
            <div className="absolute bottom-128 left-18 h-20 w-20 bg-cyan-500 rounded-full blur-xl opacity-10"></div>
            
            {/* Decorative elements */}
            <div className="absolute bottom-20 left-0 w-2 h-8 bg-cyan-800 opacity-80 rounded-r-lg"></div>
            <div className="absolute bottom-40 left-0 w-2 h-8 bg-cyan-800 opacity-80 rounded-r-lg"></div>
            <div className="absolute bottom-60 left-0 w-2 h-8 bg-cyan-800 opacity-80 rounded-r-lg"></div>
            
            <div className="absolute bottom-20 right-0 w-2 h-8 bg-cyan-800 opacity-80 rounded-l-lg"></div>
            <div className="absolute bottom-40 right-0 w-2 h-8 bg-cyan-800 opacity-80 rounded-l-lg"></div>
            <div className="absolute bottom-60 right-0 w-2 h-8 bg-cyan-800 opacity-80 rounded-l-lg"></div>
            
            {/* Ambient glow effect */}
            <div className="absolute inset-0 bg-cyan-500 rounded-lg blur-2xl opacity-5"></div>
        </div> 
    )
}
