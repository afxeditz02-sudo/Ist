import { Camera, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { loginWithGoogle } from '../lib/firebase';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setError(null);
    try {
      await loginWithGoogle();
      onLogin();
    } catch (err: any) {
      console.error('Login failed', err);
      setError(err?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm space-y-8 rounded-2xl bg-white p-10 shadow-xl text-center"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-full bg-gradient-to-tr from-yellow-400 via-orange-500 to-purple-600 p-4 text-white shadow-lg">
            <Camera className="h-10 w-10 font-bold" />
          </div>
          <h1 className="text-4xl font-bold italic tracking-tighter">InstaClone</h1>
          <p className="text-gray-500 text-sm">Sign in to see photos and videos from your friends.</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="flex w-full items-center justify-center gap-3 rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoggingIn ? (
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            ) : (
              <img src="https://www.google.com/favicon.ico" alt="Google" className="h-4 w-4 bg-white rounded-full p-0.5" />
            )}
            {isLoggingIn ? 'Connecting...' : 'Continue with Google'}
          </button>

          {error && (
            <p className="text-xs text-red-500 font-medium">{error}</p>
          )}
        </div>

        <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-8 font-medium">
          A Real-Time Database Experience
        </p>
      </motion.div>
    </div>
  );
}
