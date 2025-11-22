import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '../types';

interface StoryCircleProps {
  user: User;
  hasStory: boolean;
}

export const StoryCircle: React.FC<StoryCircleProps> = ({ user, hasStory }) => {
  return (
    <Link to={hasStory ? `/stories/${user.id}` : `/profile/${user.username}`} className="flex flex-col items-center space-y-1 flex-shrink-0">
      <div className={`p-[2px] rounded-full ${hasStory ? 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600' : 'bg-gray-700'}`}>
        <div className="p-[2px] bg-black rounded-full">
          <img
            src={user.avatarUrl}
            alt={user.username}
            className="w-16 h-16 rounded-full object-cover"
          />
        </div>
      </div>
      <span className="text-xs text-gray-400 truncate w-16 text-center">{user.username}</span>
    </Link>
  );
};