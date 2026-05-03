import { X, Upload, ImageIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
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
  const [images, setImages] = useState<string[]>([]);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length === 0) return;

    // Limit to 20 images
    const selectedFiles = files.slice(0, 20 - images.length);

    selectedFiles.forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result as string].slice(0, 20));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (images.length === 0) return;
    
    onPost({
      imageUrls: images,
      caption,
    });
    
    reset();
    onClose();
  };

  const reset = () => {
    setCaption('');
    setImages([]);
    setCurrentPreviewIndex(0);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    if (currentPreviewIndex >= images.length - 1) {
      setCurrentPreviewIndex(Math.max(0, images.length - 2));
    }
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
            className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b px-4 py-3">
              <button onClick={onClose} className="text-gray-500 hover:text-black">
                <X className="h-6 w-6" />
              </button>
              <h2 className="font-semibold text-lg">Create New Post</h2>
              <button 
                onClick={handleSubmit}
                disabled={images.length === 0}
                className="text-blue-500 font-semibold disabled:opacity-50"
              >
                Share
              </button>
            </div>

            <div className="p-6">
              {images.length === 0 ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-gray-200 py-16 transition-colors hover:bg-gray-50 cursor-pointer"
                >
                  <div className="rounded-full bg-blue-50 p-4 font-blue-500">
                    <ImageIcon className="h-10 w-10 text-blue-500" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium">Select photos from your device</p>
                    <p className="text-sm text-gray-500">Click to browse (up to 20 images)</p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    multiple
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                  />
                </div>
              ) : (
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-100 group">
                      <img 
                        src={images[currentPreviewIndex]} 
                        alt="Preview" 
                        className="h-full w-full object-cover" 
                      />
                      
                      {images.length > 1 && (
                        <>
                          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
                            {images.map((_, i) => (
                              <div 
                                key={i}
                                className={`h-1.5 w-1.5 rounded-full transition-all ${i === currentPreviewIndex ? 'bg-white w-3' : 'bg-white/50'}`}
                              />
                            ))}
                          </div>
                          <button 
                            onClick={() => setCurrentPreviewIndex(prev => Math.max(0, prev - 1))}
                            disabled={currentPreviewIndex === 0}
                            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-1 text-white backdrop-blur-sm disabled:opacity-0"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={() => setCurrentPreviewIndex(prev => Math.min(images.length - 1, prev + 1))}
                            disabled={currentPreviewIndex === images.length - 1}
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-1 text-white backdrop-blur-sm disabled:opacity-0"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </button>
                        </>
                      )}
                    </div>
                    
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                      {images.map((img, i) => (
                        <div 
                          key={i} 
                          className={`relative h-16 w-16 shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 transition-all ${i === currentPreviewIndex ? 'border-blue-500 scale-105' : 'border-transparent'}`}
                          onClick={() => setCurrentPreviewIndex(i)}
                        >
                          <img src={img} alt="" className="h-full w-full object-cover" />
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage(i);
                            }}
                            className="absolute right-0.5 top-0.5 rounded-full bg-black/50 p-0.5 text-white"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                      {images.length < 20 && (
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-gray-400 hover:bg-gray-50"
                        >
                          <Plus className="h-6 w-6" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="w-full md:w-64 space-y-4">
                    <textarea
                      placeholder="Write a caption..."
                      className="w-full resize-none border-none p-0 text-sm focus:ring-0"
                      rows={4}
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                    />
                    <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                      {images.length} / 20 Images
                    </div>
                  </div>
                </div>
              )}
            </div>
            <input 
              type="file" 
              className="hidden" 
              multiple
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
