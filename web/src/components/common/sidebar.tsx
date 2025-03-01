const Sidebar = () => {
    return (
      <div className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-gray-900 to-black text-gray-400 shadow-xl transition-all duration-300">
        {/* Logo Section */}
        <div className="flex items-center justify-center h-20 border-b border-gray-800">
          <h1 className="text-xl font-semibold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Dashboard
          </h1>
        </div>
        
        {/* Navigation Links */}
        <nav className="py-6 px-4 space-y-1">
          {/* Dashboard Link */}
          <a 
            href="#" 
            className="group flex items-center py-3 px-4 rounded-lg transition-all duration-200 hover:bg-white/10 hover:text-white"
          >
            <svg className="w-5 h-5 mr-3 opacity-70 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Home</span>
            
            {/* Hover indicator */}
            <div className="absolute right-0 w-1 h-0 bg-white rounded-l-lg transition-all duration-200 group-hover:h-8"></div>
          </a>
          
          {/* Analytics Link */}
          <a 
            href="#" 
            className="group flex items-center py-3 px-4 rounded-lg transition-all duration-200 hover:bg-white/10 hover:text-white"
          >
            <svg className="w-5 h-5 mr-3 opacity-70 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>Analytics</span>
            
            {/* Hover indicator */}
            <div className="absolute right-0 w-1 h-0 bg-white rounded-l-lg transition-all duration-200 group-hover:h-8"></div>
          </a>
          
          {/* Projects Link */}
          <a 
            href="#" 
            className="group flex items-center py-3 px-4 rounded-lg transition-all duration-200 hover:bg-white/10 hover:text-white"
          >
            <svg className="w-5 h-5 mr-3 opacity-70 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <span>Projects</span>
            
            {/* Hover indicator */}
            <div className="absolute right-0 w-1 h-0 bg-white rounded-l-lg transition-all duration-200 group-hover:h-8"></div>
          </a>
          
          {/* Settings Link */}
          <a 
            href="#" 
            className="group flex items-center py-3 px-4 rounded-lg transition-all duration-200 hover:bg-white/10 hover:text-white"
          >
            <svg className="w-5 h-5 mr-3 opacity-70 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Settings</span>
            
            {/* Hover indicator */}
            <div className="absolute right-0 w-1 h-0 bg-white rounded-l-lg transition-all duration-200 group-hover:h-8"></div>
          </a>
        </nav>
        
        {/* User Profile Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center p-3 rounded-lg transition-all duration-200 hover:bg-white/10 cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold">
              U
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">User Name</p>
              <p className="text-xs text-gray-500">user@example.com</p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Sidebar;