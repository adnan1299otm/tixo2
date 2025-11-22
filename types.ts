
export interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio?: string;
  followers: number;
  following: number;
  isVerified?: boolean;
  warningCount: number;
  isSuspended: boolean;
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  mediaUrls?: string[];
  likes: number;
  reposts: number;
  comments: number;
  createdAt: string;
  user?: User; // Populated for UI
  isRepost?: boolean;
  originalPostId?: string;
  originalPost?: Post; // Nested content
  moderationStatus?: 'approved' | 'flagged' | 'rejected';
}

export interface Reel {
  id: string;
  userId: string;
  videoUrl: string;
  description: string;
  likes: number;
  comments: number;
  shares: number;
  songName?: string;
  user?: User;
  moderationStatus?: 'approved' | 'flagged' | 'rejected';
}

export interface Story {
  id: string;
  userId: string;
  mediaUrl: string;
  type: 'image' | 'video';
  duration: number; // seconds
  createdAt: string;
  user?: User;
  moderationStatus?: 'approved' | 'flagged' | 'rejected';
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  isAiResponse?: boolean;
  type?: 'text' | 'image' | 'system';
  isFlagged?: boolean;
}

export type ConversationType = 'direct' | 'group' | 'channel';

export interface Conversation {
  id: string;
  type: ConversationType;
  participantIds: string[];
  name?: string; // For groups/channels
  lastMessage?: string;
  lastMessageAt?: string;
  participants?: User[];
  hasAiEnabled: boolean;
  avatarUrl?: string; // For channels
}

export enum AppState {
  LOADING,
  IDLE,
  ERROR
}