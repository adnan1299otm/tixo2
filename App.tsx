
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { Feed } from './pages/Feed';
import { Reels } from './pages/Reels';
import { Messages } from './pages/Messages';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { CreatePost } from './pages/CreatePost';
import { StoryViewer } from './pages/StoryViewer';
import { getCurrentUser } from './services/authService';
import { User } from './types';

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const location = useLocation();
  // Hide navs on reels and story viewer for immersive experience
  const isImmersive = location.pathname.includes('/reels') || location.pathname.includes('/stories');

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white text-gray-900">
      {!isImmersive && <Sidebar className="hidden md:flex w-64 flex-shrink-0 border-r border-gray-200 bg-white" />}
      
      <main className="flex-1 relative h-full overflow-hidden bg-white">
        {children}
      </main>

      {!isImmersive && <MobileNav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white z-50" />}
    </div>
  );
};

const PrivateRoute: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(getCurrentUser());
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
};

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={
          <PrivateRoute>
            <Feed />
          </PrivateRoute>
        } />
        
        <Route path="/reels" element={
          <PrivateRoute>
            <Reels />
          </PrivateRoute>
        } />
        
        <Route path="/messages" element={
          <PrivateRoute>
            <Messages />
          </PrivateRoute>
        } />

        <Route path="/messages/:conversationId" element={
          <PrivateRoute>
            <Messages />
          </PrivateRoute>
        } />
        
        <Route path="/create" element={
          <PrivateRoute>
            <CreatePost />
          </PrivateRoute>
        } />
        
        <Route path="/profile/:username" element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />

        <Route path="/stories/:userId" element={
          <PrivateRoute>
            <StoryViewer />
          </PrivateRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
