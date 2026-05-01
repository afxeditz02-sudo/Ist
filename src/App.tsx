/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import PostCard from './components/PostCard';
import CreatePost from './components/CreatePost';
import { Post } from './types';

const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?q=80&w=1000&auto=format&fit=crop',
    caption: 'Chasing sunsets in the mountains. 🏔️✨',
    author: {
      name: 'adventure_seeker',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    },
    likes: 1240,
    createdAt: Date.now() - 3600000 * 24,
  },
  {
    id: '2',
    imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1000&auto=format&fit=crop',
    caption: 'Serenity found. #explore #nature',
    author: {
      name: 'nature_lover',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lily',
    },
    likes: 852,
    createdAt: Date.now() - 3600000 * 48,
  }
];

export default function App() {
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('instaclone-posts');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('instaclone-posts', JSON.stringify(posts));
  }, [posts]);

  const handleCreatePost = (newPostData: Omit<Post, 'id' | 'likes' | 'createdAt' | 'author'>) => {
    const newPost: Post = {
      ...newPostData,
      id: Math.random().toString(36).substring(7),
      likes: 0,
      createdAt: Date.now(),
      author: {
        name: 'afxeditz02', // User's name from context
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=afxeditz02',
      },
    };
    setPosts([newPost, ...posts]);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pt-20">
      <Navbar onAddPost={() => setIsModalOpen(true)} />
      
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-col items-center">
          {posts.length > 0 ? (
            posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <p className="text-xl font-medium">No posts yet</p>
              <p>Be the first to share a moment!</p>
            </div>
          )}
        </div>
      </main>

      <CreatePost 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onPost={handleCreatePost} 
      />
    </div>
  );
}

