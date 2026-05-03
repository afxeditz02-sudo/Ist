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
  syncUserProfile,
  followUser,
  getUserProfile,
  updateProfile // Add this import
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
  const [viewingProfileUid, setViewingProfileUid] = useState<string | null>(null);
  const [viewingProfileData, setViewingProfileData] = useState<Author | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [viewingStoryIndex, setViewingStoryIndex] = useState<number | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        setUser(firebaseUser);
        if (firebaseUser) {
          // Fetch full profile to get followers/following
          const profile = await getUserProfile(firebaseUser.uid);
          if (profile) {
            setCurrentUser(profile);
          } else {
            const newAuthor: Author = {
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || 'Anonymous',
              avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`,
              followers: [],
              following: [],
            };
            setCurrentUser(newAuthor);
            syncUserProfile({ ...newAuthor, email: firebaseUser.email });
          }
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("Auth state change error:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (viewingProfileUid) {
      getUserProfile(viewingProfileUid).then(setViewingProfileData);
    } else {
      setViewingProfileData(null);
    }
  }, [viewingProfileUid]);

  useEffect(() => {
    if (!user) return;

    const unsubPosts = subscribeToPosts((allPosts) => {
      const processedPosts = allPosts.map(p => {
        // Handle legacy schema where imageUrl was a single string
        const imageUrls = p.imageUrls || ((p as any).imageUrl ? [(p as any).imageUrl] : []);
        return {
          ...p,
          imageUrls,
          isLiked: p.likedBy?.includes(user.uid),
          isSaved: p.savedBy?.includes(user.uid),
        };
      });
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

  if (!user) {
    return <Login onLogin={() => {}} />;
  }

  // If user is authenticated but profile isn't loaded yet (and not loading)
  // This could happen if fetch failed. We should still show something.
  if (!currentUser) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6 text-center">
        <Camera className="h-12 w-12 text-gray-300 mb-4" />
        <h2 className="text-xl font-bold">Finishing setup...</h2>
        <p className="text-gray-500 mb-6">We're getting your profile ready.</p>
        <button 
          onClick={() => window.location.reload()}
          className="rounded-lg bg-black px-6 py-2 text-white font-semibold"
        >
          Try Reloading
        </button>
      </div>
    );
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

  const userPosts = posts.filter(p => p.author.uid === currentUser.uid);
  const savedPosts = posts.filter(p => p.isSaved);
  const likedPosts = posts.filter(p => p.isLiked);

  const handleUpdateProfile = async (updatedUser: Author) => {
    if (!user) return;
    await updateProfile(user.uid, updatedUser);
    setCurrentUser(updatedUser);
  };

  const handleFollow = async (targetUid: string) => {
    if (!currentUser) return;
    const isFollowing = currentUser.following?.includes(targetUid) || false;
    await followUser(currentUser.uid, targetUid, isFollowing);
    
    // Optimistic update
    const updatedFollowing = isFollowing 
      ? (currentUser.following || []).filter(id => id !== targetUid)
      : [...(currentUser.following || []), targetUid];
    
    setCurrentUser({ ...currentUser, following: updatedFollowing });

    if (viewingProfileData && viewingProfileData.uid === targetUid) {
      const updatedFollowers = isFollowing
        ? (viewingProfileData.followers || []).filter(id => id !== currentUser.uid)
        : [...(viewingProfileData.followers || []), currentUser.uid];
      setViewingProfileData({ ...viewingProfileData, followers: updatedFollowers });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0 md:pl-20 xl:pl-64">
      <Navbar 
        onAddPost={() => setIsModalOpen(true)} 
        onProfileClick={() => setViewingProfileUid(currentUser.uid)}
        onHomeClick={() => setViewingProfileUid(null)}
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
                onAuthorClick={(uid) => setViewingProfileUid(uid)}
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
        isOpen={!!viewingProfileUid} 
        onClose={() => setViewingProfileUid(null)} 
        user={viewingProfileData || currentUser}
        posts={posts.filter(p => p.author.uid === viewingProfileUid)}
        savedPosts={viewingProfileUid === currentUser.uid ? savedPosts : []}
        likedPosts={viewingProfileUid === currentUser.uid ? likedPosts : []}
        isOwnProfile={viewingProfileUid === currentUser.uid}
        isFollowing={currentUser.following?.includes(viewingProfileUid || '') || false}
        onFollow={() => viewingProfileUid && handleFollow(viewingProfileUid)}
        onEditProfile={() => setIsSettingsOpen(true)}
      />

      <ProfileSettings 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        user={currentUser}
        onUpdate={handleUpdateProfile}
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
