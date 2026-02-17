import { Plus, MessageSquare, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

interface SidebarProps {
  onNewChat?: () => void;
  chatHistory?: Array<{ id: string; title: string }>;
  onSelectChat?: (id: string) => void;
  onDeleteChat?: (id: string) => void;
}

export default function Sidebar({ onNewChat, chatHistory = [], onSelectChat, onDeleteChat }: SidebarProps) {
  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null);
  return (
    <div className="w-64 bg-gray-900 text-white h-screen flex flex-col p-4 border-r border-gray-700">
      {/* New Chat Button */}
      <Button
        onClick={onNewChat}
        className="w-full mb-6 bg-gray-800 hover:bg-gray-700 text-white border border-gray-600"
        variant="outline"
      >
        <Plus className="w-4 h-4 mr-2" />
        New Chat
      </Button>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto">
        <h3 className="text-xs font-semibold text-gray-400 mb-4 uppercase tracking-wider">
          Chat History
        </h3>
        <div className="space-y-2">
          {chatHistory.length > 0 ? (
            chatHistory.map((chat) => (
              <div
                key={chat.id}
                onMouseEnter={() => setHoveredChatId(chat.id)}
                onMouseLeave={() => setHoveredChatId(null)}
                className="flex items-center gap-2 group"
              >
                <button
                  onClick={() => onSelectChat?.(chat.id)}
                  className="flex-1 text-left px-3 py-2 rounded hover:bg-gray-800 text-sm text-gray-300 hover:text-white transition-colors truncate"
                >
                  <MessageSquare className="w-3 h-3 mr-2 inline" />
                  {chat.title}
                </button>
                {hoveredChatId === chat.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteChat?.(chat.id);
                      setHoveredChatId(null);
                    }}
                    className="p-1.5 rounded hover:bg-red-600/20 text-gray-400 hover:text-red-400 transition-colors shrink-0"
                    title="Delete chat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-500">No chat history yet</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-700 pt-4 mt-4">
        <button className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors">
          Settings
        </button>
      </div>
    </div>
  );
}
