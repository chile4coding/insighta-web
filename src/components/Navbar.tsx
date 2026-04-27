"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import {
  LogOut,
  User,
  LayoutDashboard,
  Search,
  FileText,
  Users,
} from "lucide-react";
import { logout } from "@/lib/api";

export default function Navbar() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/profiles", label: "Profiles", icon: Users },
    { href: "/dashboard/search", label: "Search", icon: Search },
  ];

  if (user?.role === "admin") {
    navItems.push({
      href: "/dashboard/profiles/create",
      label: "Create",
      icon: FileText,
    });
  }

  return user ? (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="shrink-0 flex items-center">
              <Link
                href="/dashboard"
                className="text-xl font-bold text-gray-900">
                Insighta Labs+
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
                      isActive
                        ? "border-blue-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}>
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center">
            {!loading && user && (
              <>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">
                    <User className="w-4 h-4 inline mr-1" />
                    {user.username}
                  </span>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    {user.role}
                  </span>
                </div>
                <Link
                  href="/account"
                  className="ml-4 p-2 rounded-full hover:bg-gray-100">
                  <User className="w-5 h-5 text-gray-500" />
                </Link>

                <button
                  onClick={() => logout()}
                  className="ml-2 p-2 rounded-full hover:bg-gray-100 text-red-500">
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  ) : null;
}
