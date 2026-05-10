import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BarChart3, FileText, AlertCircle, Scale } from 'lucide-react';

interface SidebarProps {
  associationName?: string;
  category?: string;
  systemMode?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  associationName = "ST. HELENA MEDICAL",
  category = "FINANCIAL",
  systemMode = "CENTRAL"
}) => {
  const router = useRouter();

  const menuItems = [
    { icon: BarChart3, label: 'Dashboard', href: '/dashboard' },
    { icon: FileText, label: 'Records', href: '/records' },
    { icon: AlertCircle, label: 'Audit & Anomalies', href: '/audit' },
    { icon: Scale, label: 'Legal Write-Ups', href: '/legal' },
  ];

  return (
    <div className="w-52 bg-gray-50 border-r border-gray-300 flex flex-col min-h-screen">
      <div className="p-6 border-b border-gray-300">
        <div className="text-xs text-gray-500 font-semibold mb-2">AUDIT-AT-A-CLICK / V1</div>
        <h1 className="text-lg font-bold text-black leading-tight">AUDIT<br />AT-A-CLICK</h1>
        <div className="text-xs text-gray-600 mt-3 font-medium">{associationName}</div>
      </div>

      <div className="px-6 py-4">
        <div className="text-xs font-bold text-gray-500 mb-4">WORKSPACE</div>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = router.pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <a
                  className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors ${
                    isActive
                      ? 'bg-gray-800 text-white font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </a>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto px-6 py-4 border-t border-gray-300 space-y-2">
        <div className="text-xs text-gray-600">User</div>
        <div className="flex gap-2 text-xs text-gray-700 font-medium">
          <span>{category}</span>
          <span>•</span>
          <span>{systemMode}</span>
        </div>
      </div>
    </div>
  );
};
