"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../contexts/AuthContext";
import {
  UserPlus,
  ChevronLeft,
  User,
  MapPin,
  Calendar,
  Venus,
  Mars,
} from "lucide-react";
import { createProfile, Profile } from "@/lib/api";

export default function CreateProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdProfile, setCreatedProfile] = useState<Profile | null>(null);

  const isAdmin = user?.role === "admin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    try {
      setCreating(true);
      setError(null);
      const response = await createProfile(name.trim());
      setCreatedProfile(response);
    } catch (err) {
      setError(err instanceof Error ? err?.message : "failed to load profiles");
    } finally {
      setCreating(false);
    }
  };

  const handleCreateAnother = () => {
    setCreatedProfile(null);
    setName("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-500 mb-4">
          You don&apos;t have permission to access this page.
        </p>
        <button
          onClick={() => router.push("/dashboard/profiles")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Back to Profiles
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      {/* Back link */}
      <button
        onClick={() => router.push("/dashboard/profiles")}
        className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to Profiles
      </button>

      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <UserPlus className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">Create Profile</h1>
      </div>

      {/* Form card */}
      <div className="bg-white rounded-xl shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="profile-name"
              className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setCreatedProfile(null);
              }}
              placeholder="Enter full name"
              autoFocus
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => router.push("/dashboard/profiles")}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center gap-2">
              {creating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Profile"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Success Result Card */}
      {createdProfile && (
        <div className="mt-6 bg-white rounded-xl shadow overflow-hidden">
          {/* Card header */}
          <div className="bg-green-50 border-b border-green-100 px-6 py-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <p className="text-sm font-medium text-green-700">
              Profile created successfully
            </p>
          </div>

          {/* Avatar + name */}
          <div className="px-6 pt-6 pb-4 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <User className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {createdProfile.name}
              </h2>
              <p className="text-xs text-gray-400 font-mono mt-0.5">
                {createdProfile.id}
              </p>
            </div>
          </div>

          {/* Stats grid */}
          <div className="px-6 pb-6 grid grid-cols-2 gap-3">
            {/* Gender */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-1">
                {createdProfile.gender === "female" ? (
                  <Venus className="w-3.5 h-3.5 text-pink-500" />
                ) : (
                  <Mars className="w-3.5 h-3.5 text-blue-500" />
                )}
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  Gender
                </span>
              </div>
              <p className="text-sm font-semibold text-gray-800 capitalize">
                {createdProfile.gender}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {(createdProfile.gender_probability || 0 * 100).toFixed(0)}%
                confidence
              </p>
            </div>

            {/* Age */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Calendar className="w-3.5 h-3.5 text-purple-500" />
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  Age
                </span>
              </div>
              <p className="text-sm font-semibold text-gray-800">
                {createdProfile.age} yrs
              </p>
              <p className="text-xs text-gray-400 mt-0.5 capitalize">
                {createdProfile.age_group}
              </p>
            </div>

            {/* Country */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <MapPin className="w-3.5 h-3.5 text-orange-500" />
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  Country
                </span>
              </div>
              <p className="text-sm font-semibold text-gray-800">
                {createdProfile.country_name}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {createdProfile.country_id} &middot;{" "}
                {(createdProfile?.country_probability || 0 * 100).toFixed(0)}%
                confidence
              </p>
            </div>

            {/* Created at */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  Created
                </span>
              </div>
              <p className="text-sm font-semibold text-gray-800">
                {new Date(createdProfile.created_at).toLocaleDateString()}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {new Date(createdProfile.created_at).toLocaleTimeString()}
              </p>
            </div>
          </div>

          {/* Card actions */}
          <div className="px-6 pb-6 flex gap-2">
            <button
              onClick={handleCreateAnother}
              className="flex-1 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              Create Another
            </button>
            <button
              onClick={() => router.push("/dashboard/profiles")}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
              View All Profiles
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
