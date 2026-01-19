import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2 } from 'lucide-react';

export function Header() {
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  const handleLogoClick = () => {
    const now = Date.now();
    
    if (now - lastClickTime > 1000) {
      setClickCount(1);
    } else {
      setClickCount(prev => prev + 1);
    }
    
    setLastClickTime(now);

    if (clickCount + 1 === 3) {
      window.location.href = '/admin';
      setClickCount(0);
    }
  };

  return (
    <header className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            onClick={handleLogoClick}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="bg-white p-2 rounded-lg shadow-md group-hover:rotate-12 transition-transform duration-200">
              <Gamepad2 className="w-6 h-6 text-purple-600" />
            </div>
            <span className="font-bold text-xl text-white drop-shadow-lg">🎲 주사위는 던져졌다</span>
          </div>
          
          <nav className="flex gap-6">
            <Link 
              to="/" 
              className="text-white hover:text-yellow-200 transition-colors font-medium"
            >
              게임 목록 🎮
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}