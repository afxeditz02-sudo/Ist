import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import { motion } from 'motion/react';
import { FC } from 'react';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
}

const PostCard: FC<PostCardProps> = ({ post }) => {
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
      <div className="aspect-square w-full overflow-hidden bg-gray-50">
        <img 
          src={post.imageUrl} 
          alt={post.caption} 
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Post Actions */}
      <div className="p-3">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button whileTap={{ scale: 1.2 }}>
              <Heart className="h-6 w-6 hover:text-red-500" />
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
