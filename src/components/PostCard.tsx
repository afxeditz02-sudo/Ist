import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FC, useState } from 'react';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
  onLike?: (id: string) => void;
}

const PostCard: FC<PostCardProps> = ({ post, onLike }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showHeartOverlay, setShowHeartOverlay] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (onLike) onLike(post.id);
  };

  const handleDoubleTap = () => {
    if (!isLiked) {
      setIsLiked(true);
      if (onLike) onLike(post.id);
    }
    setShowHeartOverlay(true);
    setTimeout(() => setShowHeartOverlay(false), 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto mb-8 w-full max-w-lg border-gray-100 bg-white md:rounded-xl md:border md:shadow-sm"
    >
      {/* Post Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
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

      {/* Post Image */}
      <div 
        className="relative aspect-square w-full overflow-hidden bg-gray-50 cursor-pointer"
        onDoubleClick={handleDoubleTap}
      >
        <img 
          src={post.imageUrl} 
          alt={post.caption} 
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />
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
              <Heart className={`h-6 w-6 transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'hover:text-gray-600'}`} />
            </motion.button>
            <motion.button whileTap={{ scale: 1.2 }}>
              <MessageCircle className="h-6 w-6 hover:text-gray-600" />
            </motion.button>
            <motion.button whileTap={{ scale: 1.2 }}>
              <Send className="h-6 w-6 hover:text-gray-600" />
            </motion.button>
          </div>
          <motion.button whileTap={{ scale: 1.2 }}>
            <Bookmark className="h-6 w-6 hover:text-gray-600" />
          </motion.button>
        </div>

        {/* Likes and Caption */}
        <div className="space-y-1">
          <p className="text-sm font-bold">{(post.likes + (isLiked ? 1 : 0)).toLocaleString()} likes</p>
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

