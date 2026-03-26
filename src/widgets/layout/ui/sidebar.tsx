import { FC } from 'react';
import { NavLink } from 'react-router-dom';

import { useI18n } from '@/shared/lib/i18n';
import { cn } from '@/shared/lib/utils';

interface NavItem {
  path: string;
  label: string;
  icon?: string;
}

interface SidebarProps {
  onNavigate?: () => void;
  isMobile?: boolean;
}

export const Sidebar: FC<SidebarProps> = ({ onNavigate, isMobile }) => {
  const { t } = useI18n();

  const navItems: NavItem[] = [
    { path: '/programs', label: t('nav.programs'), icon: '📋' },
    { path: '/categories', label: t('nav.categories'), icon: '📁' },
    { path: '/skills', label: t('nav.skills'), icon: '🎯' },
    { path: '/tasks', label: t('nav.tasks'), icon: '✅' },
    { path: '/users', label: t('nav.users'), icon: '👥' },
    { path: '/reviews', label: t('nav.reviews'), icon: '⭐' },
    { path: '/cities', label: t('nav.cities'), icon: '🏙️' },
    { path: '/city-groups', label: t('nav.cityGroups'), icon: '📍' },
  ];

    return (
        <aside className="w-full h-full bg-[#002640] text-gray-900 flex flex-col">
            <div className="p-6 flex items-center justify-between">
                {isMobile && (
                    <button
                        onClick={onNavigate}
                        className="p-2 -mr-2 text-white hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            <nav className="flex-1 p-4 overflow-y-auto">
                <ul className="space-y-2">
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                onClick={onNavigate}
                                className={({ isActive }) =>
                                    cn(
                                        'flex items-center gap-3 px-4 py-2 rounded-lg transition-colors',
                                        isActive
                                            ? ' text-white ring-1 ring-[#fff] hover:bg-gray-700'
                                            : 'text-white hover:bg-gray-700 hover:text-white ring-1 ring-primary-600'
                                    )
                                }
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span>{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};