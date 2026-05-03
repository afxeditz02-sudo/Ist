import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { FC, useState } from 'react';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
  onLike?: (id: string) => void;
  onSave?: (id: string) => void;
  onAuthorClick?: (uid: string) => void;
}

const PostCard: FC<PostCardProps> = ({ post, onLike, onSave, onAuthorClick }) => {
  const [showHeartOverlay, setShowHeartOverlay] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleLike = () => {
    if (onLike) onLike(post.id);
  };

  const handleSave = () => {
    if (onSave) onSave(post.id);
  };

  const handleDoubleTap = () => {
    if (!post.isLiked) {
      if (onLike) onLike(post.id);
    }
    setShowHeartOverlay(true);
    setTimeout(() => setShowHeartOverlay(false), 800);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (post.imageUrls && currentImageIndex < post.imageUrls.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto mb-8 w-full max-w-lg border-gray-100 bg-white md:rounded-xl md:border md:shadow-sm"
    >
      {/* Post Header */}
      <div className="flex items-center justify-between p-3">
        <div 
          className="flex cursor-pointer items-center gap-3 transition-opacity hover:opacity-70"
          onClick={() => onAuthorClick?.(post.author.uid)}
        >
          <div className="h-8 w-8 overflow-hidden rounded-full border border-gray-200">
            <img 
              src={post.author.avatar} 
              alt={post.author.name} 
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="text-sm font-semibold">{post.author.name}</span>
        </div>
        <button className="text-gray-500">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      {/* Post Image(s) */}
      <div 
        className="relative aspect-square w-full overflow-hidden bg-gray-50 cursor-pointer group"
        onDoubleClick={handleDoubleTap}
      >
        <motion.div 
          className="flex h-full w-full transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
        >
          {post.imageUrls?.map((url, i) => (
            <img 
              key={i}
              src={url} 
              alt={post.caption} 
              className="h-full w-full shrink-0 object-cover"
              referrerPolicy="no-referrer"
            />
          ))}
        </motion.div>

        {post.imageUrls && post.imageUrls.length > 1 && (
          <>
            <div className="absolute right-3 top-3 rounded-full bg-black/70 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-md">
              {currentImageIndex + 1}/{post.imageUrls.length}
            </div>
            
            <button 
              onClick={prevImage}
              className={`absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 text-gray-800 shadow-md transition-opacity hover:bg-white ${currentImageIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-0 group-hover:opacity-100'}`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button 
              onClick={nextImage}
              className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 text-gray-800 shadow-md transition-opacity hover:bg-white ${currentImageIndex === post.imageUrls?.length - 1 ? 'opacity-0 pointer-events-none' : 'opacity-0 group-hover:opacity-100'}`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        <AnimatePresence>
          {showHeartOverlay && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <Heart className="h-24 w-24 text-white fill-white drop-shadow-xl" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Post Actions */}
      <div className="p-3">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button 
              whileTap={{ scale: 1.4 }}
              onClick={handleLike}
            >
              <Heart className={`h-6 w-6 transition-colors ${post.isLiked ? 'fill-red-500 text-red-500' : 'hover:text-gray-600'}`} />
            </motion.button>
            <motion.button whileTap={{ scale: 1.2 }}>
              <MessageCircle className="h-6 w-6 hover:text-gray-600" />
            </motion.button>
            <motion.button whileTap={{ scale: 1.2 }}>
              <Send className="h-6 w-6 hover:text-gray-600" />
            </motion.button>
          </div>

          {/* Dots Indicator */}
          {post.imageUrls && post.imageUrls.length > 1 && (
            <div className="flex gap-1">
              {post.imageUrls.map((_, i) => (
                <div 
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full transition-all ${i === currentImageIndex ? 'bg-blue-500' : 'bg-gray-200'}`}
                />
              ))}
            </div>
          )}

          <motion.button 
            whileTap={{ scale: 1.2 }}
            onClick={handleSave}
          >
            <Bookmark className={`h-6 w-6 transition-colors ${post.isSaved ? 'fill-black text-black' : 'hover:text-gray-600'}`} />
          </motion.button>
        </div>

        {/* Likes and Caption */}
        <div className="space-y-1">
          <p className="text-sm font-bold">{post.likes.toLocaleString()} likes</p>
          <p className="text-sm">
            <span className="mr-2 font-bold">{post.author.name}</span>
            {post.caption}
          </p>
          <p className="text-xs text-gray-400 uppercase tracking-tight">
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default PostCard;

