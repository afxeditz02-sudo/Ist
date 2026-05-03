import { Search, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useMemo } from 'react';
import { Post } from '../types';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  posts: Post[];
  onUserClick: (uid: string) => void;
}

export default function SearchOverlay({ isOpen, onClose, posts, onUserClick }: SearchOverlayProps) {
  const [query, setQuery] = useState('');

  const filteredPosts = useMemo(() => {
    if (!query.trim()) return [];
    
    const searchTerms = query.toLowerCase().split(' ');
    
    return posts.filter(post => {
      const captionMatch = post.caption.toLowerCase().includes(query.toLowerCase());
      const authorMatch = post.author.name.toLowerCase().includes(query.toLowerCase());
      
      // Also check individual terms for better fuzzy matching
      const termMatch = searchTerms.every(term => 
        post.caption.toLowerCase().includes(term) || 
        post.author.name.toLowerCase().includes(term)
      );

      return captionMatch || authorMatch || termMatch;
    });
  }, [query, posts]);

  // Group by users for a "User Search" section
  const uniqueUsers = useMemo(() => {
    const users = new Map<string, typeof posts[0]['author']>();
    filteredPosts.forEach(post => {
      if (!users.has(post.author.uid)) {
        users.set(post.author.uid, post.author);
      }
    });
    return Array.from(users.values());
  }, [filteredPosts]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm pt-20 px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center border-b p-4">
              <Search className="mr-3 h-5 w-5 text-gray-400" />
              <input
                autoFocus
                type="text"
                placeholder="Search captions or usernames..."
                className="flex-1 bg-transparent text-lg outline-none placeholder:text-gray-400"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button 
                onClick={onClose}
                className="rounded-full p-2 hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-4 custom-scrollbar">
              {!query ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <Search className="mb-4 h-12 w-12 opacity-20" />
                  <p className="text-sm">Type to start searching posts and people</p>
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <p className="text-sm font-medium">No results found for "{query}"</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {uniqueUsers.length > 0 && (
                    <div>
                      <h3 className="mb-3 px-2 text-xs font-bold uppercase tracking-wider text-gray-400">Users</h3>
                      <div className="space-y-1">
                        {uniqueUsers.map(user => (
                          <button
                            key={user.uid}
                            onClick={() => {
                              onUserClick(user.uid);
                              onClose();
                            }}
                            className="flex w-full items-center gap-3 rounded-xl p-2 transition-colors hover:bg-gray-50 active:bg-gray-100"
                          >
                            <img src={user.avatar} alt="" className="h-10 w-10 rounded-full border bg-gray-100" />
                            <div className="flex flex-col items-start">
                              <span className="font-semibold text-gray-900">{user.name}</span>
                              <span className="text-xs text-gray-500">View Profile</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="mb-3 px-2 text-xs font-bold uppercase tracking-wider text-gray-400">Posts</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {filteredPosts.map(post => (
                        <div
                          key={post.id}
                          className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-gray-100 shadow-sm transition-all hover:shadow-md"
                          onClick={() => {
                            // In a real app we might scroll to this post or open a detail view
                            // For now, let's go to the author's profile as a placeholder or close
                            onUserClick(post.author.uid);
                            onClose();
                          }}
                        >
                          <img 
                            src={post.imageUrls?.[0] || (post as any).imageUrl} 
                            alt="" 
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                             <div className="px-2 text-center text-[10px] font-medium text-white line-clamp-2">
                               {post.caption}
                             </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
