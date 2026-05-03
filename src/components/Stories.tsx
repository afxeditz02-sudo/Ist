import { Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { Story } from '../types';
import { useRef, ChangeEvent } from 'react';

interface StoriesProps {
  stories: Story[];
  onAddStory: (imageUrl: string) => void;
  onViewStory: (index: number) => void;
}

export default function Stories({ stories, onAddStory, onViewStory }: StoriesProps) {
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

  return (
    <div className="mb-6 flex w-full items-center gap-4 overflow-x-auto pb-4 scrollbar-hide no-scrollbar">
      {/* Current User Add Story */}
      <div className="flex flex-col items-center gap-1 shrink-0">
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="relative h-16 w-16 cursor-pointer"
        >
          <div className="h-full w-full overflow-hidden rounded-full border-2 border-gray-200">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=afxeditz02" 
              alt="My Avatar" 
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute bottom-0 right-0 rounded-full bg-blue-500 p-0.5 text-white border-2 border-white">
            <Plus className="h-3 w-3" />
          </div>
          <input 
            type="file" 
            className="hidden" 
            accept="image/*" 
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>
        <span className="text-[10px] text-gray-500">Your Story</span>
      </div>

      {/* Other Stories */}
      {stories.map((story, index) => (
        <motion.div 
          key={story.id}
          whileTap={{ scale: 0.9 }}
          onClick={() => onViewStory(index)}
          className="flex flex-col items-center gap-1 shrink-0 cursor-pointer"
        >
          <div className={`p-[2px] rounded-full ${story.isViewed ? 'bg-gray-300' : 'bg-gradient-to-tr from-yellow-400 via-orange-500 to-purple-600'}`}>
            <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-white bg-white">
              <img 
                src={story.imageUrl} 
                alt={story.author.name} 
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <span className="text-[10px] text-gray-500 truncate w-16 text-center">{story.author.name}</span>
        </motion.div>
      ))}
    </div>
  );
}
