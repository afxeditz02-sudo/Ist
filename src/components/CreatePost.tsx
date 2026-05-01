import { X, Upload, ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { Post } from '../types';

interface CreatePostProps {
  isOpen: boolean;
  onClose: () => void;
  onPost: (post: Omit<Post, 'id' | 'likes' | 'createdAt' | 'author'>) => void;
}

export default function CreatePost({ isOpen, onClose, onPost }: CreatePostProps) {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!image) return;
    
    onPost({
      imageUrl: image,
      caption,
    });
    
    reset();
    onClose();
  };

  const reset = () => {
    setCaption('');
    setImage(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b px-4 py-3">
              <button onClick={onClose} className="text-gray-500 hover:text-black">
                <X className="h-6 w-6" />
              </button>
              <h2 className="font-semibold text-lg">Create New Post</h2>
              <button 
                onClick={handleSubmit}
                disabled={!image}
                className="text-blue-500 font-semibold disabled:opacity-50"
              >
                Share
              </button>
            </div>

            <div className="p-6">
              {!image ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-gray-200 py-16 transition-colors hover:bg-gray-50 cursor-pointer"
                >
                  <div className="rounded-full bg-blue-50 p-4 font-blue-500">
                    <ImageIcon className="h-10 w-10 text-blue-500" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium">Select a photo from your device</p>
                    <p className="text-sm text-gray-500">Click to browse files</p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="aspect-square w-full overflow-hidden rounded-xl bg-gray-100">
                    <img src={image} alt="Preview" className="h-full w-full object-cover" />
                  </div>
                  <textarea
                    placeholder="Write a caption..."
                    className="w-full resize-none border-none p-0 text-sm focus:ring-0"
                    rows={4}
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                  />
                  <button 
                    onClick={() => setImage(null)}
                    className="text-xs text-red-500 font-medium underline"
                  >
                    Replace Image
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
