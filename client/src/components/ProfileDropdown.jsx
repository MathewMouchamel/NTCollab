import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

export default function ProfileDropdown() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Avatar Button */}
      <button
        className="w-12 h-12 rounded-full border-2 border-black overflow-hidden hover:border-gray-700 transition-colors duration-200 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="User profile"
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name || 'User'}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-black font-semibold">
            {user.name ? user.name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || 'U'}
          </div>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border-2 border-black rounded-lg shadow-lg z-50">
          <div className="p-4 border-b-2 border-black">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full border-2 border-black overflow-hidden">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name || 'User'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-black font-semibold text-sm">
                    {user.name ? user.name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-black truncate">
                  {user.name || 'User'}
                </p>
                <p className="text-xs text-gray-600 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-2">
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 text-sm text-black hover:bg-black hover:text-white rounded transition-colors duration-200"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}