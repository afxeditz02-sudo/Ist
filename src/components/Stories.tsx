import { Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { Story, Author } from '../types';
import { useRef, ChangeEvent } from 'react';

interface StoriesProps {
  stories: Story[];
  currentUser: Author;
  onAddStory: (imageUrl: string) => void;
  onViewStory: (index: number) => void;
}

export default function Stories({ stories, currentUser, onAddStory, onViewStory }: StoriesProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onAddStory(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const myStories = stories.filter(s => s.author.uid === currentUser.uid);
  const hasMyStories = myStories.length > 0;
  const allMyStoriesViewed = hasMyStories && myStories.every(s => s.isViewed);

  const handleYourStoryClick = () => {
    if (hasMyStories) {
      const firstUnviewed = stories.findIndex(s => s.author.uid === currentUser.uid && !s.isViewed);
      const firstIndex = stories.findIndex(s => s.author.uid === currentUser.uid);
      onViewStory(firstUnviewed !== -1 ? firstUnviewed : firstIndex);
    } else {
      fileInputRef.current?.click();
    }
  };

  // Group stories by author (excluding current user)
  const storiesByAuthor = stories.reduce((acc, story) => {
    if (story.author.uid === currentUser.uid) return acc;
    if (!acc[story.author.uid]) {
      acc[story.author.uid] = [];
    }
    acc[story.author.uid].push(story);
    return acc;
  }, {} as Record<string, Story[]>);

  const authorIds = Object.keys(storiesByAuthor);

  return (
    <div className="mb-6 flex w-full items-center gap-4 overflow-x-auto pb-4 scrollbar-hide no-scrollbar">
      {/* Current User Story Slot */}
      <div className="flex flex-col items-center gap-1 shrink-0">
        <div className="relative cursor-pointer" onClick={handleYourStoryClick}>
          <div className={`p-[2px] rounded-full ${hasMyStories ? (allMyStoriesViewed ? 'bg-gray-300' : 'bg-gradient-to-tr from-yellow-400 via-orange-500 to-purple-600') : ''}`}>
            <div className="h-16 w-16 md:h-18 md:w-18 overflow-hidden rounded-full border-2 border-white bg-white">
              <img 
                src={currentUser.avatar} 
                alt="My Avatar" 
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          {!hasMyStories && (
            <div className="absolute bottom-1 right-1 rounded-full bg-blue-500 p-0.5 text-white border-2 border-white">
              <Plus className="h-3 w-3" />
            </div>
          )}
          <input 
            type="file" 
            className="hidden" 
            accept="image/*" 
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>
        <span className="text-[10px] text-gray-400 font-medium tracking-tight">Your Story</span>
      </div>

      {/* Grouped Other Stories */}
      {authorIds.map((authorId) => {
        const userStories = storiesByAuthor[authorId];
        const latestStory = userStories[0]; // Since they are sorted by createdAt desc
        const hasUnviewed = userStories.some(s => !s.isViewed);
        
        // Find the index of the first unviewed story for this author in the main stories array
        // or just the oldest story (which would be at the end of the userStories array if it's sorted desc)
        // Actually, Instagram behavior is: first unviewed. If all viewed, first story.
        // main stories array is sorted desc. So we want the one with lowest index that belongs to author and is unviewed?
        // Wait, if it's sorted desc, and we want to go from oldest to newest...
        // Main array: [Newest, ..., Oldest]
        // Index within main array:
        const firstUnviewedIndex = stories.findLastIndex(s => s.author.uid === authorId && !s.isViewed);
        const oldestIndex = stories.findLastIndex(s => s.author.uid === authorId);
        const targetIndex = firstUnviewedIndex !== -1 ? firstUnviewedIndex : oldestIndex;

        return (
          <motion.div 
            key={authorId}
            whileTap={{ scale: 0.9 }}
            onClick={() => onViewStory(targetIndex)}
            className="flex flex-col items-center gap-1 shrink-0 cursor-pointer"
          >
            <div className={`p-[2px] rounded-full ${!hasUnviewed ? 'bg-gray-300' : 'bg-gradient-to-tr from-yellow-400 via-orange-500 to-purple-600'}`}>
              <div className="h-16 w-16 md:h-18 md:w-18 overflow-hidden rounded-full border-2 border-white bg-white">
                <img 
                  src={latestStory.imageUrl} 
                  alt={latestStory.author.name} 
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <span className="text-[10px] text-gray-400 font-medium truncate w-16 text-center tracking-tight">{latestStory.author.name}</span>
          </motion.div>
        );
      })}
    </div>
  );
}
