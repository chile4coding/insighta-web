"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getDashboard, getProfiles } from "../../lib/api";
import { LayoutDashboard, Users, FileText, Search, User } from "lucide-react";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState({
    totalProfiles: 0,
    maleProfiles: 0,
    femaleProfiles: 0,
    recentProfiles: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboard();

        setStats({
          totalProfiles: data.totalUsers,
          maleProfiles: data.totalMale,
          femaleProfiles: data.totalFemale,
          recentProfiles: data.recentProfiles,
        });
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-500 mb-4">
          Please sign in to view the dashboard
        </p>
        <a
          href="/login"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Sign In
        </a>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Profiles
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {stats.totalProfiles.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <User className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Male Profiles
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {stats.maleProfiles.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-pink-500 rounded-md p-3">
                <User className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Female Profiles
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {stats.femaleProfiles.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Recent (7 days)
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {stats.recentProfiles.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <a
              href="/dashboard/profiles"
              className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <Users className="h-5 w-5 text-gray-400" />
              <div className="flex-1 min-w-0">
                <span className="absolute inset-0" aria-hidden="true"></span>
                <p className="text-sm font-medium text-gray-900">
                  Browse Profiles
                </p>
                <p className="text-sm text-gray-500">
                  View and filter all profiles
                </p>
              </div>
            </a>

            <a
              href="/dashboard/search"
              className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <Search className="h-5 w-5 text-gray-400" />
              <div className="flex-1 min-w-0">
                <span className="absolute inset-0" aria-hidden="true"></span>
                <p className="text-sm font-medium text-gray-900">
                  Natural Language Search
                </p>
                <p className="text-sm text-gray-500">
                  Search using plain English queries
                </p>
              </div>
            </a>

            {user?.role === "admin" && (
              <a
                href="/dashboard/profiles/create"
                className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <FileText className="h-5 w-5 text-gray-400" />
                <div className="flex-1 min-w-0">
                  <span className="absolute inset-0" aria-hidden="true"></span>
                  <p className="text-sm font-medium text-gray-900">
                    Create Profile
                  </p>
                  <p className="text-sm text-gray-500">
                    Add new profile to database
                  </p>
                </div>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
