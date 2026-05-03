/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import Navbar from './components/Navbar';
import PostCard from './components/PostCard';
import CreatePost from './components/CreatePost';
import Stories from './components/Stories';
import StoryViewer from './components/StoryViewer';
import Profile from './components/Profile';
import ProfileSettings from './components/ProfileSettings';
import Login from './components/Login';
import { auth } from './lib/firebase';
import { 
  subscribeToPosts, 
  subscribeToStories, 
  createPost, 
  createStory, 
  likePost, 
  savePost, 
  markStoryViewed,
  syncUserProfile
} from './services/dataService';
import { Post, Story, Author } from './types';
import { Camera, Loader2 } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [currentUser, setCurrentUser] = useState<Author | null>(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [viewingStoryIndex, setViewingStoryIndex] = useState<number | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const author: Author = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || 'Anonymous',
          avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`,
        };
        setCurrentUser(author);
        syncUserProfile({ ...author, email: firebaseUser.email });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const unsubPosts = subscribeToPosts((allPosts) => {
      const processedPosts = allPosts.map(p => ({
        ...p,
        isLiked: p.likedBy?.includes(user.uid),
        isSaved: p.savedBy?.includes(user.uid),
      }));
      setPosts(processedPosts);
    });

    const unsubStories = subscribeToStories((allStories) => {
      const processedStories = allStories.map(s => ({
        ...s,
        isViewed: s.viewedBy?.includes(user.uid),
      }));
      setStories(processedStories);
    });

    return () => {
      unsubPosts();
      unsubStories();
    };
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!user || !currentUser) {
    return <Login onLogin={() => {}} />;
  }

  const handleCreatePost = async (newPostData: Omit<Post, 'id' | 'likes' | 'createdAt' | 'author'>) => {
    await createPost({
      ...newPostData,
      author: currentUser,
    });
  };

  const handleAddStory = async (imageUrl: string) => {
    await createStory(imageUrl, currentUser);
  };

  const handleLike = async (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    await likePost(postId, user.uid, !!post.isLiked);
  };

  const handleSave = async (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    await savePost(postId, user.uid, !!post.isSaved);
  };

  const handleStoryView = async (index: number) => {
    const story = stories[index];
    if (story && !story.isViewed) {
      await markStoryViewed(story.id, user.uid);
    }
    setViewingStoryIndex(index);
  };

  const userPosts = posts.filter(p => p.author.name === currentUser.name);
  const savedPosts = posts.filter(p => p.isSaved);
  const likedPosts = posts.filter(p => p.isLiked);

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
            currentUser={currentUser}
            onAddStory={handleAddStory} 
            onViewStory={handleStoryView}
          />
        </div>

        <div className="flex flex-col items-center">
          {posts.length > 0 ? (
            posts.map((post) => (
              <PostCard 
                key={post.id} 
                post={post} 
                onLike={handleLike}
                onSave={handleSave}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <div className="mb-4 rounded-full border-2 border-gray-400 p-4">
                <Camera className="h-12 w-12" />
              </div>
              <p className="text-xl font-medium text-black">No posts yet</p>
              <p className="text-sm">When you share photos, they will appear on your profile.</p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="mt-4 text-sm font-semibold text-blue-500 shadow-none hover:text-blue-700"
              >
                Share your first photo
              </button>
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
        user={currentUser}
        posts={userPosts}
        savedPosts={savedPosts}
        likedPosts={likedPosts}
        onEditProfile={() => setIsSettingsOpen(true)}
      />

      <ProfileSettings 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        user={currentUser}
        onUpdate={setCurrentUser}
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
