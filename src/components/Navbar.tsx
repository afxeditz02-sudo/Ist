import { Camera, Home, PlusSquare, Search, User } from 'lucide-react';
import { motion } from 'motion/react';

interface NavbarProps {
  onAddPost: () => void;
}

export default function Navbar({ onAddPost }: NavbarProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white px-4 py-2 md:top-0 md:bottom-auto md:border-t-0 md:border-b">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <div className="hidden items-center gap-2 md:flex">
          <Camera className="h-6 w-6" />
          <h1 className="text-xl font-bold italic tracking-tighter">InstaClone</h1>
        </div>

        <div className="flex w-full items-center justify-around md:w-auto md:gap-8">
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="p-2 text-gray-700 hover:text-black"
          >
            <Home className="h-6 w-6" />
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="p-2 text-gray-700 hover:text-black md:hidden"
          >
            <Search className="h-6 w-6" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onAddPost}
            className="rounded-lg bg-black p-2 text-white shadow-sm hover:bg-gray-800"
          >
            <PlusSquare className="h-6 w-6" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            className="p-2 text-gray-700 hover:text-black md:hidden"
          >
            <User className="h-6 w-6" />
          </motion.button>

          <div className="hidden items-center gap-8 md:flex">
             <Search className="h-6 w-6 text-gray-700 cursor-pointer hover:text-black" />
             <User className="h-6 w-6 text-gray-700 cursor-pointer hover:text-black" />
          </div>
        </div>
      </div>
    </nav>
  );
}
