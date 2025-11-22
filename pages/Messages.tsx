
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Send, Sparkles, Bot, ChevronLeft, Users, Hash, Settings, MessageSquare, ShieldAlert, Info } from 'lucide-react';
import { USERS, CONVERSATIONS, MESSAGES, moderateContent } from '../services/mockDb';
import { sendMessageToGemini } from '../services/geminiService';
import { getCurrentUser } from '../services/authService';
import { Conversation, Message, User } from '../types';

export const Messages: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const currentUser = getCurrentUser();

  useEffect(() => {
    setConversations(CONVERSATIONS);
  }, []);

  return (
    <div className="flex h-full bg-white">
      {/* List (Hidden on mobile if chat open) */}
      <div className={`w-full md:w-96 border-r border-gray-200 flex-col ${conversationId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-white z-10">
          <h2 className="text-2xl font-display font-bold text-gray-900">Chats</h2>
          <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600"><Settings size={20} /></button>
        </div>
        
        <div className="overflow-y-auto flex-1 bg-white">
          {conversations.map(c => {
             let title = '';
             let subtitle = c.lastMessage;
             let avatar = '';
             let icon = null;

             if (c.type === 'direct') {
                 const otherId = c.participantIds.find(id => id !== currentUser?.id);
                 const otherUser = USERS.find(u => u.id === otherId);
                 title = otherUser?.displayName || 'Unknown';
                 avatar = otherUser?.avatarUrl || '';
                 if (otherId === 'ai_bot') icon = <Bot size={12} className="text-blue-500" />;
             } else if (c.type === 'channel') {
                 title = c.name || 'Channel';
                 avatar = c.avatarUrl || '';
                 icon = <Hash size={12} className="text-tixo-accent" />;
                 subtitle = `📢 ${c.lastMessage}`;
             }

             return (
               <a href={`#/messages/${c.id}`} key={c.id} className={`flex items-center p-4 hover:bg-gray-50 transition-all cursor-pointer border-l-4 ${conversationId === c.id ? 'bg-gray-50 border-tixo-accent' : 'border-transparent'}`}>
                 <div className="relative">
                   <img src={avatar} className="w-14 h-14 rounded-2xl object-cover bg-gray-100 border border-gray-200" alt="avatar" />
                   {icon && <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full border border-gray-200 shadow-sm">{icon}</div>}
                 </div>
                 <div className="ml-4 flex-1 overflow-hidden">
                   <div className="flex justify-between items-baseline mb-1">
                     <span className="font-bold text-gray-900 truncate text-base">{title}</span>
                     <span className="text-xs text-gray-400 font-mono">12:30</span>
                   </div>
                   <p className="text-sm text-gray-500 truncate font-medium">{subtitle}</p>
                 </div>
               </a>
             );
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex-col bg-gray-50 ${conversationId ? 'flex' : 'hidden md:flex'}`}>
        {conversationId ? (
          <ChatWindow conversationId={conversationId} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-300 flex-col">
             <div className="w-24 h-24 rounded-3xl bg-white border border-gray-200 flex items-center justify-center mb-4 rotate-12 shadow-sm">
                <MessageSquare size={48} className="text-gray-400" />
             </div>
            <p className="font-display text-xl text-gray-400">Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ChatWindow = ({ conversationId }: { conversationId: string }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [aiEnabled, setAiEnabled] = useState(false);
  const [warning, setWarning] = useState<{msg: string, type: 'error' | 'info'} | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUser = getCurrentUser();
  
  const conversation = CONVERSATIONS.find(c => c.id === conversationId);
  const isAiChat = conversation?.participantIds.includes('ai_bot');

  useEffect(() => {
    setMessages(MESSAGES[conversationId] || []);
    setAiEnabled(conversation?.hasAiEnabled || false);
    setWarning(null);
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    if (!currentUser) return;

    // 1. Active Content Moderation (Simulated AI Monitor)
    // "AI bot integrated into chats to monitor messages for violations."
    const moderation = moderateContent(input, currentUser.id);
    
    if (!moderation.approved) {
      // Content Rejected
      setWarning({ msg: `AI Safety: ${moderation.reason}`, type: 'error' });
      // Simulate a "System/Bot Warning" message appearing in chat
      const warningMsg: Message = {
        id: Date.now().toString(),
        conversationId,
        senderId: 'ai_bot',
        content: `⚠️ Your message was blocked. ${moderation.reason} Please review our community guidelines.`,
        createdAt: new Date().toISOString(),
        isAiResponse: true
      };
      setMessages(prev => [...prev, warningMsg]);
      setInput('');
      setTimeout(() => setWarning(null), 5000);
      return;
    }

    // If approved, proceed
    const newMessage: Message = {
      id: Date.now().toString(),
      conversationId,
      senderId: currentUser.id,
      content: input,
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setWarning(null);

    // Logic: If direct AI chat OR if AI is toggled on
    if (isAiChat || aiEnabled) {
      const aiResponseText = await sendMessageToGemini(input);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        conversationId,
        senderId: 'ai_bot',
        content: aiResponseText,
        createdAt: new Date().toISOString(),
        isAiResponse: true
      };
      
      setMessages(prev => [...prev, aiMessage]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const title = conversation?.type === 'channel' ? conversation.name : 
                USERS.find(u => u.id === conversation?.participantIds.find(pid => pid !== currentUser?.id))?.displayName;

  return (
    <div className="flex flex-col h-full w-full relative bg-gray-50">
      {/* Header */}
      <div className="h-16 border-b border-gray-200 flex items-center px-6 justify-between bg-white z-10 shadow-sm">
        <div className="flex items-center">
            <a href="#/messages" className="md:hidden mr-4 text-gray-600"><ChevronLeft /></a>
            <div>
                <h3 className="font-bold text-lg flex items-center text-gray-900">
                    {title}
                    {conversation?.type === 'channel' && <Hash size={14} className="ml-2 text-gray-400" />}
                </h3>
                <span className="text-xs text-tixo-accent font-bold">Active</span>
            </div>
        </div>
        
        {/* AI Toggle */}
        {!isAiChat && conversation?.type !== 'channel' && (
            <button 
                onClick={() => setAiEnabled(!aiEnabled)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${aiEnabled ? 'bg-blue-100 text-blue-600 ring-1 ring-blue-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
                <Bot size={14} />
                <span>AI Monitor {aiEnabled ? 'ON' : 'OFF'}</span>
            </button>
        )}
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="text-center py-4">
           <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
             AI Content Moderation is active in this chat
           </span>
        </div>

        {messages.map((msg, idx) => {
          const isMe = msg.senderId === currentUser?.id;
          const isSystem = msg.isAiResponse && msg.content.includes('blocked'); 
          const isAi = msg.isAiResponse && !isSystem;

          if (isSystem) {
              return (
                  <div key={msg.id} className="flex justify-center my-4 animate-pulse">
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4 max-w-md w-full shadow-sm flex items-start space-x-3">
                          <ShieldAlert size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs font-bold text-red-800 uppercase tracking-wide block mb-1">Safety Warning</span>
                            <p className="text-red-700 text-sm leading-relaxed">{msg.content}</p>
                          </div>
                      </div>
                  </div>
              );
          }

          if (isAi) {
            return (
                <div key={msg.id} className="flex justify-center my-4">
                      <div className="bg-white border border-blue-200 rounded-xl p-4 max-w-md w-full shadow-sm">
                          <div className="flex items-center space-x-2 mb-2 pb-2 border-b border-gray-100">
                              <Sparkles size={14} className="text-blue-500" />
                              <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Tixo Assistant</span>
                          </div>
                          <p className="text-gray-700 text-sm leading-relaxed">{msg.content}</p>
                      </div>
                  </div>
            )
          }

          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              {!isMe && <div className="w-8 h-8 rounded-full bg-gray-200 mr-2 flex-shrink-0 overflow-hidden border border-gray-200"><img src={USERS.find(u => u.id === msg.senderId)?.avatarUrl} className="w-full h-full object-cover" /></div>}
              
              <div className={`max-w-[70%] px-4 py-3 shadow-sm ${
                isMe 
                  ? 'bg-tixo-accent text-white rounded-2xl rounded-tr-none font-medium' 
                  : 'bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-tl-none'
              }`}>
                <p className="text-sm md:text-base">{msg.content}</p>
                <span className={`text-[10px] mt-1 block text-right ${isMe ? 'text-white/80' : 'text-gray-400'}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Warning/Info Banner */}
      {warning && (
        <div className={`absolute bottom-20 left-6 right-6 p-3 rounded-xl shadow-lg flex items-center animate-bounce ${warning.type === 'error' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`}>
          {warning.type === 'error' ? <ShieldAlert className="mr-2" size={20} /> : <Info className="mr-2" size={20} />}
          <span className="text-sm font-bold">{warning.msg}</span>
        </div>
      )}

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center bg-gray-50 rounded-2xl px-4 py-3 ring-1 ring-gray-200 focus-within:ring-tixo-accent transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-400"
            disabled={currentUser?.isSuspended}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || currentUser?.isSuspended}
            className="ml-3 text-tixo-accent disabled:text-gray-400 hover:scale-110 transition-transform"
          >
            <Send size={22} />
          </button>
        </div>
        {currentUser?.isSuspended && (
           <p className="text-xs text-red-500 text-center mt-2 font-bold">Your messaging privileges are suspended.</p>
        )}
      </div>
    </div>
  );
};
