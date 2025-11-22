
import { User, Post, Reel, Story, Conversation, Message } from '../types';

// Banned words list for moderation (Simulation of AI Content Safety)
const BANNED_WORDS = ['hate', 'kill', 'violence', 'xxx', 'nude', 'nsfw', 'attack', 'stupid', 'die'];

// Mock Data Seeds for Tixo
export const USERS: User[] = [
  {
    id: 'u1',
    username: 'tixo_demo',
    displayName: 'Tixo Team',
    avatarUrl: 'https://ui-avatars.com/api/?name=Tixo+Team&background=10b981&color=fff',
    bio: 'Building the future of connection. 🚀 #Tixo',
    followers: 12050,
    following: 10,
    isVerified: true,
    warningCount: 0,
    isSuspended: false
  },
  {
    id: 'u2',
    username: 'art_vandelay',
    displayName: 'Art Vandelay',
    avatarUrl: 'https://picsum.photos/seed/art/200/200',
    bio: 'Importer / Exporter of fine pixels.',
    followers: 850,
    following: 120,
    isVerified: false,
    warningCount: 0,
    isSuspended: false
  },
  {
    id: 'ai_bot',
    username: 'tixo_ai',
    displayName: 'Tixo Bot',
    avatarUrl: 'https://ui-avatars.com/api/?name=AI&background=3b82f6&color=fff',
    bio: 'Automated Assistant & Moderator',
    followers: 1000000,
    following: 0,
    isVerified: true,
    warningCount: 0,
    isSuspended: false
  }
];

const ORIGINAL_POST: Post = {
  id: 'p1',
  userId: 'u2',
  content: 'This is what a text-first platform should feel like. Clean, bright, fast.',
  likes: 342,
  reposts: 40,
  comments: 24,
  createdAt: new Date(Date.now() - 3600000).toISOString()
};

export const POSTS: Post[] = [
  ORIGINAL_POST,
  {
    id: 'p2',
    userId: 'u1',
    content: 'Check out this thought by Art! Absolutely agree.',
    likes: 128,
    reposts: 12,
    comments: 5,
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    isRepost: true,
    originalPostId: 'p1',
    originalPost: ORIGINAL_POST
  },
  {
    id: 'p3',
    userId: 'u1',
    content: 'Tixo tip: You can hold down the repost button to add a quote. 💡',
    likes: 550,
    reposts: 102,
    comments: 45,
    createdAt: new Date(Date.now() - 7200000).toISOString()
  }
];

export const REELS: Reel[] = [
  {
    id: 'r1',
    userId: 'u1',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    description: 'Welcome to Tixo Reels. Experience the difference.',
    likes: 1540,
    comments: 32,
    shares: 105,
    songName: 'Tixo Original Audio'
  },
  {
    id: 'r2',
    userId: 'u2',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    description: 'Late night coding sessions 🖥️',
    likes: 892,
    comments: 45,
    shares: 22,
    songName: 'Lofi Study'
  }
];

export const STORIES: Story[] = [
  {
    id: 's1',
    userId: 'u2',
    mediaUrl: 'https://picsum.photos/seed/story1/400/800',
    type: 'image',
    duration: 5,
    createdAt: new Date().toISOString()
  }
];

export const CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    type: 'direct',
    participantIds: ['u1', 'u2'],
    hasAiEnabled: false,
    lastMessage: 'Did you see the new repost feature?',
    lastMessageAt: new Date(Date.now() - 100000).toISOString()
  },
  {
    id: 'c_ai',
    type: 'direct',
    participantIds: ['u1', 'ai_bot'],
    hasAiEnabled: true,
    lastMessage: 'I can help summarize that channel for you.',
    lastMessageAt: new Date().toISOString()
  },
  {
    id: 'c_channel',
    type: 'channel',
    participantIds: ['u1', 'u2'],
    name: 'Tixo Announcements',
    avatarUrl: 'https://ui-avatars.com/api/?name=TA&background=000&color=fff',
    hasAiEnabled: false,
    lastMessage: 'v1.0.0 is now live! 🚀',
    lastMessageAt: new Date(Date.now() - 500000).toISOString()
  }
];

