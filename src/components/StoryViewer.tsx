import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Story } from '../types';
import { useState, useEffect } from 'react';

interface StoryViewerProps {
  stories: Story[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function StoryViewer({ stories, initialIndex, isOpen, onClose }: StoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + 1;
      });
    }, 50); // 5 seconds total

    return () => clearInterval(timer);
  }, [isOpen, currentIndex]);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setProgress(0);
  }, [initialIndex]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    }
  };

  if (!isOpen || stories.length === 0) return null;

  const story = stories[currentIndex];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black md:bg-black/90 md:p-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative h-full w-full max-w-lg overflow-hidden md:rounded-xl"
        >
          {/* Progress Bars */}
          <div className="absolute top-4 left-0 right-0 z-50 flex gap-1 px-4">
            {stories.map((_, idx) => (
              <div key={idx} className="h-0.5 flex-1 bg-white/30 overflow-hidden rounded-full">
                <div 
                  className="h-full bg-white transition-all duration-100 ease-linear"
                  style={{ 
                    width: idx < currentIndex ? '100%' : idx === currentIndex ? `${progress}%` : '0%' 
                  }}
                />
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="absolute top-8 left-0 right-0 z-50 flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <img src={story.author.avatar} alt="" className="h-8 w-8 rounded-full border border-white" />
              <div className="flex flex-col">
                 <span className="text-sm font-semibold text-white">{story.author.name}</span>
                 <span className="text-[10px] text-white/70">Just now</span>
              </div>
            </div>
            <button onClick={onClose} className="text-white hover:opacity-70">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation Controls */}
          <div className="absolute inset-0 z-40 flex">
            <div className="h-full w-1/3" onClick={handlePrev} />
            <div className="h-full w-2/3" onClick={handleNext} />
          </div>

          <button 
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 hidden md:flex rounded-full bg-white/10 p-2 text-white backdrop-blur-md hover:bg-white/20"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button 
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 hidden md:flex rounded-full bg-white/10 p-2 text-white backdrop-blur-md hover:bg-white/20"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Story Content */}
          <img 
            src={story.imageUrl} 
            alt="Story" 
            className="h-full w-full object-cover select-none"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
