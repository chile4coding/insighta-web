"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import {
  getProfiles,
  exportProfiles,
  createProfile,
  deleteProfile,
  Profile,
} from "../../../lib/api";
import Link from "next/link";
import {
  Search,
  Download,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Users,
  UserPlus,
  X,
  Eye,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { COUNTRY_NAME_TO_ISO } from "@/lib/contry-iso";

export default function ProfilesPage() {
  const { user, loading } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProfiles, setTotalProfiles] = useState(0);

  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createName, setCreateName] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<Profile | null>(null);
  const [deleting, setDeleting] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [filters, setFilters] = useState({
    gender: "",
    country_id: "",
    age_group: "",
    min_age: "",
    max_age: "",
    sort_by: "created_at",
    order: "desc",
    limit: 10,
  });

  const isAdmin = user?.role === "admin";

  // Use refs to track state for effect dependencies
  const paramsRef = useRef(filters);
  const pageRef = useRef(page);

  // Keep refs in sync with state (no setState calls, so no re-renders)
  useEffect(() => {
    paramsRef.current = filters;
  }, [filters]);

  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  const loadProfiles = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoadingData(true);
      const params = {
        ...paramsRef.current,
        country_id:
          COUNTRY_NAME_TO_ISO[paramsRef.current.country_id.toLowerCase()] ||
          paramsRef.current.country_id,
        page: pageRef.current,
      };
      const data = await getProfiles(params);
      if (!signal?.aborted) {
        setProfiles(data.data);
        setTotalPages(data.total_pages);
        setTotalProfiles(data.total);
        setPage(data.page);
        setError(null);
      }
    } catch (err) {
      if (!signal?.aborted) {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    } finally {
      if (!signal?.aborted) {
        setLoadingData(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!loading && user) {
      abortControllerRef.current = new AbortController();
      loadProfiles(abortControllerRef.current.signal);
      return () => {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  const handleCloseModal = useCallback(() => {
    setShowCreateModal(false);
    setCreateName("");
    setCreateError(null);
  }, []);

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  }, []);

  const handleExport = useCallback(async () => {
    try {
      const blob = await exportProfiles(paramsRef.current);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `profiles_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to export profiles",
      );
    }
  }, []);

   const handlePageChange = useCallback(
     (newPage: number) => {
       if (newPage >= 1 && newPage <= totalPages) {
         setPage(newPage);
         pageRef.current = newPage;
         loadProfiles();
       }
     },
     [totalPages, loadProfiles],
   );

  const openDeleteModal = useCallback((profile: Profile) => {
    setProfileToDelete(profile);
    setShowDeleteModal(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setProfileToDelete(null);
  }, []);

  const handleDeleteProfile = useCallback(async () => {
    if (!profileToDelete) return;

    try {
      setDeleting(true);
      await deleteProfile(profileToDelete.id);
      closeDeleteModal();
      // Reload current page or adjust pagination
      loadProfiles();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete profile"
      );
    } finally {
      setDeleting(false);
    }
  }, [profileToDelete, closeDeleteModal, loadProfiles]);

  useEffect(() => {
    if (!loading && user && profiles.length > 0) {
      abortControllerRef.current = new AbortController();
      loadProfiles(abortControllerRef.current.signal);
      return () => {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page, user, loading]);

  // Close modal on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        handleCloseModal();
      }
    };
    if (showCreateModal) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showCreateModal, handleCloseModal]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleCloseModal();
    };
    if (showCreateModal) {
      document.addEventListener("keydown", handleEsc);
    }
    return () => document.removeEventListener("keydown", handleEsc);
  }, [showCreateModal, handleCloseModal]);

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createName.trim()) {
      setCreateError("Name is required.");
      return;
    }
    try {
      setCreating(true);
      setCreateError(null);

      await createProfile(createName.trim());
      handleCloseModal();
      setPage(1);
      pageRef.current = 1;
      loadProfiles();
    } catch (err) {
      setCreateError(
        err instanceof Error ? err.message : "Failed to create profile",
      );
    } finally {
      setCreating(false);
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
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-500 mb-4">Please sign in to view profiles</p>
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Users className="w-6 h-6 mr-2" />
          Profiles
        </h1>
        <div className="flex gap-2">
          {isAdmin && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center transition-colors">
              <UserPlus className="w-4 h-4 mr-2" />
              Create Profile
            </button>
          )}
          <button
            onClick={handleExport}
            className="px-2 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              value={filters.gender}
              onChange={(e) => handleFilterChange("gender", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
              <option value="">All</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <input
              type="text"
              value={filters.country_id}
              onChange={(e) => handleFilterChange("country_id", e.target.value)}
              placeholder="e.g., NG"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age Group
            </label>
            <select
              value={filters.age_group}
              onChange={(e) => handleFilterChange("age_group", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
              <option value="">All</option>
              <option value="child">Child</option>
              <option value="teenager">Teenager</option>
              <option value="adult">Adult</option>
              <option value="senior">Senior</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Age
            </label>
            <input
              type="number"
              value={filters.min_age}
              onChange={(e) => handleFilterChange("min_age", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Age
            </label>
            <input
              type="number"
              value={filters.max_age}
              onChange={(e) => handleFilterChange("max_age", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </form>
        <div className="flex justify-between items-center mt-4">
          <div className="flex gap-2">
            <select
              value={filters.sort_by}
              onChange={(e) => handleFilterChange("sort_by", e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm">
              <option value="created_at">Created</option>
              <option value="age">Age</option>
              <option value="gender_probability">Gender Prob</option>
            </select>
            <button
              type="button"
              onClick={() => {
                setFilters((prev) => ({
                  ...prev,
                  order: prev.order === "asc" ? "desc" : "asc",
                }));
              }}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm flex items-center">
              <ArrowUpDown className="w-4 h-4 mr-1" />
              {filters.order === "asc" ? "Asc" : "Desc"}
            </button>
            <button
              type="button"
              onClick={() => {
                setPage(1);
                pageRef.current = 1;
                loadProfiles();
              }}
              className="px-4 py-1 bg-blue-600 text-white rounded-md text-sm flex items-center">
              <Search className="w-4 h-4 mr-1" />
              Apply
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Profiles Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loadingData ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gender
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Age
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Group
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Country
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {profiles.map((profile) => (
                    <tr key={profile.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {profile.id.slice(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {profile.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                        {profile.gender || "Not specified"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {profile.age !== null ? profile.age : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {profile.age_group || "Unclassified"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {profile.country_name || profile.country_id || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(profile.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/dashboard/profiles/${profile.id}`}
                            className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors">
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Link>
                          {isAdmin && (
                            <button
                              onClick={() => openDeleteModal(profile)}
                              className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors">
                              <Trash2 className="w-3 h-3 mr-1" />
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {(page - 1) * filters.limit + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(page * filters.limit, totalProfiles)}
                  </span>{" "}
                  of <span className="font-medium">{totalProfiles}</span>{" "}
                  results
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 flex items-center">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Prev
                  </button>
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 flex items-center">
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

       {/* Create Profile Modal */}
       {showCreateModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center">
           {/* Backdrop */}
           <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

           {/* Modal */}
           <div
             ref={modalRef}
             className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6 animate-in fade-in zoom-in-95 duration-200">
             {/* Header */}
             <div className="flex items-center justify-between mb-5">
               <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                 <UserPlus className="w-5 h-5 text-blue-600" />
                 Create Profile
               </h2>
               <button
                 onClick={handleCloseModal}
                 className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                 <X className="w-5 h-5" />
               </button>
             </div>

             {/* Form */}
             <form onSubmit={handleCreateProfile} className="space-y-4">
               <div>
                 <label
                   htmlFor="profile-name"
                   className="block text-sm font-medium text-gray-700 mb-1">
                   Name <span className="text-red-500">*</span>
                 </label>
                 <input
                   id="profile-name"
                   type="text"
                   value={createName}
                   onChange={(e) => setCreateName(e.target.value)}
                   placeholder="Enter full name"
                   autoFocus
                   className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                 />
               </div>

               {createError && (
                 <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                   {createError}
                 </p>
               )}

               {/* Actions */}
               <div className="flex justify-end gap-2 pt-1">
                 <button
                   type="button"
                   onClick={handleCloseModal}
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
         </div>
       )}

       {/* Delete Confirmation Modal */}
       {showDeleteModal && profileToDelete && (
         <div className="fixed inset-0 z-50 flex items-center justify-center">
           {/* Backdrop */}
           <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

           {/* Modal */}
           <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6 animate-in fade-in zoom-in-95 duration-200">
             {/* Header */}
             <div className="flex items-center justify-between mb-5">
               <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                 <AlertTriangle className="w-5 h-5 text-red-600" />
                 Delete Profile
               </h2>
               <button
                 onClick={closeDeleteModal}
                 className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                 <X className="w-5 h-5" />
               </button>
             </div>

             {/* Confirmation Message */}
             <div className="space-y-4">
               <p className="text-sm text-gray-600">
                 Are you sure you want to delete the profile for{" "}
                 <span className="font-semibold text-gray-900">
                   {profileToDelete.name}
                 </span>
                 ? This action cannot be undone.
               </p>

               {error && (
                 <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                   {error}
                 </p>
               )}

               {/* Actions */}
               <div className="flex justify-end gap-2 pt-1">
                 <button
                   type="button"
                   onClick={closeDeleteModal}
                   disabled={deleting}
                   className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50">
                   Cancel
                 </button>
                 <button
                   type="button"
                   onClick={handleDeleteProfile}
                   disabled={deleting}
                   className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center gap-2">
                   {deleting ? (
                     <>
                       <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                       Deleting...
                     </>
                   ) : (
                     <>
                       <Trash2 className="w-4 h-4" />
                       Delete
                     </>
                   )}
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}
     </div>
   );
}
