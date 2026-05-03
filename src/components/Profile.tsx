import { X, Grid, Heart, Bookmark, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProfileProps {
  isOpen: boolean;
  onClose: () => void;
  postCount: number;
}

export default function Profile({ isOpen, onClose, postCount }: ProfileProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b px-4 py-3">
              <button onClick={onClose} className="text-gray-500 hover:text-black">
                <X className="h-6 w-6" />
              </button>
              <h2 className="font-semibold text-lg">Profile</h2>
              <button className="text-gray-500 hover:text-black">
                <Settings className="h-6 w-6" />
              </button>
            </div>

            <div className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-gray-200">
                  <img 
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=afxeditz02" 
                    alt="Profile" 
                    className="h-full w-full object-cover"
                  />
                </div>
                
                <div className="text-center md:text-left">
                  <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                    <h3 className="text-xl font-semibold">afxeditz02</h3>
                    <button className="rounded-lg bg-gray-100 px-4 py-1.5 text-sm font-semibold hover:bg-gray-200">
                      Edit Profile
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-8 text-sm">
                    <span><strong className="font-bold">{postCount}</strong> posts</span>
                    <span><strong className="font-bold">128</strong> followers</span>
                    <span><strong className="font-bold">256</strong> following</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-8">
                <div className="flex justify-center gap-12 mb-8">
                  <div className="flex items-center gap-2 border-t border-black -mt-8 pt-8 text-xs font-bold uppercase tracking-wider cursor-pointer">
                    <Grid className="h-4 w-4" />
                    Posts
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 cursor-pointer">
                    <Bookmark className="h-4 w-4" />
                    Saved
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 cursor-pointer">
                    <Heart className="h-4 w-4" />
                    Liked
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1 md:gap-4">
                   {[...Array(6)].map((_, i) => (
                    <div key={i} className="aspect-square w-full bg-gray-100 animate-pulse rounded-lg md:rounded-none" />
                   ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
