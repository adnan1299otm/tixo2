
import React, { useState } from 'react';
import { Heart, MessageCircle, Repeat, Share, Bookmark } from 'lucide-react';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [repostCount, setRepostCount] = useState(post.reposts);

  const handleLike = () => {
    if (liked) {
      setLikesCount(c => c - 1);
    } else {
      setLikesCount(c => c + 1);
    }
    setLiked(!liked);
  };

  const handleRepost = () => {
      setRepostCount(c => c + 1);
  };

  const PostContent = ({ content, mediaUrls }: { content: string, mediaUrls?: string[] }) => (
      <>
        <p className="text-base md:text-lg leading-relaxed text-gray-800 mb-3 whitespace-pre-wrap font-sans">{content}</p>
        {mediaUrls && mediaUrls.length > 0 && (
            <div className="mb-3 rounded-xl overflow-hidden border border-gray-100">
            <img
                src={mediaUrls[0]}
                alt="Post content"
                className="w-full h-auto object-cover max-h-[500px]"
            />
            </div>
        )}
      </>
  );

  return (
    <article className="bg-white rounded-2xl p-5 mb-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      {/* Repost Header */}
      {post.isRepost && (
          <div className="flex items-center text-gray-500 mb-3 text-sm font-medium">
              <Repeat size={14} className="mr-2 text-tixo-accent" />
              <span>{post.user?.displayName} Reposted</span>
          </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <img
            src={post.isRepost && post.originalPost ? post.originalPost.user?.avatarUrl : post.user?.avatarUrl}
            alt="Avatar"
            className="w-12 h-12 rounded-xl object-cover bg-gray-100"
          />
          <div className="leading-tight">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-gray-900 font-display tracking-wide">
                  {post.isRepost && post.originalPost ? post.originalPost.user?.displayName : post.user?.displayName}
              </span>
              {((post.isRepost && post.originalPost?.user?.isVerified) || (!post.isRepost && post.user?.isVerified)) && (
                <span className="text-tixo-accent text-xs" title="Verified">✓</span>
              )}
            </div>
            <div className="text-gray-500 text-sm">
                @{post.isRepost && post.originalPost ? post.originalPost.user?.username : post.user?.username}
            </div>
          </div>
        </div>
        <span className="text-gray-400 text-xs font-mono">2h</span>
      </div>

      {/* Content Area */}
      <div className="pl-0 md:pl-15">
        {post.isRepost && post.originalPost ? (
            <>
             {post.content && <p className="mb-4 text-gray-800">{post.content}</p>}
             <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                 <PostContent content={post.originalPost.content} mediaUrls={post.originalPost.mediaUrls} />
             </div>
            </>
        ) : (
            <PostContent content={post.content} mediaUrls={post.mediaUrls} />
        )}

        {/* Tixo Action Bar */}
        <div className="flex items-center justify-between mt-5 pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-8">
                <button 
                    onClick={handleLike}
                    className={`group flex items-center space-x-2 transition-colors ${liked ? 'text-pink-500' : 'text-gray-500 hover:text-pink-500'}`}
                >
                    <Heart size={20} className={liked ? 'fill-current' : ''} />
                    <span className="text-sm font-medium">{likesCount}</span>
                </button>

                <button className="group flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
                    <MessageCircle size={20} />
                    <span className="text-sm font-medium">{post.comments}</span>
                </button>

                <button 
                    onClick={handleRepost}
                    className="group flex items-center space-x-2 text-gray-500 hover:text-tixo-accent transition-colors"
                >
                    <Repeat size={20} className={post.isRepost ? 'text-tixo-accent' : ''} />
                    <span className="text-sm font-medium">{repostCount}</span>
                </button>
            </div>

            <div className="flex space-x-4 text-gray-400">
                 <button className="hover:text-gray-900"><Share size={20} /></button>
                 <button className="hover:text-gray-900"><Bookmark size={20} /></button>
            </div>
        </div>
      </div>
    </article>
  );
};
