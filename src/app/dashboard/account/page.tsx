"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { User, LogOut, Mail, User as UserIcon, Calendar } from "lucide-react";
import { logout } from "../../../lib/api";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AccountPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Account Settings
      </h1>

      <div className="max-w-2xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <UserIcon className="w-5 h-5 mr-2" />
              Profile Information
            </h2>
          </div>
          <div className="px-6 py-5">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 rounded-full p-3 mr-4">
                {user?.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt="User avatar"
                    className="w-8 h-8 rounded-full object-cover"
                    width={5}
                    height={5}
                  />
                ) : (
                  <User className="w-8 h-8 text-blue-600" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {user.username}
                </h3>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center text-gray-600">
                <User className="w-4 h-4 mr-2" />
                <span className="text-sm">User ID</span>
              </div>
              <div className="text-sm font-mono text-gray-900">{user.id}</div>

              <div className="flex items-center text-gray-600">
                <Mail className="w-4 h-4 mr-2" />
                <span className="text-sm">Email</span>
              </div>
              <div className="text-sm text-gray-900">{user.email}</div>

              <div className="flex items-center text-gray-600">
                <User className="w-4 h-4 mr-2" />
                <span className="text-sm">Role</span>
              </div>
              <div>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                  {user.role}
                </span>
              </div>

              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="text-sm">Member Since</span>
              </div>
              <div className="text-sm text-gray-900">
                {new Date(user.createdAt).toLocaleDateString()}
              </div>

              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="text-sm">Last Login</span>
              </div>
              <div className="text-sm text-gray-900">
                {user.lastLoginAt
                  ? new Date(user.lastLoginAt).toLocaleString()
                  : "N/A"}
              </div>
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Account Status
            </h2>
          </div>
          <div className="px-6 py-5">
            <div className="flex items-center">
              <span
                className={`h-2 w-2 rounded-full mr-3 ${
                  user.isActive ? "bg-green-400" : "bg-red-400"
                }`}></span>
              <span className="text-sm text-gray-600">
                Account is{" "}
                <span className="font-medium text-gray-900">
                  {user.isActive ? "active" : "inactive"}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Sign Out */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Sign Out</h2>
          </div>
          <div className="px-6 py-5">
            <p className="text-sm text-gray-600 mb-4">
              Sign out of your account on this device.
            </p>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50">
              <LogOut className="w-4 h-4 mr-2" />
              {isLoggingOut ? "Signing out..." : "Sign Out"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
