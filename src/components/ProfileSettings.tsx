import { X, Camera, LogOut, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef, ChangeEvent } from 'react';
import { Author } from '../types';
import { auth } from '../lib/firebase';

interface ProfileSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  user: Author;
  onUpdate: (user: Author) => void;
}

export default function ProfileSettings({ isOpen, onClose, user, onUpdate }: ProfileSettingsProps) {
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    onUpdate({ ...user, name, avatar });
    onClose();
  };

  const handleAvatarChange = () => {
    const newSeed = Math.random().toString(36).substring(7);
    setAvatar(`https://api.dicebear.com/7.x/avataaars/svg?seed=${newSeed}`);
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    auth.signOut();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b px-4 py-3">
              <button onClick={onClose} className="text-sm font-medium">Cancel</button>
              <h2 className="font-semibold">Settings</h2>
              <button 
                onClick={handleSave}
                className="text-sm font-semibold text-blue-500"
              >
                Done
              </button>
            </div>

            <div className="p-8 space-y-8">
              <div className="flex flex-col items-center gap-4">
                <div className="relative h-24 w-24">
                  <img 
                    src={avatar} 
                    alt="Current Avatar" 
                    className="h-full w-full rounded-full border-2 border-gray-100 object-cover" 
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 rounded-full bg-black p-1.5 shadow-md border border-white text-white"
                  >
                    <Upload className="h-4 w-4" />
                  </button>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                  />
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-semibold text-blue-500"
                  >
                    Upload Photo
                  </button>
                  <button 
                    onClick={handleAvatarChange}
                    className="text-xs font-semibold text-gray-500"
                  >
                    Random Avatar
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Username</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-black focus:ring-0"
                    placeholder="Enter username"
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <button 
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Log Out
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
