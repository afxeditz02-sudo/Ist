/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import PostCard from './components/PostCard';
import CreatePost from './components/CreatePost';
import Stories from './components/Stories';
import StoryViewer from './components/StoryViewer';
import Profile from './components/Profile';
import { Post, Story } from './types';

const INITIAL_STORIES: Story[] = [
  {
    id: 's1',
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=600&auto=format&fit=crop',
    author: { name: 'art_gallery', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Art' },
    createdAt: Date.now(),
    isViewed: false,
  },
  {
    id: 's2',
    imageUrl: 'https://images.unsplash.com/photo-1493246507139-91e8bef99c02?q=80&w=600&auto=format&fit=crop',
    author: { name: 'traveler', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Travel' },
    createdAt: Date.now(),
    isViewed: false,
  },
  {
    id: 's3',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop',
    author: { name: 'foodie', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Food' },
    createdAt: Date.now(),
    isViewed: true,
  }
];

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
  const [stories, setStories] = useState<Story[]>(() => {
    const saved = localStorage.getItem('instaclone-stories');
    return saved ? JSON.parse(saved) : INITIAL_STORIES;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [viewingStoryIndex, setViewingStoryIndex] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem('instaclone-posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('instaclone-stories', JSON.stringify(stories));
  }, [stories]);

  const handleCreatePost = (newPostData: Omit<Post, 'id' | 'likes' | 'createdAt' | 'author'>) => {
    const newPost: Post = {
      ...newPostData,
      id: Math.random().toString(36).substring(7),
      likes: 0,
      createdAt: Date.now(),
      author: {
        name: 'afxeditz02', 
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=afxeditz02',
      },
    };
    setPosts([newPost, ...posts]);
  };

  const handleAddStory = (imageUrl: string) => {
    const newStory: Story = {
      id: Math.random().toString(36).substring(7),
      imageUrl,
      author: {
        name: 'afxeditz02',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=afxeditz02',
      },
      createdAt: Date.now(),
      isViewed: false,
    };
    setStories([newStory, ...stories]);
  };

  const markStoryViewed = (index: number) => {
    setStories(prev => prev.map((s, i) => i === index ? { ...s, isViewed: true } : s));
    setViewingStoryIndex(index);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0 md:pl-20 xl:pl-64">
      <Navbar 
        onAddPost={() => setIsModalOpen(true)} 
        onProfileClick={() => setIsProfileOpen(true)}
      />
      
      <main className="mx-auto w-full px-4 py-8">
        <div className="mx-auto w-full max-w-lg">
          <Stories 
            stories={stories} 
            onAddStory={handleAddStory} 
            onViewStory={markStoryViewed}
          />
        </div>

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

      <Profile 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        postCount={posts.filter(p => p.author.name === 'afxeditz02').length}
      />

      <StoryViewer 
        stories={stories} 
        initialIndex={viewingStoryIndex ?? 0}
        isOpen={viewingStoryIndex !== null}
        onClose={() => setViewingStoryIndex(null)}
      />
    </div>
  );
}


