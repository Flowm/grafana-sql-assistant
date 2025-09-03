import React from 'react';

interface ChatHeaderProps {
  clearChat: () => void;
  isGenerating: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ clearChat, isGenerating }) => (
  <div className="flex justify-end items-center mb-md">
    <button
      onClick={clearChat}
      disabled={isGenerating}
      className="px-3 py-2 text-sm font-medium text-secondary hover:text-primary hover:bg-surface rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Clear Chat
    </button>
  </div>
);
