import { Camera, Home, PlusSquare, Search, User, Settings } from 'lucide-react';
import { motion } from 'motion/react';

interface NavbarProps {
  onAddPost: () => void;
  onProfileClick: () => void;
  onHomeClick: () => void;
  onSearchClick: () => void;
}

export default function Navbar({ onAddPost, onProfileClick, onHomeClick, onSearchClick }: NavbarProps) {
  const navItems = [
    { 
      icon: Home, 
      label: 'Home', 
      action: () => {
        onHomeClick();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } 
    },
    { icon: Search, label: 'Search', action: onSearchClick },
    { icon: PlusSquare, label: 'Create', action: onAddPost },
    { icon: User, label: 'Profile', action: onProfileClick },
  ];

  return (
    <>
      {/* Mobile Bottom Navbar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white px-4 py-2 md:hidden">
        <div className="flex items-center justify-around">
          {navItems.map((item, idx) => (
            <motion.button
              key={idx}
              whileTap={{ scale: 0.9 }}
              onClick={item.action}
              className="p-3 text-gray-700 active:text-black"
            >
              <item.icon className="h-6 w-6" />
            </motion.button>
          ))}
        </div>
      </nav>

      {/* Desktop Side Navbar */}
      <nav className="fixed left-0 top-0 hidden h-screen w-20 flex-col border-r border-gray-200 bg-white p-4 transition-all duration-300 xl:w-64 md:flex">
        <div className="mb-10 px-3 py-6">
          <div className="flex items-center gap-3">
            <Camera className="h-8 w-8 shrink-0" />
            <h1 className="text-2xl font-bold italic tracking-tighter xl:block hidden">InstaClone</h1>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2">
          {navItems.map((item, idx) => (
            <motion.button
              key={idx}
              whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
              whileTap={{ scale: 0.98 }}
              onClick={item.action}
              className="flex items-center gap-4 rounded-lg p-3 text-gray-700 transition-colors hover:text-black"
            >
              <item.icon className="h-6 w-6 shrink-0" />
              <span className="text-base font-medium xl:block hidden">{item.label}</span>
            </motion.button>
          ))}
        </div>

        <div className="mt-auto p-3">
          <motion.button
            whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
            className="flex w-full items-center gap-4 rounded-lg p-3 text-gray-700 transition-colors hover:text-black"
          >
            <Settings className="h-6 w-6 shrink-0" />
            <span className="text-base font-medium xl:block hidden">Settings</span>
          </motion.button>
        </div>
      </nav>
    </>
  );
}
