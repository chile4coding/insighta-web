"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../../../../contexts/AuthContext";
import { getProfile, Profile } from "../../../../lib/api";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  MapPin,
  Calendar,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function ProfileDetailPage() {
  const { user, loading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchProfile = useCallback(
    async (signal?: AbortSignal) => {
      try {
        setLoadingProfile(true);
        setError(null);
        const data = await getProfile(id);
        if (!signal?.aborted) {
          setProfile(data);
        }
      } catch (err) {
        if (!signal?.aborted) {
          setError(
            err instanceof Error ? err.message : "Failed to load profile",
          );
        }
      } finally {
        if (!signal?.aborted) {
          setLoadingProfile(false);
        }
      }
    },
    [id],
  );

  useEffect(() => {
    if (loading || !user) return;

    abortControllerRef.current = new AbortController();
    fetchProfile(abortControllerRef.current.signal);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [user, loading, fetchProfile]);

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
          Please sign in to view profile details
        </p>
        <a
          href="/login"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg">
          Sign In
        </a>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back
      </button>

      {loadingProfile ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      ) : profile ? (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
            <h1 className="text-2xl font-bold text-white">Profile Details</h1>
            <p className="text-blue-100 mt-1">Viewing profile information</p>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500 flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  Full Name
                </label>
                <p className="text-lg text-gray-900">{profile.name}</p>
              </div>

              {/* Gender */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">
                  Gender
                </label>
                <p className="text-lg text-gray-900 capitalize">
                  {profile.gender || "Not specified"}
                </p>
                {profile.gender_probability != null && (
                  <p className="text-xs text-gray-500">
                    Confidence:{" "}
                    {Math.round(Number(profile.gender_probability) * 100)}%
                  </p>
                )}
              </div>

              {/* Age */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Age</label>
                <p className="text-lg text-gray-900">
                  {profile.age !== null ? profile.age : "Not available"}
                </p>
              </div>

              {/* Age Group */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">
                  Age Group
                </label>
                <p className="text-lg text-gray-900 capitalize">
                  {profile.age_group || "Unclassified"}
                </p>
              </div>

              {/* Country */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  Country
                </label>
                <p className="text-lg text-gray-900">
                  {profile.country_name ||
                    profile.country_id ||
                    "Not available"}
                </p>
                {profile.country_probability != null && (
                  <p className="text-xs text-gray-500">
                    Confidence:{" "}
                    {Math.round(Number(profile.country_probability) * 100)}%
                  </p>
                )}
              </div>

              {/* Created At */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Created
                </label>
                <p className="text-lg text-gray-900">
                  {new Date(profile.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Profile ID */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <label className="text-sm font-medium text-gray-500">
                Profile ID
              </label>
              <p className="text-sm text-gray-600 font-mono mt-1">
                {profile.id}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
