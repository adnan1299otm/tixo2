
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await login(email);
    setLoading(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-tixo-accent/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-400/20 rounded-full blur-[120px]"></div>

      <div className="max-w-md w-full bg-white/80 backdrop-blur-xl p-10 rounded-3xl border border-gray-200 shadow-2xl z-10">
        <div className="text-center mb-10">
            <h1 className="text-5xl font-display font-black text-gray-900 mb-2 tracking-tighter">Tixo.</h1>
            <p className="text-gray-500 font-light tracking-wide">The social network for the next era.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Username</label>
                <input 
                    type="text" 
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-gray-900 focus:ring-2 focus:ring-tixo-accent focus:border-transparent outline-none transition-all"
                    placeholder="tixo_demo"
                />
            </div>
            
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Password</label>
                <input 
                    type="password" 
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-gray-900 focus:ring-2 focus:ring-tixo-accent focus:border-transparent outline-none transition-all"
                    placeholder="••••••••"
                />
            </div>

            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gray-900 text-white font-bold text-lg py-4 rounded-xl hover:shadow-xl transition-all disabled:opacity-50"
            >
                {loading ? 'Authenticating...' : 'Enter Tixo'}
            </button>
        </form>

        <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 mb-4">New here? <span className="text-tixo-accent cursor-pointer hover:underline font-bold">Create ID</span></p>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-left">
                <p className="text-xs text-gray-400 font-mono mb-1">DEMO ACCESS:</p>
                <div className="flex justify-between text-sm text-gray-700 font-medium">
                    <span>tixo_demo</span>
                    <span className="opacity-50">••••</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
