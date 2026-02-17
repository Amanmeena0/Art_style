import type { LucideIcon } from 'lucide-react';

interface SidebarButtonProps {
  icon?: LucideIcon;
  label: string;
  onClick?: () => void;
  isActive?: boolean;
}

export default function SidebarButton({ icon: Icon, label, onClick, isActive }: SidebarButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
        isActive
          ? 'bg-blue-600 text-white'
          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
      }`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      <span className="text-sm font-medium truncate">{label}</span>
    </button>
  );
}
