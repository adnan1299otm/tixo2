
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Video, User as UserIcon, FileText } from 'lucide-react';
import { PostCard } from '../components/PostCard';
import { StoryCircle } from '../components/StoryCircle';
import { getPosts, USERS, getStories, searchContent } from '../services/mockDb';
import { Post, Story, User, Reel } from '../types';

export const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeStories, setActiveStories] = useState<Story[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{users: User[], posts: Post[], reels: Reel[]} | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate fetch
    setPosts(getPosts());
    setActiveStories(getStories());
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchContent(searchQuery);
      setSearchResults(results);
    } else {
      setSearchResults(null);
    }
  }, [searchQuery]);

  return (
    <div className="max-w-2xl mx-auto h-full overflow-y-auto pb-20 md:pb-0 relative bg-white">
      {/* Search Header - Light Mode */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 p-4">
        <div className="relative group">
          <Search className="absolute left-3 top-3 text-gray-400 group-focus-within:text-tixo-accent transition-colors" size={18} />
          <input 
            type="text"
            placeholder="Search Reels, Accounts, Posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-full py-2.5 pl-10 pr-10 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-tixo-accent focus:border-transparent outline-none transition-all shadow-sm"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-900"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Search Dropdown */}
        {searchResults && searchQuery && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-100 shadow-xl rounded-b-2xl overflow-hidden max-h-[60vh] overflow-y-auto z-40 mx-2 mt-1">
            
            {/* User Results */}
            {searchResults.users.length > 0 && (
              <div className="p-2">
                <div className="flex items-center px-3 py-2 text-xs text-gray-400 font-bold uppercase tracking-wider space-x-2">
                   <UserIcon size={12} /> <span>Accounts</span>
                </div>
                {searchResults.users.map(user => (
                  <div 
                    key={user.id} 
                    onClick={() => navigate(`/profile/${user.username}`)}
                    className="flex items-center p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors"
                  >
                    <img src={user.avatarUrl} className="w-10 h-10 rounded-full mr-3 border border-gray-100" alt={user.username} />
                    <div>
                      <div className="font-bold text-gray-900 text-sm">{user.displayName} {user.isVerified && <span className="text-tixo-accent">✓</span>}</div>
                      <div className="text-xs text-gray-500">@{user.username}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Reels Results */}
            {searchResults.reels.length > 0 && (
              <div className="p-2 border-t border-gray-50">
                <div className="flex items-center px-3 py-2 text-xs text-gray-400 font-bold uppercase tracking-wider space-x-2">
                   <Video size={12} /> <span>Reels</span>
                </div>
                {searchResults.reels.map(reel => (
                  <div 
                    key={reel.id} 
                    onClick={() => navigate('/reels')}
                    className="flex items-center p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors"
                  >
                    <div className="w-10 h-14 bg-gray-900 rounded-md mr-3 flex items-center justify-center text-white flex-shrink-0">
                        <Video size={16}/>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-sm line-clamp-1">{reel.description}</div>
                      <div className="text-xs text-gray-500">by @{reel.user?.username}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Post Results */}
            {searchResults.posts.length > 0 && (
              <div className="p-2 border-t border-gray-50">
                <div className="flex items-center px-3 py-2 text-xs text-gray-400 font-bold uppercase tracking-wider space-x-2">
                   <FileText size={12} /> <span>Posts</span>
                </div>
                {searchResults.posts.map(post => (
                  <div key={post.id} className="p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors">
                    <div className="text-sm text-gray-800 line-clamp-2 font-medium">{post.content}</div>
                    <div className="text-xs text-gray-500 mt-1">by @{post.user?.username}</div>
                  </div>
                ))}
              </div>
            )}

            {searchResults.users.length === 0 && searchResults.posts.length === 0 && searchResults.reels.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No results found for "{searchQuery}"
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stories Rail */}
      <div className="flex space-x-4 p-4 overflow-x-auto border-b border-gray-100 no-scrollbar bg-white">
        {/* Current User Story Add */}
        <div className="flex flex-col items-center space-y-1 flex-shrink-0 cursor-pointer">
          <div className="relative w-16 h-16 group">
            <img 
              src="https://picsum.photos/seed/me/200/200" 
              className="w-16 h-16 rounded-full object-cover opacity-100 border-2 border-gray-100 group-hover:opacity-90 transition-opacity"
              alt="My Story"
            />
            <div className="absolute bottom-0 right-0 bg-tixo-accent rounded-full p-1 border-2 border-white shadow-sm">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </div>
          <span className="text-xs text-gray-500 font-medium">Your Story</span>
        </div>

        {/* Other Stories */}
        {USERS.slice(0, 5).map(user => {
            const hasStory = activeStories.some(s => s.userId === user.id);
            return <StoryCircle key={user.id} user={user} hasStory={hasStory} />;
        })}
      </div>

      {/* Feed */}
      <div className="pt-4 px-2 md:px-0 bg-gray-50 min-h-screen">
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
        <div className="h-20"></div>
      </div>
    </div>
  );
};
