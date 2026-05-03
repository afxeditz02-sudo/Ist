import { Camera } from 'lucide-react';
import { motion } from 'motion/react';
import { loginWithGoogle } from '../lib/firebase';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const handleLogin = async () => {
    try {
      await loginWithGoogle();
      onLogin();
    } catch (error) {
      console.error('Login failed', error);
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

        <button
          onClick={handleLogin}
          className="flex w-full items-center justify-center gap-3 rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-gray-800 transition-all active:scale-95"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="h-4 w-4 bg-white rounded-full p-0.5" />
          Continue with Google
        </button>

        <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-8 font-medium">
          A Real-Time Database Experience
        </p>
      </motion.div>
    </div>
  );
}