export const MESSAGES: Record<string, Message[]> = {
  'c1': [
    { id: 'm1', conversationId: 'c1', senderId: 'u2', content: 'Did you see the new repost feature?', createdAt: new Date(Date.now() - 100000).toISOString() }
  ],
  'c_ai': [
    { id: 'm_ai_1', conversationId: 'c_ai', senderId: 'ai_bot', content: 'Hello! Toggle the bot icon to let me assist in your chats.', createdAt: new Date().toISOString() }
  ],
  'c_channel': [
    { id: 'ch1', conversationId: 'c_channel', senderId: 'u1', content: 'Welcome to the official Tixo announcements channel.', createdAt: new Date(Date.now() - 900000).toISOString() },
    { id: 'ch2', conversationId: 'c_channel', senderId: 'u1', content: 'v1.0.0 is now live! 🚀', createdAt: new Date(Date.now() - 500000).toISOString() }
  ]
};

// Helpers
export const getUser = (id: string) => USERS.find(u => u.id === id);
export const getPosts = () => POSTS.map(p => ({ ...p, user: getUser(p.userId), originalPost: p.originalPostId ? POSTS.find(op => op.id === p.originalPostId) : undefined }));
export const getReels = () => REELS.map(r => ({ ...r, user: getUser(r.userId) }));
export const getStories = () => STORIES.map(s => ({ ...s, user: getUser(s.userId) }));

// Content Moderation Service
export const moderateContent = (text: string, userId?: string): { approved: boolean; reason?: string } => {
  // 1. Check user status
  if (userId) {
    const user = getUser(userId);
    if (user?.isSuspended) {
      return { approved: false, reason: 'Account suspended due to repeated violations.' };
    }
  }

  // 2. AI Simulation Check
  const lower = text.toLowerCase();
  const found = BANNED_WORDS.find(w => lower.includes(w));
  
  if (found) {
    // Punitive Logic
    if (userId) {
      const user = getUser(userId);
      if (user) {
        user.warningCount = (user.warningCount || 0) + 1;
        if (user.warningCount >= 3) {
          user.isSuspended = true;
        }
      }
    }
    return { approved: false, reason: `Content contains prohibited topics (Code: ${found}). ${userId ? 'Warning issued.' : ''}` };
  }
  return { approved: true };
};

// Unified Create Function
export const createContent = (
  userId: string, 
  type: 'post' | 'reel' | 'story', 
  content: string, // Text for post/reel desc, or mediaUrl for story
  mediaUrl?: string
) => {
  
  // 1. Moderate
  const mod = moderateContent(content, userId);
  if (!mod.approved) {
    throw new Error(mod.reason);
  }

  // 2. Create based on type
  if (type === 'post') {
    const newPost: Post = {
      id: `p${Date.now()}`,
      userId,
      content,
      mediaUrls: mediaUrl ? [mediaUrl] : undefined,
      likes: 0,
      reposts: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
      moderationStatus: 'approved'
    };
    POSTS.unshift(newPost);
    return newPost;
  } else if (type === 'reel') {
    const newReel: Reel = {
      id: `r${Date.now()}`,
      userId,
      videoUrl: mediaUrl || 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', // Mock fallback
      description: content,
      likes: 0,
      comments: 0,
      shares: 0,
      songName: 'Original Audio',
      moderationStatus: 'approved'
    };
    REELS.unshift(newReel);
    return newReel;
  } else if (type === 'story') {
    const newStory: Story = {
      id: `s${Date.now()}`,
      userId,
      mediaUrl: mediaUrl || 'https://picsum.photos/400/800',
      type: 'image',
      duration: 5,
      createdAt: new Date().toISOString(),
      moderationStatus: 'approved'
    };
    STORIES.unshift(newStory);
    return newStory;
  }
};

export const searchContent = (query: string) => {
  const lowerQuery = query.toLowerCase();
  
  const users = USERS.filter(u => 
    u.username.toLowerCase().includes(lowerQuery) || 
    u.displayName.toLowerCase().includes(lowerQuery)
  );
  
  const posts = POSTS.filter(p => p.content.toLowerCase().includes(lowerQuery));
  
  const reels = REELS.filter(r => 
    r.description.toLowerCase().includes(lowerQuery) || 
    (r.user?.username.toLowerCase().includes(lowerQuery))
  ).map(r => ({...r, user: getUser(r.userId)}));

  return { users, posts, reels };
};
