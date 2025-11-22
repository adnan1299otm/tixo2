
import React, { useEffect, useState, useRef } from 'react';
import { Heart, Share, MoreHorizontal, Play, Music, MessageCircle, UserPlus } from 'lucide-react';
import { getReels } from '../services/mockDb';
import { Reel } from '../types';

export const Reels: React.FC = () => {
  const [reels, setReels] = useState<Reel[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setReels(getReels());
  }, []);

  return (
    <div 
      ref={containerRef}
      className="h-full w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar bg-white"
    >
      {reels.map((reel) => (
        <ReelItem key={reel.id} reel={reel} />
      ))}
    </div>
  );
};

const ReelItem: React.FC<{ reel: Reel }> = ({ reel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting);
        if (entry.isIntersecting) {
          videoRef.current?.play().catch(() => {});
          setIsPlaying(true);
        } else {
          videoRef.current?.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.6 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative h-full w-full snap-start flex items-center justify-center bg-black overflow-hidden"
    >
      {/* Video Content with Tixo Parallax/Scale Animation */}
      <div 
        className={`relative w-full h-full transition-all duration-700 ease-out transform ${
          isActive ? 'scale-100 opacity-100' : 'scale-95 opacity-60'
        }`}
      >
        <video
          ref={videoRef}
          src={reel.videoUrl}
          className="h-full w-full object-cover"
          loop
          muted
          playsInline
          onClick={togglePlay}
        />
        
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/20 z-10">
              <Play size={64} className="text-white/80 fill-white/20" />
          </div>
        )}

        {/* Bottom Gradient Overlay - Stronger at bottom to support text */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none"></div>
      
        {/* Tixo Design: Metadata Bottom Overlay */}
        {/* "Move creator info / caption / music info below the video (bottom overlay), not on top." */}
        <div className="absolute bottom-20 left-0 right-0 px-4 pb-4 z-20 text-white flex flex-col items-start">
            <div className="flex items-center space-x-3 mb-3">
                <div className="relative">
                  <img src={reel.user?.avatarUrl} className="w-10 h-10 rounded-full border-2 border-white" alt="user"/>
                  <div className="absolute -bottom-1 -right-1 bg-tixo-accent rounded-full p-0.5 border border-black">
                    <UserPlus size={10} className="text-white" />
                  </div>
                </div>
                <div className="flex flex-col">
                    <span className="font-display font-bold text-base tracking-wide shadow-black drop-shadow-md text-white">{reel.user?.displayName}</span>
                    <span className="text-xs text-gray-300 font-medium">@{reel.user?.username}</span>
                </div>
            </div>
            
            <p className="text-sm text-gray-100 mb-3 font-light leading-snug drop-shadow-md max-w-[90%] line-clamp-2">{reel.description}</p>
            
            <div className="flex items-center space-x-2 opacity-90 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                <Music size={12} className="text-tixo-accent animate-pulse" />
                <span className="text-xs text-white font-bold tracking-wider">{reel.songName}</span>
            </div>
        </div>
      </div>

      {/* Tixo Design: Horizontal Action Bar at Bottom of Screen */}
      {/* "Move all interaction buttons (Like, Share, Comment) to the bottom of the screen." */}
      <div className="absolute bottom-0 left-0 right-0 z-30 h-20 bg-gradient-to-t from-black to-transparent flex items-center justify-between px-8 pb-2">
          <button className="flex flex-col items-center group transition-transform active:scale-90">
              <Heart size={28} className="text-white group-hover:text-red-500 transition-colors" />
              <span className="text-[10px] font-bold mt-1 text-white/90">{reel.likes}</span>
          </button>
          
          <button 
            className="flex flex-col items-center group transition-transform active:scale-90" 
            onClick={() => setShowComments(true)}
          >
              <MessageCircle size={28} className="text-white group-hover:text-blue-400 transition-colors" />
              <span className="text-[10px] font-bold mt-1 text-white/90">{reel.comments}</span>
          </button>

          <button className="flex flex-col items-center group transition-transform active:scale-90">
              <Share size={28} className="text-white group-hover:text-green-400 transition-colors" />
              <span className="text-[10px] font-bold mt-1 text-white/90">Share</span>
          </button>
          
          <button className="flex flex-col items-center group">
              <MoreHorizontal size={28} className="text-white" />
              <span className="text-[10px] font-bold mt-1 text-white/90">More</span>
          </button>
      </div>

      {/* Slide Up Comments Panel */}
      <div 
        className={`absolute bottom-0 left-0 right-0 h-[65%] bg-white rounded-t-[2rem] transition-transform duration-300 z-40 transform shadow-2xl ${
            showComments ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
          <div className="p-4 flex flex-col items-center border-b border-gray-100" onClick={() => setShowComments(false)}>
              <div className="w-12 h-1.5 bg-gray-300 rounded-full cursor-pointer hover:bg-gray-400 mb-4"></div>
              <h3 className="font-display font-bold text-lg text-gray-900">Comments ({reel.comments})</h3>
          </div>
          
          <div className="px-6 h-full overflow-y-auto pb-24 bg-white">
              <div className="space-y-6 mt-4">
                   <div className="flex space-x-3">
                       <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
                       <div>
                           <div className="flex items-baseline space-x-2">
                               <span className="text-xs font-bold text-gray-900">user_123</span>
                               <span className="text-[10px] text-gray-500">2m</span>
                           </div>
                           <p className="text-sm text-gray-700">This UI update is clean! Light mode ftw.</p>
                       </div>
                   </div>
              </div>
          </div>
      </div>
    </div>
  );
};
