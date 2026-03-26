import { FC, ReactNode, useState } from 'react';
import { Header } from './header';
import { Sidebar } from './sidebar';
import {cn} from "@/shared/lib/utils";

interface LayoutProps {
  children: ReactNode;
}

export const Layout: FC<LayoutProps> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleToggleSidebar = () => setIsSidebarOpen(true);
    const handleCloseSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="flex h-screen bg-admin-bg overflow-hidden relative">
            <div className="hidden md:block border-r border-gray-200">
                <Sidebar />
            </div>

            <div
                className={cn(
                    "fixed inset-0 z-50 md:hidden transition-all duration-300",
                    isSidebarOpen ? "visible" : "invisible delay-300"
                )}
            >
                <div
                    onClick={handleCloseSidebar}
                    className={cn(
                        "fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-in-out",
                        isSidebarOpen ? "opacity-100" : "opacity-0"
                    )}
                />

                <div
                    className={cn(
                        "fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out",
                        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    )}
                >
                    <Sidebar onNavigate={handleCloseSidebar} isMobile />
                </div>
            </div>

            <div className="flex-1 flex flex-col min-w-0">
                <Header onToggleSidebar={handleToggleSidebar} />
                <main className="flex-1 overflow-auto p-4 sm:p-6 bg-gray-50/50">
                    {children}
                </main>
            </div>
        </div>
    );
};
