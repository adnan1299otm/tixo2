
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { USERS, POSTS, STORIES } from '../services/mockDb';
import { Grid, Film, Clock, Calendar } from 'lucide-react';

export const Profile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [activeTab, setActiveTab] = useState<'posts' | 'reels' | 'stories'>('posts');
  
  const user = USERS.find(u => u.username === username) || USERS[0];
  const posts = POSTS.filter(p => p.userId === user?.id);
  const stories = STORIES.filter(s => s.userId === user?.id);

  if (!user) return <div>User not found</div>;

  return (
    <div className="h-full overflow-y-auto pb-20 bg-white">
      {/* Header Color Block */}
      <div className="h-32 bg-gradient-to-r from-tixo-accent/10 to-blue-500/10 border-b border-gray-100"></div>
      
      <div className="px-6 relative">
         {/* Avatar (Overlapping) */}
         <div className="absolute -top-12 left-6">
            <img 
                src={user.avatarUrl} 
                className="w-24 h-24 rounded-full border-4 border-white bg-white object-cover shadow-sm" 
                alt={user.displayName}
              />
         </div>

         {/* Top Row: Actions & Metrics */}
         <div className="flex justify-end items-center pt-4 mb-6 min-h-[60px]">
             <div className="flex space-x-6 mr-6">
                  <div className="flex flex-col items-center">
                      <span className="font-bold text-gray-900 text-lg">{user.followers}</span>
                      <span className="text-[10px] text-gray-500 uppercase tracking-wide font-bold">Followers</span>
                  </div>
                  <div className="flex flex-col items-center">
                      <span className="font-bold text-gray-900 text-lg">{user.following}</span>
                      <span className="text-[10px] text-gray-500 uppercase tracking-wide font-bold">Following</span>
                  </div>
              </div>

             <button className="bg-gray-900 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-800 transition-colors shadow-sm">
                 {user.id === 'u1' ? 'Edit Profile' : 'Follow'}
             </button>
         </div>

         {/* Bio Section (Moved below metrics) */}
         <div className="space-y-1 mb-8 mt-4">
              <div className="flex items-center space-x-2">
                 <h1 className="text-2xl font-display font-bold text-gray-900">{user.displayName}</h1>
                 {user.isVerified && <span className="text-tixo-accent font-bold" title="Verified">✓</span>}
              </div>
              <div className="text-gray-400 font-medium text-sm">@{user.username}</div>
              
              {user.isSuspended ? (
                <div className="inline-block bg-red-100 text-red-600 text-xs px-2 py-1 rounded mt-2 font-bold">
                  Account Suspended
                </div>
              ) : (
                <p className="text-gray-700 max-w-md leading-relaxed pt-3 text-sm">{user.bio}</p>
              )}
         </div>
      </div>

      {/* Tabs */}
      <div className="flex px-2 mb-1 sticky top-0 bg-white/95 backdrop-blur-sm z-10 border-b border-gray-100">
        <button 
            onClick={() => setActiveTab('posts')}
            className={`flex-1 py-4 flex items-center justify-center transition-colors border-b-2 ${activeTab === 'posts' ? 'text-gray-900 border-gray-900' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
        >
            <Grid size={18} className="mr-2" /> 
            <span className="text-xs font-bold uppercase tracking-widest">Posts</span>
        </button>
        <button 
            onClick={() => setActiveTab('reels')}
            className={`flex-1 py-4 flex items-center justify-center transition-colors border-b-2 ${activeTab === 'reels' ? 'text-gray-900 border-gray-900' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
        >
            <Film size={18} className="mr-2" /> 
            <span className="text-xs font-bold uppercase tracking-widest">Reels</span>
        </button>
        <button 
            onClick={() => setActiveTab('stories')}
            className={`flex-1 py-4 flex items-center justify-center transition-colors border-b-2 ${activeTab === 'stories' ? 'text-gray-900 border-gray-900' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
        >
            <Clock size={18} className="mr-2" /> 
            <span className="text-xs font-bold uppercase tracking-widest">Stories</span>
        </button>
      </div>

      {/* Grid Content */}
      <div className="px-0.5">
        {activeTab === 'posts' && (
            <div className="grid grid-cols-3 gap-0.5">
                {posts.map(post => (
                    <div key={post.id} className="aspect-square bg-gray-50 relative group cursor-pointer overflow-hidden border border-gray-100">
                        {post.mediaUrls && post.mediaUrls[0] ? (
                            <img src={post.mediaUrls[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt="post" />
                        ) : (
                            <div className="flex items-center justify-center h-full p-4 text-xs text-gray-500 text-center bg-gray-50 group-hover:bg-gray-100 transition-colors">
                                {post.content.slice(0, 60)}...
                            </div>
                        )}
                    </div>
                ))}
                {posts.length === 0 && <div className="col-span-3 text-center py-20 text-gray-400 text-sm">No posts yet.</div>}
            </div>
        )}

        {activeTab === 'reels' && (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-0.5">
                 {[1,2,3,4].map(i => (
                     <div key={i} className="aspect-[9/16] bg-gray-100 relative group cursor-pointer overflow-hidden border border-gray-100">
                         <div className="absolute inset-0 bg-gray-200/50 animate-pulse"></div>
                         <div className="absolute bottom-2 left-2 flex items-center text-xs font-bold text-gray-500 z-10">
                             <Film size={12} className="mr-1" /> 1.2k
                         </div>
                     </div>
                 ))}
            </div>
        )}

        {activeTab === 'stories' && (
            <div className="grid grid-cols-3 gap-2 p-2">
                {stories.map(story => (
                    <div key={story.id} className="aspect-[9/16] bg-gray-100 rounded-lg overflow-hidden relative border border-gray-200 shadow-sm">
                        <img src={story.mediaUrl} className="w-full h-full object-cover" alt="story archive" />
                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent text-[10px] text-white font-bold">
                             <Calendar size={10} className="inline mr-1" />
                             {new Date(story.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};
