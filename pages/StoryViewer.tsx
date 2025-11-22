import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { STORIES, USERS } from '../services/mockDb';
import { Story } from '../types';

export const StoryViewer: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [stories, setStories] = useState<Story[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const userStories = STORIES.filter(s => s.userId === userId);
    if (userStories.length === 0) {
      navigate('/'); // No stories, go back
    }
    setStories(userStories);
  }, [userId, navigate]);

  useEffect(() => {
    if (stories.length === 0) return;
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + 1; // Simple mock progress
      });
    }, 50); // Adjust for duration

    return () => clearInterval(interval);
  }, [currentIndex, stories]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(c => c + 1);
      setProgress(0);
    } else {
      navigate('/'); // End of stories
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(c => c - 1);
      setProgress(0);
    }
  };

  if (stories.length === 0) return null;

  const currentStory = stories[currentIndex];
  const user = USERS.find(u => u.id === currentStory.userId);

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <div className="relative w-full h-full md:w-[400px] md:h-[80vh] md:rounded-xl overflow-hidden bg-gray-900">
        
        {/* Progress Bar */}
        <div className="absolute top-4 left-2 right-2 flex space-x-1 z-20">
          {stories.map((_, idx) => (
            <div key={idx} className="h-1 flex-1 bg-gray-600 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-white transition-all duration-100 ease-linear`}
                style={{ 
                  width: idx < currentIndex ? '100%' : idx === currentIndex ? `${progress}%` : '0%' 
                }} 
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-8 left-4 z-20 flex items-center justify-between w-full pr-8">
            <div className="flex items-center space-x-2">
                <img src={user?.avatarUrl} className="w-8 h-8 rounded-full border border-white/20" alt={user?.username} />
                <span className="text-white font-semibold text-sm">{user?.username}</span>
                <span className="text-gray-300 text-xs">4h</span>
            </div>
            <button onClick={() => navigate('/')} className="text-white">
                <X size={24} />
            </button>
        </div>

        {/* Content */}
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            {currentStory.type === 'image' ? (
                <img src={currentStory.mediaUrl} className="w-full h-full object-cover" alt="Story" />
            ) : (
                <div className="text-white">Video not supported in demo</div>
            )}
        </div>

        {/* Controls */}
        <div className="absolute inset-0 flex z-10">
            <div className="w-1/3 h-full" onClick={handlePrev}></div>
            <div className="w-1/3 h-full"></div>
            <div className="w-1/3 h-full" onClick={handleNext}></div>
        </div>
      </div>
    </div>
  );
};