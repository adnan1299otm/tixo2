
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image, X, Hash, AtSign, Video, Camera, ShieldAlert, Check } from 'lucide-react';
import { createContent } from '../services/mockDb';
import { getCurrentUser } from '../services/authService';

type CreateTab = 'post' | 'reel' | 'story';

export const CreatePost: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CreateTab>('post');
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const user = getCurrentUser();
  const MAX_CHARS = 280;

  const handleSubmit = () => {
    if (!content.trim() && !mediaUrl) return;
    if (!user) return;
    
    setError(null);
    setIsLoading(true);

    try {
      // This simulates the backend moderation check
      createContent(user.id, activeTab, content, mediaUrl);
      
      setTimeout(() => {
        setIsLoading(false);
        if (activeTab === 'reel') navigate('/reels');
        else if (activeTab === 'story') navigate('/');
        else navigate('/');
      }, 600);
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || "Upload failed due to safety guidelines.");
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= MAX_CHARS) {
      setContent(text);
      setError(null); // clear errors on edit
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 pt-8 bg-white min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-900 transition-colors">
          <X size={24} />
        </button>
        <h1 className="font-display font-bold text-xl text-gray-900">Create</h1>
        <button 
          onClick={handleSubmit}
          disabled={(!content.trim() && !mediaUrl) || isLoading}
          className="bg-tixo-accent text-white px-6 py-2 rounded-full font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg flex items-center space-x-2"
        >
          {isLoading ? <span>Checking...</span> : (
            <>
              <span>Share</span>
              <Check size={16} />
            </>
          )}
        </button>
      </div>

      {/* Multi-Upload Tabs */}
      <div className="flex space-x-2 mb-8 p-1.5 bg-gray-100 rounded-xl w-full max-w-md mx-auto">
        <button 
          onClick={() => setActiveTab('post')}
          className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'post' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Post
        </button>
        <button 
          onClick={() => setActiveTab('reel')}
          className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'reel' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Reel
        </button>
        <button 
          onClick={() => setActiveTab('story')}
          className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'story' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Story
        </button>
      </div>

      {/* Error Banner for Moderation */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start space-x-3 animate-scale-in">
          <ShieldAlert className="text-red-500 flex-shrink-0" size={20} />
          <div>
            <h3 className="font-bold text-red-800 text-sm">Safety & Guidelines</h3>
            <p className="text-red-600 text-xs mt-1 leading-relaxed">{error}</p>
            <p className="text-red-500 text-[10px] mt-2 uppercase font-bold tracking-wide">Repeated violations will result in suspension.</p>
          </div>
        </div>
      )}

      <div className="flex space-x-4">
        <div className="flex-shrink-0">
          <img 
            src={user?.avatarUrl} 
            alt="Avatar" 
            className="w-12 h-12 rounded-xl bg-gray-200 object-cover border border-gray-100"
          />
        </div>
        
        <div className="flex-1">
          <textarea
            value={content}
            onChange={handleContentChange}
            placeholder={activeTab === 'post' ? "What's on your mind?" : activeTab === 'reel' ? "Describe this reel..." : "Add a caption..."}
            className="w-full bg-transparent text-lg text-gray-900 placeholder-gray-400 outline-none resize-none min-h-[120px] mb-4"
            autoFocus
          />
          
          {/* Mock Media Upload Field */}
          <div className="mb-6 bg-gray-50 rounded-xl p-4 border border-gray-100">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center">
               {activeTab === 'post' ? <Image size={14} className="mr-1"/> : <Video size={14} className="mr-1"/>}
               {activeTab === 'post' ? 'Media URL (Optional)' : 'Media Source URL'}
            </label>
            <input 
              type="text" 
              value={mediaUrl}
              onChange={e => setMediaUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:border-tixo-accent transition-colors"
            />
          </div>

          {/* Tools */}
          <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
            <div className="flex space-x-2 text-tixo-accent">
              <button className="p-2 hover:bg-green-50 rounded-full transition-colors" title="Media">
                {activeTab === 'reel' ? <Video size={20} /> : <Image size={20} />}
              </button>
              <button className="p-2 hover:bg-green-50 rounded-full transition-colors" title="Hashtags">
                <Hash size={20} />
              </button>
              <button className="p-2 hover:bg-green-50 rounded-full transition-colors" title="Mentions">
                <AtSign size={20} />
              </button>
              {activeTab === 'story' && (
                 <button className="p-2 hover:bg-green-50 rounded-full transition-colors" title="Camera">
                   <Camera size={20} />
                 </button>
              )}
            </div>

            <div className={`text-xs font-mono font-medium bg-gray-100 px-2 py-1 rounded-md ${
              content.length > MAX_CHARS * 0.9 ? 'text-red-500' : 'text-gray-500'
            }`}>
              {content.length} / {MAX_CHARS}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
