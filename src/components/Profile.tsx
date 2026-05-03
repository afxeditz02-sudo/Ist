import { X, Grid, Heart, Bookmark, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Author, Post } from '../types';

interface ProfileProps {
  isOpen: boolean;
  onClose: () => void;
  user: Author;
  posts: Post[];
  savedPosts: Post[];
  likedPosts: Post[];
  onEditProfile: () => void;
}

export default function Profile({ isOpen, onClose, user, posts, savedPosts, likedPosts, onEditProfile }: ProfileProps) {
  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'liked'>('posts');

  const displayPosts = {
    posts: posts,
    saved: savedPosts,
    liked: likedPosts,
  }[activeTab];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center md:p-4 lg:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl h-[100dvh] md:h-[90vh] overflow-y-auto rounded-none md:rounded-2xl bg-white shadow-2xl flex flex-col no-scrollbar"
          >
            {/* Header */}
            <div className="sticky top-0 z-30 flex items-center justify-between border-b bg-white/80 backdrop-blur-md px-4 py-3 shrink-0">
              <button 
                onClick={onClose} 
                className="p-1 rounded-full hover:bg-gray-100 transition-colors text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
              <h2 className="font-bold text-base md:text-lg tracking-tight">{user.name}</h2>
              <button 
                onClick={onEditProfile} 
                className="p-1 rounded-full hover:bg-gray-100 transition-colors text-gray-700"
              >
                <Settings className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1">
              <div className="p-4 md:p-10 lg:p-12">
                {/* Profile Info Section */}
                <div className="flex flex-row items-center gap-6 md:gap-16 mb-8 md:mb-14">
                  <div className="relative shrink-0">
                    <div className="h-20 w-20 sm:h-28 sm:w-28 md:h-36 md:w-36 lg:h-44 lg:w-44 overflow-hidden rounded-full border border-gray-100 p-0.5 md:p-1 bg-gradient-to-tr from-yellow-400 to-fuchsia-600">
                      <div className="h-full w-full rounded-full border-2 border-white overflow-hidden bg-white">
                        <img 
                          src={user.avatar} 
                          alt="Profile" 
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
                      <h3 className="text-xl md:text-2xl font-light text-gray-900 truncate max-w-full">
                        {user.name}
                      </h3>
                      <div className="flex gap-2 w-full md:w-auto">
                        <button 
                          onClick={onEditProfile}
                          className="flex-1 md:flex-none rounded-lg bg-gray-100 px-6 py-1.5 text-sm font-semibold hover:bg-gray-200 transition-colors active:scale-95"
                        >
                          Edit Profile
                        </button>
                        <button className="rounded-lg bg-gray-100 px-2.5 py-1.5 hover:bg-gray-200 md:hidden">
                          <Settings className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="hidden md:flex items-center gap-10 text-base">
                      <span className="text-gray-900"><strong className="font-semibold">{posts.length}</strong> posts</span>
                      <span className="text-gray-900"><strong className="font-semibold">1.2K</strong> followers</span>
                      <span className="text-gray-900"><strong className="font-semibold">850</strong> following</span>
                    </div>

                    <div className="mt-4 hidden md:block">
                      <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-600 mt-0.5">Digital Creator & Explorer 🌌</p>
                    </div>
                  </div>
                </div>

                {/* Mobile Bio */}
                <div className="md:hidden mb-6 px-1">
                  <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-600 mt-0.5">Digital Creator & Explorer 🌌</p>
                </div>

                {/* Mobile Stats Bar */}
                <div className="flex md:hidden items-center justify-around border-t border-gray-100 py-3 mb-2 text-sm text-center">
                  <div className="flex flex-col flex-1">
                    <span className="font-bold text-gray-900">{posts.length}</span>
                    <span className="text-gray-500 text-xs uppercase tracking-wide">posts</span>
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="font-bold text-gray-900">1.2K</span>
                    <span className="text-gray-500 text-xs uppercase tracking-wide">followers</span>
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="font-bold text-gray-900">850</span>
                    <span className="text-gray-500 text-xs uppercase tracking-wide">following</span>
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-t border-gray-100 -mx-4 md:mx-0">
                  <div className="flex justify-center gap-12 sm:gap-20">
                    <button 
                      onClick={() => setActiveTab('posts')}
                      className={`relative flex items-center gap-2 py-4 text-[10px] sm:text-xs font-bold uppercase tracking-[0.1em] transition-all duration-300 ${activeTab === 'posts' ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <Grid className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      Posts
                      {activeTab === 'posts' && (
                        <motion.div layoutId="tab-underline" className="absolute top-[-1px] left-0 right-0 h-0.5 bg-black" />
                      )}
                    </button>
                    <button 
                      onClick={() => setActiveTab('saved')}
                      className={`relative flex items-center gap-2 py-4 text-[10px] sm:text-xs font-bold uppercase tracking-[0.1em] transition-all duration-300 ${activeTab === 'saved' ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <Bookmark className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      Saved
                      {activeTab === 'saved' && (
                        <motion.div layoutId="tab-underline" className="absolute top-[-1px] left-0 right-0 h-0.5 bg-black" />
                      )}
                    </button>
                    <button 
                      onClick={() => setActiveTab('liked')}
                      className={`relative flex items-center gap-2 py-4 text-[10px] sm:text-xs font-bold uppercase tracking-[0.1em] transition-all duration-300 ${activeTab === 'liked' ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      Liked
                      {activeTab === 'liked' && (
                        <motion.div layoutId="tab-underline" className="absolute top-[-1px] left-0 right-0 h-0.5 bg-black" />
                      )}
                    </button>
                  </div>

                  {/* Grid */}
                  {displayPosts.length > 0 ? (
                    <div className="grid grid-cols-3 gap-0.5 md:gap-4 lg:gap-8 mt-4 md:mt-8">
                      {displayPosts.map((post) => (
                        <motion.div 
                          key={post.id} 
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="aspect-square w-full bg-gray-100 overflow-hidden group relative cursor-pointer"
                        >
                          <img 
                            src={post.imageUrl} 
                            alt="" 
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-4 md:gap-6 backdrop-blur-[2px]">
                            <div className="flex items-center gap-1.5 md:gap-2 font-bold text-sm md:text-lg">
                              <Heart className="h-5 w-5 md:h-6 md:w-6 fill-white" /> 
                              {post.likes}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center justify-center py-20 md:py-32 text-gray-500 bg-gray-50/50 rounded-xl mt-8"
                    >
                      <div className="mb-4 p-4 rounded-full border border-gray-200">
                        {activeTab === 'posts' ? <Grid className="h-8 w-8" /> : activeTab === 'saved' ? <Bookmark className="h-8 w-8" /> : <Heart className="h-8 w-8" />}
                      </div>
                      <p className="text-base font-semibold text-gray-900">No {activeTab} yet</p>
                      <p className="text-sm mt-1">When you share or {activeTab.slice(0, -1)} posts, they'll appear here.</p>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

